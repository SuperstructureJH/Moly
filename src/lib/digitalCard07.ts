import { getMiniMaxText, parseJsonFromText, requestMiniMaxChat } from './minimax';

export type DigitalCardProfile = {
    name: string;
    position: string;
    company: string;
    address: string;
    industry: string[];
    notes: string;
    headline: string;
    topics: string[];
    updatedAt?: string;
};

export type MyCardDraft = {
    mode: 'onboarding' | 'editing';
    step: number;
    profile: DigitalCardProfile;
};

export const MY_CARD_STORAGE_KEY = 'moly_07_my_card_profile';
export const MY_CARD_DRAFT_KEY = 'moly_07_my_card_draft';

export const EMPTY_PROFILE: DigitalCardProfile = {
    name: '',
    position: '',
    company: '',
    address: '',
    industry: [],
    notes: '',
    headline: '',
    topics: [],
};

export const DEMO_COMPLETED_PROFILE: DigitalCardProfile = {
    name: '董江涵',
    position: '产品负责人',
    company: 'Moly',
    address: '北京朝阳',
    industry: ['AI', '产品', '投资'],
    notes: '我正在做一款面向商务人士的 AI 秘书产品，重点在日程、人脉、会议和后续推进的自然协同，也在持续寻找对大模型应用和效率工具有判断的人交流合作。',
    headline: '在做面向商务人士的 AI 秘书',
    topics: ['AI 产品设计', '效率工具机会', '商务场景协同'],
};

export const readStoredJson = <T,>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) as T : null;
    } catch (error) {
        console.warn(`Failed to read storage key ${key}`, error);
        return null;
    }
};

export const writeStoredJson = (key: string, value: unknown) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
};

export const removeStoredJson = (key: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
};

export const cloneProfile = (profile?: Partial<DigitalCardProfile> | null): DigitalCardProfile => ({
    ...EMPTY_PROFILE,
    ...profile,
    industry: Array.isArray(profile?.industry) ? [...profile!.industry] : [],
    topics: Array.isArray(profile?.topics) ? [...profile!.topics] : [],
});

export const getProfileStatus = (profile?: Partial<DigitalCardProfile> | null) => {
    if (!profile) return 'empty';
    const completedFields = [
        profile.name,
        profile.position,
        profile.company,
        profile.headline,
        profile.notes,
        profile.address,
    ].filter(Boolean).length + ((profile.industry?.length || 0) > 0 ? 1 : 0) + ((profile.topics?.length || 0) > 0 ? 1 : 0);

    if (completedFields === 0) return 'empty';
    if (
        profile.name &&
        profile.position &&
        profile.company &&
        profile.headline &&
        profile.notes &&
        (profile.industry?.length || 0) > 0 &&
        (profile.topics?.length || 0) > 0
    ) {
        return 'complete';
    }

    return 'partial';
};

export const getProfileProgress = (profile?: Partial<DigitalCardProfile> | null) => {
    const checklist = [
        Boolean(profile?.name),
        Boolean(profile?.position),
        Boolean(profile?.company),
        Boolean(profile?.headline),
        Boolean(profile?.notes),
        Boolean(profile?.address),
        Boolean(profile?.industry?.length),
        Boolean(profile?.topics?.length),
    ];
    return checklist.filter(Boolean).length;
};

const trimIndustry = (value: string) => value.replace(/[，、]/g, ' ').trim().slice(0, 10);

export const normalizeIndustries = (values: string[]) =>
    values
        .map(trimIndustry)
        .filter(Boolean)
        .slice(0, 10);

export const generateHeadlineCandidates = (profile: DigitalCardProfile) => {
    const company = profile.company || '这家公司';
    const position = profile.position || '核心岗位';
    const primaryIndustry = profile.industry[0] || '产品';
    const secondaryIndustry = profile.industry[1] || '合作';
    const notesLead = profile.notes.replace(/[。！!？?]/g, '，').split('，').find(Boolean) || '正在推进重要项目';

    return [
        `在${company}做${primaryIndustry}${position}`.slice(0, 20),
        `擅长把${primaryIndustry}做成可落地业务`.slice(0, 20),
        `${notesLead}`.slice(0, 20) || `长期关注${secondaryIndustry}合作`.slice(0, 20),
    ];
};

export const generateTopics = (profile: DigitalCardProfile) => {
    const fallback = ['AI 产品思路', '行业合作机会', '最近在做的项目'];
    const candidates = [
        profile.industry[0] ? `${profile.industry[0]}趋势判断` : '',
        profile.industry[1] ? `${profile.industry[1]}合作机会` : '',
        profile.company ? `${profile.company}在做什么` : '',
        profile.position ? `${profile.position}的实战经验` : '',
        profile.notes ? `${profile.notes.slice(0, 8)}延展聊聊` : '',
    ]
        .map(item => item.slice(0, 15))
        .filter(Boolean);

    return [...new Set([...candidates, ...fallback])].slice(0, 3);
};

