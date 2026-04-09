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

export type OnboardingRecommendations = {
    headlines: string[];
    industries: string[];
    topics: string[];
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
    headline: 'Moly 产品负责人，正在做面向商务人士的 AI 秘书产品',
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
        .slice(0, 18);

export const generateIndustrySuggestions = (profile: DigitalCardProfile) => {
    const commonSuggestions = ['AI', '产品', '创业', '设计', '投资', '增长', '效率工具', '商务协同', 'ENTJ', 'INTJ', '长期主义', '0到1', '商业化', '用户洞察', 'B2B', '出海', '创始人思维', '项目推进'];
    const seeds = [
        ...profile.industry,
        profile.notes.includes('AI') ? 'AI' : '',
        profile.notes.includes('产品') || profile.position.includes('产品') ? '产品' : '',
        profile.notes.includes('创业') ? '创业' : '',
        profile.notes.includes('投资') ? '投资' : '',
        profile.notes.includes('效率') ? '效率工具' : '',
        profile.notes.includes('商务') ? '商务协同' : '',
        profile.notes.includes('设计') ? '设计' : '',
        profile.notes.includes('增长') ? '增长' : '',
        profile.notes.includes('创始') || profile.notes.includes('创业') ? '创业' : '',
        profile.notes.includes('商业') ? '商业化' : '',
        profile.notes.includes('协同') ? '协同' : '',
        profile.position ? profile.position.slice(0, 6) : '',
        profile.company ? `${profile.company.slice(0, 6)}相关` : '',
        ...commonSuggestions,
    ];

    return [...new Set(normalizeIndustries(seeds))].slice(0, 18);
};

export const generateHeadlineCandidates = (profile: DigitalCardProfile) => {
    const company = profile.company || '当前项目';
    const position = profile.position || '负责人';
    const primaryIndustry = profile.industry[0] || '产品';
    const secondaryIndustry = profile.industry[1] || 'AI';
    const cleanedNotes = profile.notes.replace(/\s+/g, '').replace(/[。！!？?]/g, '，');
    const notesLead = cleanedNotes.split('，').find((item) => item && item.length >= 6) || '正在推进一个长期投入的新方向';

    return [
        `${company}${position}，正在做${primaryIndustry}方向的新产品探索`.slice(0, 36),
        `我是${primaryIndustry}领域的${position}，想把复杂问题做成顺手体验`.slice(0, 36),
        `${notesLead}`.slice(0, 36) || `持续关注${secondaryIndustry}与${primaryIndustry}交叉带来的新机会`.slice(0, 36),
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

export const generateIndustrySuggestionsWithAI = async (profile: DigitalCardProfile) => {
    const fallback = generateIndustrySuggestions(profile);

    try {
        const data = await requestMiniMaxChat({
            temperature: 0.4,
            messages: [
                {
                    role: 'system',
                    content:
                        '你是一位擅长为个人名片提炼标签的商务品牌顾问。请严格只输出 JSON 数组，不要输出任何解释、Markdown 或额外文字。',
                },
                {
                    role: 'user',
                    content: `请根据以下数字名片信息，生成 15 到 18 个适合放在个人名片上的标签建议，供用户勾选。\n\n${buildProfileContext(profile)}\n\n要求：\n1. 输出格式必须是严格 JSON 数组，如 ["标签1","标签2",...]\n2. 目标数量是 15 到 18 个，最少不要少于 15 个\n3. 每个标签控制在 2 到 8 个中文字符之间，英文人格标签如 ENTJ、INTJ 可以保留\n4. 标签要能帮助别人快速理解这个人的领域、角色、项目方向、合作场景或做事风格\n5. 优先具体、自然、有识别度，不要太泛\n6. 可以适量包含 1 到 2 个像 ENTJ、INTJ、长期主义 这样的通用风格标签\n7. 不要出现姓名，不要出现公司全称堆砌\n8. 不要输出序号、解释或分类标题`,
                },
            ],
        });

        const parsed = parseJsonFromText<unknown>(getMiniMaxText(data));
        const normalized = normalizeIndustries(normalizeStringArray(parsed, 18, 8));
        return normalized.length >= 15 ? normalized : fallback;
    } catch (error) {
        console.warn('MiniMax industry suggestion generation failed, using fallback.', error);
        return fallback;
    }
};

export const generateOnboardingRecommendationsWithAI = async (
    profile: DigitalCardProfile,
): Promise<OnboardingRecommendations> => {
    const fallback: OnboardingRecommendations = {
        headlines: generateHeadlineCandidates(profile),
        industries: generateIndustrySuggestions(profile),
        topics: generateTopics(profile),
    };

    try {
        const data = await requestMiniMaxChat({
            temperature: 0.4,
            messages: [
                {
                    role: 'system',
                    content:
                        '你是一位非常擅长个人品牌包装、名片首页文案和标签提炼的商务社交顾问。你的风格是：精准、有记忆点、有一点点锋芒，但依然真实可信。请严格只输出 JSON 对象，不要输出任何解释、Markdown 或额外文字。',
                },
                {
                    role: 'user',
                    content: `请根据以下数字名片信息，一次性生成这三组内容：\n1. 适合放在名片首页的一句话介绍候选 3 条\n2. 适合放在名片上的标签建议 15 到 18 个\n3. 适合聊什么的话题方向 3 条\n\n${buildProfileContext(profile)}\n\n输出格式必须严格为：\n{"headlines":["候选1","候选2","候选3"],"industries":["标签1","标签2","标签3"],"topics":["话题1","话题2","话题3"]}\n\n要求：\n1. headlines 恰好 3 条，每条控制在 24 到 36 个中文字符之间\n2. 每条 headline 都要尽量同时交代：我是谁、我在做什么、我所在的领域\n3. headline 要比普通自我介绍更有吸引力、更有记忆点，可以略带锋芒和主张，但不能油腻、不能浮夸到失真\n4. 不要写成简历标题，不要空泛，不要出现“赋能”“引领”“生态”“颠覆”这类空洞大词\n5. industries 目标数量 15 到 18 个，最少不要少于 15 个，每个标签控制在 2 到 8 个中文字符之间，可少量包含 ENTJ、INTJ、长期主义 这类风格标签\n6. 标签不要太教科书，要更像这个人会被别人记住的关键词，允许混合领域、角色、合作方式、风格气质\n7. topics 恰好 3 条，每条不超过 15 个中文字符，要让人一看就觉得“这个可以展开聊”\n8. 所有内容都要自然、可信、有信息量，不要出现姓名，不要输出序号或解释`,
                },
            ],
        });

        const parsed = parseJsonFromText<{
            headlines?: unknown;
            industries?: unknown;
            topics?: unknown;
        }>(getMiniMaxText(data));

        const headlines = normalizeStringArray(parsed?.headlines, 3, 36);
        const industries = normalizeIndustries(normalizeStringArray(parsed?.industries, 18, 8));
        const topics = normalizeStringArray(parsed?.topics, 3, 15);

        if (headlines.length !== 3 || industries.length < 15 || topics.length !== 3) {
            return fallback;
        }

        return {
            headlines,
            industries,
            topics,
        };
    } catch (error) {
        console.warn('MiniMax onboarding recommendation generation failed, using fallback.', error);
        return fallback;
    }
};

export const polishProfileCopy = (profile: DigitalCardProfile) => {
    const primaryIndustry = profile.industry[0] || 'AI 产品';
    const secondaryIndustry = profile.industry[1] || '商业合作';
    const compactNotes = profile.notes
        .replace(/\s+/g, '')
        .replace(/[。！？]/g, '。')
        .slice(0, Math.max(40, Math.min(profile.notes.length + 8, 120)));

    return {
        headline: `${profile.company || '当前项目'}${profile.position || ''}，正在做${primaryIndustry}方向的产品探索`.slice(0, 36),
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
                        '你是一位擅长个人品牌包装与商务社交表达的文案专家。请严格只输出 JSON 数组，不要输出任何解释、Markdown 或额外文字。',
                },
                {
                    role: 'user',
                    content: `请根据以下用户信息，生成恰好 3 条适合放在数字名片首页的一句话介绍候选。\n\n${buildProfileContext(profile)}\n\n要求：\n1. 输出格式必须是严格 JSON 数组，如 ["候选1","候选2","候选3"]\n2. 每条控制在 24 到 36 个中文字符之间\n3. 每条都尽量同时交代清楚：我是谁、我在做什么、我所在的领域或方向\n4. 三条分别偏向：身份定位版、项目方向版、对外交流版\n5. 读起来要像真实人物会放在个人名片首页的介绍句，而不是简历标题或广告 slogan\n6. 不要出现姓名，不要空泛鸡汤，不要使用“赋能”“引领”“生态”等空洞大词\n7. 优先自然、可信、有信息量，让别人一眼就知道这个人值不值得继续聊`,
                },
            ],
        });

        const parsed = parseJsonFromText<unknown>(getMiniMaxText(data));
        const normalized = normalizeStringArray(parsed, 3, 36);
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
                    content: `请基于以下名片信息，对 headline、适合聊什么、notes 做统一润色。\n\n${buildProfileContext(profile)}\n\n输出格式必须严格为：\n{"headline":"润色后的一句话概括","topics":["话题1","话题2","话题3"],"notes":"润色后的个人介绍"}\n\n要求：\n1. headline 控制在 24 到 36 个中文字符之间\n2. headline 尽量交代出：身份、正在做的事、所在领域\n3. topics 恰好 3 条，每条不超过 15 个中文字符\n4. notes 保留原意，不超过原文 120%\n5. 不要出现姓名\n6. 避免空洞大词，优先自然可信、有信息量`,
                },
            ],
        });

        const parsed = parseJsonFromText<{
            headline?: unknown;
            topics?: unknown;
            notes?: unknown;
        }>(getMiniMaxText(data));

        const headline = String(parsed?.headline || '').trim().slice(0, 36);
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