export const polishProfileCopy = (profile: DigitalCardProfile) => {
    const primaryIndustry = profile.industry[0] || 'AI 产品';
    const secondaryIndustry = profile.industry[1] || '商业合作';
    const compactNotes = profile.notes
        .replace(/\s+/g, '')
        .replace(/[。！？]/g, '。')
        .slice(0, Math.max(40, Math.min(profile.notes.length + 8, 120)));

    return {
        headline: `${profile.company || '团队'}${profile.position || ''}，聚焦${primaryIndustry}`.slice(0, 20),
        topics: [
            `${primaryIndustry}产品策略`.slice(0, 15),
            `${secondaryIndustry}合作交换`.slice(0, 15),
            `${profile.company || '当前项目'}阶段进展`.slice(0, 15),
        ],
        notes: compactNotes || '我正在推进一个长期想做的方向，希望和同频的人继续碰撞想法。',
    };
};

const buildProfileContext = (profile: DigitalCardProfile) => [
    `姓名：${profile.name || ''}`,
    `职位与公司：${profile.position || ''}，${profile.company || ''}`,
    `所在地区：${profile.address || ''}`,
    `行业：${profile.industry.join('、') || ''}`,
    `个人介绍：${profile.notes || ''}`,
    `一句话概括：${profile.headline || ''}`,
].join('\n');

const normalizeStringArray = (payload: unknown, maxItems: number, maxLength: number) =>
    Array.isArray(payload)
        ? payload
            .map((item) => String(item || '').trim())
            .filter(Boolean)
            .slice(0, maxItems)
            .map((item) => item.slice(0, maxLength))
        : [];

export const generateHeadlineCandidatesWithAI = async (profile: DigitalCardProfile) => {
    const fallback = generateHeadlineCandidates(profile);

    try {
        const data = await requestMiniMaxChat({
            temperature: 0.4,
            messages: [
                {
                    role: 'system',
                    content:
                        '你是一位擅长个人品牌定位的文案专家。请严格只输出 JSON 数组，不要输出任何解释、Markdown 或额外文字。',
                },
                {
                    role: 'user',
                    content: `请根据以下用户信息，生成恰好 3 条数字名片首页的一句话概括候选。\n\n${buildProfileContext(profile)}\n\n要求：\n1. 输出格式必须是严格 JSON 数组，如 ["候选1","候选2","候选3"]\n2. 每条不超过 20 个中文字符\n3. 三条分别偏向身份定位、价值主张、经历亮点\n4. 不要出现姓名\n5. 避免空洞大词`,
                },
            ],
        });

        const parsed = parseJsonFromText<unknown>(getMiniMaxText(data));
        const normalized = normalizeStringArray(parsed, 3, 20);
        return normalized.length === 3 ? normalized : fallback;
    } catch (error) {
        console.warn('MiniMax headline generation failed, using fallback.', error);
        return fallback;
    }
};

export const generateTopicsWithAI = async (profile: DigitalCardProfile) => {
    const fallback = generateTopics(profile);

    try {
        const data = await requestMiniMaxChat({
            temperature: 0.4,
            messages: [
                {
                    role: 'system',
                    content:
                        '你是一位专业的商务社交顾问。请严格只输出 JSON 数组，不要输出任何解释、Markdown 或额外文字。',
                },
                {
                    role: 'user',
                    content: `请根据以下数字名片信息，生成恰好 3 条“适合聊什么”的话题方向。\n\n${buildProfileContext(profile)}\n\n要求：\n1. 输出格式必须是严格 JSON 数组，如 ["话题1","话题2","话题3"]\n2. 每条控制在 15 个中文字符以内\n3. 每条都需要具体、有对话价值\n4. 三条之间要有明显差异\n5. 不要出现姓名`,
                },
            ],
        });

        const parsed = parseJsonFromText<unknown>(getMiniMaxText(data));
        const normalized = normalizeStringArray(parsed, 3, 15);
        return normalized.length === 3 ? normalized : fallback;
    } catch (error) {
        console.warn('MiniMax topic generation failed, using fallback.', error);
        return fallback;
    }
};

export const polishProfileCopyWithAI = async (profile: DigitalCardProfile) => {
    const fallback = polishProfileCopy(profile);

    try {
        const data = await requestMiniMaxChat({
            temperature: 0.45,
            messages: [
                {
                    role: 'system',
                    content:
                        '你是一位擅长个人品牌包装的商务文案专家。请严格只输出 JSON 对象，不要输出任何解释、Markdown 或额外文字。',
                },
                {
                    role: 'user',
                    content: `请基于以下名片信息，对 headline、适合聊什么、notes 做统一润色。\n\n${buildProfileContext(profile)}\n\n输出格式必须严格为：\n{"headline":"润色后的一句话概括","topics":["话题1","话题2","话题3"],"notes":"润色后的个人介绍"}\n\n要求：\n1. headline 不超过 20 个中文字符\n2. topics 恰好 3 条，每条不超过 15 个中文字符\n3. notes 保留原意，不超过原文 120%\n4. 不要出现姓名\n5. 避免空洞大词`,
                },
            ],
        });

        const parsed = parseJsonFromText<{
            headline?: unknown;
            topics?: unknown;
            notes?: unknown;
        }>(getMiniMaxText(data));

        const headline = String(parsed?.headline || '').trim().slice(0, 20);
        const topics = normalizeStringArray(parsed?.topics, 3, 15);
        const notes = String(parsed?.notes || '').trim();

        if (!headline || topics.length !== 3 || !notes) {
            return fallback;
        }

        return {
            headline,
            topics,
            notes,
        };
    } catch (error) {
        console.warn('MiniMax polish failed, using fallback.', error);
        return fallback;
    }
};
