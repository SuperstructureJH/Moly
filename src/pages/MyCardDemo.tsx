import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    ArrowLeft,
    Briefcase,
    Building2,
    Check,
    ChevronRight,
    MapPin,
    Mic,
    PencilLine,
    Plus,
    RotateCcw,
    Share2,
    Sparkles,
    Tag,
    X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    cloneProfile,
    DigitalCardProfile,
    DEMO_COMPLETED_PROFILE,
    EMPTY_PROFILE,
    generateHeadlineCandidates,
    generateIndustrySuggestions,
    generateOnboardingRecommendationsWithAI,
    generateTopics,
    getProfileStatus,
    MY_CARD_DRAFT_KEY,
    MY_CARD_STORAGE_KEY,
    MyCardDraft,
    normalizeIndustries,
    polishProfileCopyWithAI,
    readStoredJson,
    removeStoredJson,
    writeStoredJson,
} from '../lib/digitalCard07';

type ScreenMode = 'onboarding' | 'view' | 'editing';
type PolishState = 'idle' | 'loading' | 'preview';

const INDUSTRY_SUGGESTIONS = ['AI', '创投', '产品', '设计', '投资', 'SaaS', '增长', '创业', '品牌', '出海'];
const isFieldHighlighted = (
    field: 'headline' | 'notes' | 'topics',
    currentProfile: DigitalCardProfile,
    originalProfile: DigitalCardProfile | null,
) => {
    if (!originalProfile) return false;
    if (field === 'topics') {
        return JSON.stringify(currentProfile.topics) !== JSON.stringify(originalProfile.topics);
    }
    return currentProfile[field] !== originalProfile[field];
};

const HeroTextField = ({
    editing,
    value,
    placeholder,
    className,
    multiline = false,
    onChange,
    highlighted = false,
    maxLength,
    style,
}: {
    editing: boolean;
    value: string;
    placeholder: string;
    className: string;
    multiline?: boolean;
    onChange: (value: string) => void;
    highlighted?: boolean;
    maxLength?: number;
    style?: React.CSSProperties;
}) => {
    if (!editing) {
        return (
            <div style={style} className={`${className} ${highlighted ? 'bg-[#F3F4F6] px-2 py-1 rounded-[10px]' : ''}`}>
                {value || placeholder}
            </div>
        );
    }

    if (multiline) {
        return (
            <textarea
                value={value}
                maxLength={maxLength}
                style={style}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className={`${className} w-full bg-transparent resize-none outline-none border-b border-[#D1D5DB] pb-2 placeholder:text-[#9CA3AF]`}
                rows={2}
            />
        );
    }

    return (
        <input
            value={value}
            maxLength={maxLength}
            style={style}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className={`${className} w-full bg-transparent outline-none border-b border-[#D1D5DB] pb-2 placeholder:text-[#9CA3AF]`}
        />
    );
};

const BaseInfoRow = ({
    icon,
    label,
    value,
    editing,
    placeholder,
    onChange,
    highlighted = false,
    multiline = false,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    editing: boolean;
    placeholder: string;
    onChange: (value: string) => void;
    highlighted?: boolean;
    multiline?: boolean;
}) => (
    <div className="grid grid-cols-[28px_74px_1fr] gap-3 items-start py-4 border-b border-[#E5E7EB] last:border-b-0">
        <div className="w-7 h-7 rounded-[10px] bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center text-[#6B7280]">
            {icon}
        </div>
        <div className="pt-1 text-[12px] font-medium text-[#6B7280]">{label}</div>
        {editing ? (
            multiline ? (
                <textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    className="min-h-[88px] w-full resize-none bg-transparent text-[14px] leading-6 text-[#171717] outline-none border-b border-[#E5E7EB] pb-2 placeholder:text-[#9CA3AF]"
                />
            ) : (
                <input
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-transparent text-[14px] leading-6 text-[#171717] outline-none border-b border-[#E5E7EB] pb-2 placeholder:text-[#9CA3AF]"
                />
            )
        ) : (
            <div className={`pt-1 text-[14px] leading-6 text-[#171717] ${highlighted ? 'bg-[#F3F4F6] rounded-[10px] px-2 py-1 -ml-2' : ''}`}>
                {value || <span className="text-[#9CA3AF]">{placeholder}</span>}
            </div>
        )}
    </div>
);

const ONBOARDING_EASE = [0.22, 1, 0.36, 1] as const;

const OnboardingField = ({
    label,
    children,
    hint,
    icon,
}: {
    label: string;
    children: React.ReactNode;
    hint?: React.ReactNode;
    icon?: React.ReactNode;
}) => (
    <div className="border-b border-[#E5E7EB] pb-5">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-[#6B7280]">
            {icon ? <span className="text-[#9CA3AF]">{icon}</span> : null}
            <span>{label}</span>
        </div>
        <div className="mt-3">{children}</div>
        {hint ? <div className="mt-3 text-[12px] leading-5 text-[#6B7280]">{hint}</div> : null}
    </div>
);

export const MyCardPhoneView = ({
    onBack,
    initialMode,
    onScreenModeChange,
}: {
    onBack?: () => void;
    initialMode?: 'default' | 'onboarding' | 'completed';
    onScreenModeChange?: (mode: ScreenMode) => void;
}) => {
    const polishTimerRef = useRef<number | null>(null);
    const toastTimerRef = useRef<number | null>(null);
    const onboardingScrollRef = useRef<HTMLDivElement | null>(null);
    const prefersReducedMotion = useReducedMotion();

    const [screenMode, setScreenMode] = useState<ScreenMode>('view');
    const [savedProfile, setSavedProfile] = useState<DigitalCardProfile | null>(null);
    const [profile, setProfile] = useState<DigitalCardProfile>(cloneProfile(EMPTY_PROFILE));
    const [step, setStep] = useState(0);
    const [headlineCandidates, setHeadlineCandidates] = useState<string[]>([]);
    const [industrySuggestions, setIndustrySuggestions] = useState<string[]>(INDUSTRY_SUGGESTIONS);
    const [recommendedTopics, setRecommendedTopics] = useState<string[]>([]);
    const [draftPrompt, setDraftPrompt] = useState<MyCardDraft | null>(null);
    const [industryInput, setIndustryInput] = useState('');
    const [toast, setToast] = useState('');
    const [polishState, setPolishState] = useState<PolishState>('idle');
    const [prePolishProfile, setPrePolishProfile] = useState<DigitalCardProfile | null>(null);
    const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
    const [isCustomIndustryInputOpen, setIsCustomIndustryInputOpen] = useState(false);

    useEffect(() => {
        if (initialMode === 'onboarding') {
            setSavedProfile(null);
            setDraftPrompt(null);
            setProfile(cloneProfile(EMPTY_PROFILE));
            setHeadlineCandidates([]);
            setIndustrySuggestions(INDUSTRY_SUGGESTIONS);
            setRecommendedTopics([]);
            setStep(0);
            setScreenMode('onboarding');
            return;
        }

        if (initialMode === 'completed') {
            const completed = cloneProfile(DEMO_COMPLETED_PROFILE);
            setSavedProfile(completed);
            setDraftPrompt(null);
            setProfile(completed);
            setScreenMode('view');
            return;
        }

        const storedProfile = readStoredJson<DigitalCardProfile>(MY_CARD_STORAGE_KEY);
        const storedDraft = readStoredJson<MyCardDraft>(MY_CARD_DRAFT_KEY);

        if (storedProfile) {
            setSavedProfile(cloneProfile(storedProfile));
            setProfile(cloneProfile(storedProfile));
            setScreenMode('view');
            if (storedDraft?.mode === 'editing') {
                setDraftPrompt(storedDraft);
            }
            return;
        }

        if (storedDraft?.mode === 'onboarding') {
            setProfile(cloneProfile(storedDraft.profile));
            setStep(storedDraft.step || 0);
            setHeadlineCandidates(generateHeadlineCandidates(cloneProfile(storedDraft.profile)));
            setIndustrySuggestions(generateIndustrySuggestions(cloneProfile(storedDraft.profile)));
            setRecommendedTopics(generateTopics(cloneProfile(storedDraft.profile)));
            setScreenMode('onboarding');
            return;
        }

        setScreenMode('onboarding');
        setProfile(cloneProfile(EMPTY_PROFILE));
    }, [initialMode]);

    useEffect(() => {
        if (screenMode === 'onboarding') {
            writeStoredJson(MY_CARD_DRAFT_KEY, { mode: 'onboarding', step, profile } satisfies MyCardDraft);
        }
    }, [screenMode, step, profile]);

    useEffect(() => {
        if (screenMode === 'editing') {
            writeStoredJson(MY_CARD_DRAFT_KEY, { mode: 'editing', step: 0, profile } satisfies MyCardDraft);
        }
    }, [screenMode, profile]);

    useEffect(() => {
        if (step !== 4) {
            setIsCustomIndustryInputOpen(false);
            setIndustryInput('');
        }
    }, [step]);

    useEffect(() => {
        onScreenModeChange?.(screenMode);
    }, [screenMode, onScreenModeChange]);

    useEffect(() => {
        return () => {
            if (polishTimerRef.current) window.clearTimeout(polishTimerRef.current);
            if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
        };
    }, []);

    useEffect(() => {
        if (screenMode !== 'onboarding' || !onboardingScrollRef.current) return;
        onboardingScrollRef.current.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
    }, [screenMode, step, prefersReducedMotion]);

    const showToast = (message: string) => {
        setToast(message);
        if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
        toastTimerRef.current = window.setTimeout(() => setToast(''), 2200);
    };

    const status = useMemo(() => getProfileStatus(savedProfile), [savedProfile]);
    const customIndustries = useMemo(
        () => profile.industry.filter((item) => !industrySuggestions.includes(item)),
        [profile.industry, industrySuggestions],
    );

    const persistSavedProfile = (nextProfile: DigitalCardProfile) => {
        const withUpdatedAt = { ...cloneProfile(nextProfile), updatedAt: new Date().toISOString() };
        writeStoredJson(MY_CARD_STORAGE_KEY, withUpdatedAt);
        removeStoredJson(MY_CARD_DRAFT_KEY);
        setSavedProfile(withUpdatedAt);
        setProfile(withUpdatedAt);
    };

    const nextFromOnboarding = async () => {
        if (step === 2 && isGeneratingRecommendations) {
            return;
        }

        if (step === 0 && !profile.name.trim()) {
            showToast('请先填写名字');
            return;
        }
        if (step === 1 && (!profile.position.trim() || !profile.company.trim())) {
            showToast('职位和公司都需要填写');
            return;
        }
        if (step === 3 && !profile.headline.trim()) {
            showToast('请先选择一句话概括');
            return;
        }
        if (step === 2) {
            setIsGeneratingRecommendations(true);
            try {
                const generated = await generateOnboardingRecommendationsWithAI(profile);
                setHeadlineCandidates(generated.headlines);
                setIndustrySuggestions(generated.industries);
                setRecommendedTopics(generated.topics);
                setProfile((current) => ({
                    ...current,
                    headline: current.headline || generated.headlines[0] || '',
                }));
                setStep((current) => current + 1);
            } finally {
                setIsGeneratingRecommendations(false);
            }
            return;
        }
        if (step === 3) {
            setStep((current) => current + 1);
            return;
        }
        if (step === 4) {
            const completedProfile = {
                ...profile,
                topics: recommendedTopics.length ? recommendedTopics : generateTopics(profile),
            };
            persistSavedProfile(completedProfile);
            setScreenMode('view');
            return;
        }
        setStep((current) => current + 1);
    };

    const startEditing = (resumeDraft?: MyCardDraft | null) => {
        if (resumeDraft?.profile) {
            setProfile(cloneProfile(resumeDraft.profile));
        } else if (savedProfile) {
            setProfile(cloneProfile(savedProfile));
        }
        setDraftPrompt(null);
        setPolishState('idle');
        setPrePolishProfile(null);
        setScreenMode('editing');
    };

    const cancelEditing = () => {
        if (polishTimerRef.current) {
            window.clearTimeout(polishTimerRef.current);
            polishTimerRef.current = null;
        }
        if (savedProfile) {
            setProfile(cloneProfile(savedProfile));
            setScreenMode('view');
        } else {
            setProfile(cloneProfile(EMPTY_PROFILE));
            setScreenMode('onboarding');
            setStep(0);
        }
        setPolishState('idle');
        setPrePolishProfile(null);
        removeStoredJson(MY_CARD_DRAFT_KEY);
    };

    const saveEditing = () => {
        persistSavedProfile(profile);
        setPolishState('idle');
        setPrePolishProfile(null);
        setScreenMode('view');
        showToast(status === 'empty' ? '名片草稿已保存' : '名片已更新');
    };

    const triggerShare = async () => {
        const sharePayload = {
            title: `${profile.name || 'Moly 用户'} ${profile.company ? `- ${profile.company}` : ''}`.trim(),
            text: '查看 Moly 数字名片',
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(sharePayload);
            } else {
                showToast('已调起分享流程（演示）');
            }
        } catch (error) {
            console.warn('Share cancelled or failed', error);
        }
    };

    const addIndustry = () => {
        const normalized = industryInput.trim().slice(0, 10);
        if (!normalized) return;
        if (profile.industry.length >= 10) {
            showToast('最多添加 10 个标签');
            return;
        }
        if (profile.industry.includes(normalized)) {
            setIndustryInput('');
            setIsCustomIndustryInputOpen(false);
            return;
        }
        setProfile((current) => ({
            ...current,
            industry: normalizeIndustries([...current.industry, normalized]),
        }));
        setIndustryInput('');
        setIsCustomIndustryInputOpen(false);
    };

    const toggleIndustry = (value: string) => {
        if (!profile.industry.includes(value) && profile.industry.length >= 10) {
            showToast('最多添加 10 个标签');
            return;
        }

        setProfile((current) => ({
            ...current,
            industry: current.industry.includes(value)
                ? current.industry.filter((item) => item !== value)
                : normalizeIndustries([...current.industry, value]),
        }));
    };

    const removeIndustry = (value: string) => {
        setProfile((current) => ({
            ...current,
            industry: current.industry.filter((item) => item !== value),
        }));
    };

    const startPolish = async () => {
        if (polishState === 'loading') return;
        setPolishState('loading');
        const beforePolish = cloneProfile(profile);
        setPrePolishProfile(beforePolish);

        try {
            const polished = await polishProfileCopyWithAI(beforePolish);
            setProfile((current) => ({
                ...current,
                headline: polished.headline,
                topics: polished.topics,
                notes: polished.notes,
            }));
            setPolishState('preview');
        } catch (error) {
            console.error(error);
            setPolishState('idle');
            setPrePolishProfile(null);
            showToast('润色服务暂不可用，请稍后重试');
        }
    };

    const adoptPolish = () => {
        setPolishState('idle');
        setPrePolishProfile(null);
        showToast('已采用润色结果');
    };

    const undoPolish = () => {
        if (prePolishProfile) {
            setProfile(cloneProfile(prePolishProfile));
        }
        setPolishState('idle');
        setPrePolishProfile(null);
        showToast('已撤销润色结果');
    };

    const getEnterProps = (delay = 0) => ({
        initial: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 18 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: prefersReducedMotion ? 0 : 0.56,
                delay: prefersReducedMotion ? 0 : delay,
                ease: ONBOARDING_EASE,
            },
        },
    });

    const onboardingSteps = [
        {
            eyebrow: 'Step 1',
            title: '你好。',
            body: '接下来我问你几个简单问题，很快就能帮你把这张名片整理好。',
            content: (
                <div className="space-y-6">
                    <motion.div {...getEnterProps(0.3)}>
                        <OnboardingField label="怎么称呼你">
                            <input
                                value={profile.name}
                                onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value.slice(0, 20) }))}
                                placeholder="输入你的名字"
                                className="w-full bg-transparent text-[32px] leading-[1.06] tracking-[-0.05em] text-[#171717] outline-none placeholder:text-[#9CA3AF]"
                            />
                        </OnboardingField>
                    </motion.div>

                    <motion.div {...getEnterProps(0.42)}>
                        <OnboardingField
                            label="所在地区"
                            icon={<MapPin size={13} strokeWidth={1.8} />}
                        >
                            <input
                                value={profile.address}
                                onChange={(event) => setProfile((current) => ({ ...current, address: event.target.value.slice(0, 24) }))}
                                placeholder="例如 北京朝阳"
                                className="w-full bg-transparent text-[24px] leading-[1.15] tracking-[-0.03em] text-[#171717] outline-none placeholder:text-[#9CA3AF]"
                            />
                        </OnboardingField>
                    </motion.div>
                </div>
            ),
        },
        {
            eyebrow: 'Step 2',
            title: '先从工作聊起吧。',
            body: '你现在在哪家公司，做什么职位呢？',
            content: (
                <div className="space-y-6">
                    <motion.div {...getEnterProps(0.28)}>
                        <OnboardingField label="你在哪家公司">
                            <input
                                value={profile.company}
                                onChange={(event) => setProfile((current) => ({ ...current, company: event.target.value.slice(0, 30) }))}
                                placeholder="公司"
                                className="w-full bg-transparent text-[30px] leading-[1.08] tracking-[-0.04em] text-[#171717] outline-none placeholder:text-[#9CA3AF]"
                            />
                        </OnboardingField>
                    </motion.div>

                    <motion.div {...getEnterProps(0.4)}>
                        <OnboardingField label="你负责什么角色">
                            <input
                                value={profile.position}
                                onChange={(event) => setProfile((current) => ({ ...current, position: event.target.value.slice(0, 30) }))}
                                placeholder="职位"
                                className="w-full bg-transparent text-[30px] leading-[1.08] tracking-[-0.04em] text-[#171717] outline-none placeholder:text-[#9CA3AF]"
                            />
                        </OnboardingField>
                    </motion.div>
                </div>
            ),
        },
        {
            eyebrow: 'Step 3',
            title: '差不多啦，我再了解你一点点。',
            body: '你现在主要在做什么呢？有没有什么你特别希望别人了解的项目、产品，或者最近在推进的事情？',
            content: (
                <motion.div {...getEnterProps(0.3)}>
                    <div className="border-b border-[#E5E7EB] pb-5">
                        <textarea
                            value={profile.notes}
                            onChange={(event) => setProfile((current) => ({ ...current, notes: event.target.value.slice(0, 280) }))}
                            placeholder="用几句话告诉Moly关于你的事情吧～"
                            className="w-full min-h-[220px] bg-transparent text-[18px] leading-8 text-[#171717] outline-none resize-none placeholder:text-[#9CA3AF]"
                        />
                    </div>
                </motion.div>
            ),
        },
        {
            eyebrow: 'Step 4',
            title: '我帮你整理了三句更适合放在名片首页的话。',
            body: '选一句最像你、也最让人想继续了解你的。',
            content: (
                <div className="divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
                    {headlineCandidates.map((headline) => {
                        const isSelected = profile.headline === headline;
                        return (
                            <motion.button
                                key={headline}
                                type="button"
                                {...getEnterProps(0.24 + headlineCandidates.indexOf(headline) * 0.08)}
                                onClick={() => {
                                    if (headline.length > 36) {
                                        showToast('最多输入 36 个字符');
                                        return;
                                    }
                                    setProfile((current) => ({ ...current, headline }));
                                }}
                                className="w-full py-4 text-left"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className={`text-[18px] leading-8 transition-colors ${isSelected ? 'text-[#171717]' : 'text-[#4B5563]'}`}>{headline}</div>
                                    </div>
                                    <div className={`mt-1 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                                        isSelected ? 'border-[#171717] bg-[#171717] text-[#ffffff]' : 'border-[#D1D5DB] bg-transparent text-transparent'
                                    }`}>
                                        <Check size={13} />
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            ),
        },
        {
            eyebrow: 'Step 5',
            title: '我再帮你把方向整理成几个标签。',
            body: '这些标签会出现在名片里，用来让别人更快理解你，选几个最贴近你的就好。',
            content: (
                <motion.div {...getEnterProps(0.3)}>
                    <OnboardingField label="行业或身份标签">
                        <div className="flex flex-wrap gap-2.5">
                            {industrySuggestions.map((item) => {
                                const isSelected = profile.industry.includes(item);
                                return (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => toggleIndustry(item)}
                                        className={`h-10 rounded-[14px] border px-3 inline-flex items-center text-left transition-all whitespace-nowrap ${
                                            isSelected
                                                ? 'border-[#171717] bg-[#171717] text-[#ffffff] shadow-[0_14px_24px_rgba(23,23,23,0.14)]'
                                                : 'border-[#E5E7EB] bg-white/88 text-[#1F2937] shadow-[0_8px_18px_rgba(0,0,0,0.04)]'
                                        }`}
                                    >
                                        <span className="text-[13px] font-medium">{item}</span>
                                    </button>
                                );
                            })}

                            <button
                                type="button"
                                onClick={() => setIsCustomIndustryInputOpen((current) => !current)}
                                className={`h-10 rounded-[14px] border px-3 inline-flex items-center gap-2 text-left transition-all whitespace-nowrap ${
                                    isCustomIndustryInputOpen
                                        ? 'border-[#111827] bg-[#F3F4F6] text-[#171717]'
                                        : 'border-dashed border-[#D1D5DB] bg-[#F9FAFB] text-[#6B7280]'
                                }`}
                            >
                                <span className="w-5 h-5 rounded-[8px] bg-white/80 border border-[#E5E7EB] flex items-center justify-center">
                                    <Plus size={12} />
                                </span>
                                <span className="text-[13px] font-medium">自定义</span>
                            </button>
                        </div>

                        {customIndustries.length > 0 && (
                            <div className="mt-5">
                                <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#9CA3AF]">已添加</div>
                                <div className="mt-3 flex flex-wrap gap-2.5">
                                    {customIndustries.map((item) => (
                                        <div
                                            key={item}
                                            className="h-10 rounded-[14px] border border-[#171717] bg-[#171717] px-3 inline-flex items-center gap-2 text-[#ffffff] shadow-[0_14px_24px_rgba(23,23,23,0.14)]"
                                        >
                                            <span className="text-[13px] font-medium">{item}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeIndustry(item)}
                                                aria-label={`删除标签 ${item}`}
                                                className="w-5 h-5 rounded-[8px] bg-white/10 border border-white/10 flex items-center justify-center"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <AnimatePresence initial={false}>
                            {isCustomIndustryInputOpen && (
                                <motion.div
                                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: prefersReducedMotion ? 0 : 0.28,
                                            ease: ONBOARDING_EASE,
                                        },
                                    }}
                                    exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -6, transition: { duration: 0.18 } }}
                                    className="mt-5 rounded-[20px] border border-[#E5E7EB] bg-[#F9FAFB] p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            value={industryInput}
                                            maxLength={10}
                                            onChange={(event) => setIndustryInput(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    event.preventDefault();
                                                    addIndustry();
                                                }
                                            }}
                                            placeholder="输入你的自定义标签"
                                            className="flex-1 h-11 rounded-[14px] border border-[#E5E7EB] bg-white px-4 text-[14px] text-[#171717] outline-none placeholder:text-[#9CA3AF]"
                                        />
                                        <button
                                            type="button"
                                            onClick={addIndustry}
                                            className="w-11 h-11 rounded-[14px] bg-[#111827] text-[#ffffff] flex items-center justify-center shadow-[0_12px_22px_rgba(0,0,0,0.18)]"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        
                    </OnboardingField>
                </motion.div>
            ),
        },
    ];

    const currentStep = onboardingSteps[step];
    const loadingStep = {
        eyebrow: 'Analyzing',
        title: '我在整理你的名片内容。',
        body: '正在把你的背景、方向和表达方式收成更有吸引力的一版，马上就好。',
        content: (
            <div className="pt-10">
                <div className="flex flex-col items-start gap-5">
                    <div className="w-12 h-12 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                        <Sparkles size={18} className="animate-pulse" />
                    </div>
                    <div className="space-y-3 w-full max-w-[290px]">
                        <div className="h-3 rounded-full bg-[#E5E7EB] w-[72%] animate-pulse" />
                        <div className="h-3 rounded-full bg-[#F1F5F9] w-[88%] animate-pulse" />
                        <div className="h-3 rounded-full bg-[#E5E7EB] w-[64%] animate-pulse" />
                    </div>
                    <div className="text-[13px] leading-6 text-[#6B7280]">
                        正在生成首页介绍、标签建议和可继续聊的话题。
                    </div>
                </div>
            </div>
        ),
    };
    const displayedStep = isGeneratingRecommendations && step === 2 ? loadingStep : currentStep;
    const isNextDisabled = step === 2 && isGeneratingRecommendations;
    const nextButtonLabel = isGeneratingRecommendations ? '正在整理名片内容' : step === 4 ? '生成名片' : '下一步';
    const showVoiceInputButton = step < 3;

    return (
            <div className="h-full bg-white overflow-hidden relative text-[#171717]">
            <div className="absolute inset-0 pointer-events-none opacity-[0.22]" style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="absolute top-0 inset-x-0 h-[180px] bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.08),transparent_42%),radial-gradient(circle_at_20%_30%,rgba(94,106,210,0.05),transparent_32%)] pointer-events-none" />

            <div className="relative z-10 px-5 pt-12 pb-4 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-[12px] bg-white/88 backdrop-blur border border-[#E5E7EB] flex items-center justify-center text-[#4B5563]"
                >
                    <ArrowLeft size={18} />
                </button>

                <div className="text-center">
                    <div className="text-[15px] font-semibold text-[#171717]">我的名片</div>
                    <div className="text-[11px] text-[#6B7280]">
                        {screenMode === 'onboarding' ? '首次信息整理' : screenMode === 'editing' ? '编辑模式' : '展示模式'}
                    </div>
                </div>

                {screenMode === 'view' ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={triggerShare}
                            className="w-10 h-10 rounded-[12px] bg-white/88 backdrop-blur border border-[#E5E7EB] flex items-center justify-center text-[#4B5563]"
                        >
                            <Share2 size={17} />
                        </button>
                        <button
                            onClick={() => startEditing()}
                            className="w-10 h-10 rounded-[12px] bg-[#171717] border border-[#171717] flex items-center justify-center text-white"
                        >
                            <PencilLine size={17} />
                        </button>
                    </div>
                ) : screenMode === 'editing' ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={cancelEditing}
                                className="h-10 px-3 rounded-[12px] bg-white/88 backdrop-blur border border-[#E5E7EB] text-[13px] font-medium text-[#4B5563]"
                        >
                            取消
                        </button>
                        <button
                            onClick={saveEditing}
                            disabled={polishState === 'loading'}
                            className={`h-10 px-3 rounded-[12px] text-[13px] font-medium ${
                                polishState === 'loading'
                                        ? 'bg-[#9CA3AF] text-white'
                                        : 'bg-[#171717] text-white'
                                }`}
                        >
                            保存
                        </button>
                    </div>
                ) : <div className="w-10" />}
            </div>

            {toast && (
                    <div className="absolute top-28 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-[#171717] text-white text-[12px] shadow-lg">
                        {toast}
                    </div>
                )}

            {draftPrompt && screenMode === 'view' && (
                <div className="mx-5 mt-3 rounded-[18px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
                    <div className="text-[13px] font-medium text-[#111827]">您有未保存的修改，是否继续编辑？</div>
                    <div className="mt-3 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => startEditing(draftPrompt)}
                            className="flex-1 h-10 rounded-[12px] bg-[#111827] text-white text-[13px] font-medium"
                        >
                            继续编辑
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                removeStoredJson(MY_CARD_DRAFT_KEY);
                                setDraftPrompt(null);
                            }}
                            className="flex-1 h-10 rounded-[12px] bg-white border border-[#E5E7EB] text-[13px] font-medium text-[#4B5563]"
                        >
                            放弃草稿
                        </button>
                    </div>
                </div>
            )}

            {screenMode === 'onboarding' ? (
                <>
                    <div ref={onboardingScrollRef} className="px-5 pt-1 pb-[164px] overflow-y-auto h-[calc(100%-96px)]">
                        <div className="sticky top-0 z-10 bg-[linear-gradient(180deg,#ffffff_0%,rgba(255,255,255,0.92)_75%,rgba(255,255,255,0)_100%)] pt-1 pb-5">
                            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] font-semibold text-[#6B7280]">
                                <span>{currentStep.eyebrow}</span>
                                <span>{step + 1} / {onboardingSteps.length}</span>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                                {onboardingSteps.map((_, index) => (
                                    <div key={index} className={`h-1.5 flex-1 rounded-full transition-colors ${index <= step ? 'bg-[#171717]' : 'bg-[#E5E7EB]'}`} />
                                ))}
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: prefersReducedMotion ? 0 : 0.3,
                                        ease: ONBOARDING_EASE,
                                    },
                                }}
                                exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
                                className="pb-8"
                            >
                                <motion.div {...getEnterProps(0.02)} className="max-w-[280px] text-[34px] leading-[1.04] font-semibold tracking-[-0.05em] text-[#171717]">
                                    {displayedStep.title}
                                </motion.div>
                                <motion.p {...getEnterProps(0.14)} className="mt-4 max-w-[308px] text-[15px] leading-7 text-[#6B7280]">
                                    {displayedStep.body}
                                </motion.p>

                                <div className="mt-10">{displayedStep.content}</div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white via-white/95 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-6">
                        <div className={`grid items-end gap-4 ${showVoiceInputButton ? 'grid-cols-3' : 'grid-cols-2'}`}>
                            {step > 0 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep((current) => current - 1)}
                                    aria-label="上一步"
                                    title="上一步"
                                    className="justify-self-start w-12 h-12 rounded-full border border-[#E5E7EB] bg-white/95 text-[#4B5563] backdrop-blur flex items-center justify-center shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-transform active:scale-[0.98]"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                            ) : (
                                <div className="justify-self-start w-12 h-12" />
                            )}

                            {showVoiceInputButton ? (
                                <button
                                    type="button"
                                    onClick={() => showToast('语音输入演示中')}
                                    aria-label="语音输入"
                                    title="语音输入"
                                    className="justify-self-center w-14 h-14 rounded-full border border-[#E5E7EB] bg-white text-[#171717] shadow-[0_16px_28px_rgba(15,23,42,0.12)] flex items-center justify-center transition-transform active:scale-[0.98]"
                                >
                                    <Mic size={19} strokeWidth={1.9} />
                                </button>
                            ) : null}

                            <button
                                type="button"
                                onClick={nextFromOnboarding}
                                disabled={isNextDisabled}
                                aria-label={nextButtonLabel}
                                title={nextButtonLabel}
                                className={`justify-self-end w-14 h-14 rounded-full flex items-center justify-center shadow-[0_18px_32px_rgba(15,23,42,0.18)] transition-transform ${
                                    isNextDisabled
                                        ? 'bg-[#9CA3AF] text-white'
                                        : 'bg-[#171717] text-white active:scale-[0.98]'
                                }`}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="h-[calc(100%-84px)] overflow-y-auto">
                    <section className="min-h-[92vh] px-5 pt-8 pb-20 relative">
                        <div className="absolute inset-x-5 top-10 bottom-10 border border-[rgba(184,147,58,0.20)] bg-[rgba(255,255,255,0.32)]" />
                        <div className="relative z-10 flex flex-col min-h-[78vh] px-4 pt-20">
                            <div className="flex items-center justify-between">
                                <div className="text-[10px] tracking-[0.28em] uppercase font-semibold text-[#8d7d68]">Selected Profile</div>
                                <div className="text-[10px] tracking-[0.22em] uppercase font-semibold text-[#a99985]">Moly 0.8 Earth</div>
                            </div>

                            <div className="mt-10 border-t border-[rgba(184,147,58,0.35)] pt-5">
                                <div className="text-[40px] leading-none text-[#d8d0c5]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>01</div>
                            </div>

                            <div className="mt-4">
                                <HeroTextField
                                    editing={screenMode === 'editing'}
                                    value={profile.name}
                                    placeholder="你的名字"
                                    className="text-[54px] leading-[0.92] tracking-[-0.04em] text-[#171717]"
                                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                                    onChange={(value) => setProfile((current) => ({ ...current, name: value.slice(0, 20) }))}
                                />
                            </div>

                            <div className="mt-5 max-w-[300px]">
                                <HeroTextField
                                    editing={screenMode === 'editing'}
                                    value={profile.headline}
                                    placeholder="用一句话说明你是谁、正在做什么、在哪个领域"
                                    className="text-[24px] leading-[1.34] tracking-[-0.02em] text-[#171717]"
                                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                                    highlighted={polishState === 'preview' && isFieldHighlighted('headline', profile, prePolishProfile)}
                                    onChange={(value) => {
                                        if (value.length > 36) {
                                            showToast('最多输入 36 个字符');
                                            return;
                                        }
                                        setProfile((current) => ({ ...current, headline: value }));
                                    }}
                                    maxLength={36}
                                    multiline
                                />
                            </div>

                            <div className="mt-12">
                                <div className="text-[40px] leading-none text-[#d8d0c5]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>02</div>
                                <div className="mt-2 text-[10px] uppercase tracking-[0.22em] font-semibold text-[#8d7d68]">Areas of Focus</div>
                                <div className="mt-5 space-y-5">
                                    {(screenMode === 'editing' ? [0, 1, 2] : profile.topics.map((_, index) => index)).map((index) => (
                                        <div
                                            key={index}
                                            className={`border-b border-[rgba(184,147,58,0.16)] pb-5 ${
                                                polishState === 'preview' && isFieldHighlighted('topics', profile, prePolishProfile)
                                                    ? 'bg-[#eef1ff] rounded-[12px] px-3 pt-2'
                                                    : ''
                                            }`}
                                        >
                                            {screenMode === 'editing' ? (
                                                <input
                                                    value={profile.topics[index] || ''}
                                                    onChange={(event) => {
                                                        const nextTopics = [...profile.topics];
                                                        nextTopics[index] = event.target.value.slice(0, 15);
                                                        setProfile((current) => ({
                                                            ...current,
                                                            topics: nextTopics,
                                                        }));
                                                    }}
                                                    placeholder={`话题 ${index + 1}`}
                                                    className="w-full bg-transparent outline-none text-[20px] text-[#171717] placeholder:text-[#b3aca4]"
                                                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                                                />
                                            ) : (
                                                <div className="text-[22px] text-[#171717]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                                                    {profile.topics[index]}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="relative -mt-10 bg-white border-t border-[rgba(148,163,184,0.18)] px-5 pt-7 pb-28">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <div className="text-[40px] leading-none text-[#d8d0c5]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>03</div>
                                <div className="mt-1 text-[10px] uppercase tracking-[0.22em] font-semibold text-[#8d7d68]">Contact Coordinates</div>
                            </div>
                            <div className="text-[12px] text-[#9CA3AF]">
                                {savedProfile?.updatedAt ? `更新于 ${new Date(savedProfile.updatedAt).toLocaleDateString('zh-CN')}` : '草稿中'}
                            </div>
                        </div>

                        <div className="border border-[rgba(184,147,58,0.20)] bg-[rgba(255,255,255,0.45)] px-4">
                            <BaseInfoRow
                                icon={<Building2 size={15} strokeWidth={1.8} />}
                                label="职位公司"
                                value={[profile.position, profile.company].filter(Boolean).join(' · ')}
                                editing={screenMode === 'editing'}
                                placeholder="填写职位和公司"
                                onChange={(value) => {
                                    const [position = '', company = ''] = value.split('·').map((item) => item.trim());
                                    setProfile((current) => ({ ...current, position, company }));
                                }}
                            />
                            {screenMode === 'editing' && (
                                <div className="-mt-2 mb-3 ml-[105px] grid grid-cols-2 gap-3">
                                    <input
                                        value={profile.position}
                                        onChange={(event) => setProfile((current) => ({ ...current, position: event.target.value.slice(0, 30) }))}
                                        placeholder="职位"
                                        className="h-10 px-3 rounded-[12px] border border-[#e6e0d8] bg-white text-[13px] outline-none"
                                    />
                                    <input
                                        value={profile.company}
                                        onChange={(event) => setProfile((current) => ({ ...current, company: event.target.value.slice(0, 30) }))}
                                        placeholder="公司"
                                        className="h-10 px-3 rounded-[12px] border border-[#e6e0d8] bg-white text-[13px] outline-none"
                                    />
                                </div>
                            )}

                            <BaseInfoRow
                                icon={<MapPin size={15} strokeWidth={1.8} />}
                                label="地区"
                                value={profile.address}
                                editing={screenMode === 'editing'}
                                placeholder="例如 北京朝阳"
                                onChange={(value) => setProfile((current) => ({ ...current, address: value.slice(0, 24) }))}
                            />

                            <div className="grid grid-cols-[28px_74px_1fr] gap-3 items-start py-4 border-b border-[#f1ede8]">
                                <div className="w-7 h-7 rounded-[10px] bg-[#f6f3ef] border border-[#ece7e1] flex items-center justify-center text-[#6B7280]">
                                    <Tag size={15} strokeWidth={1.8} />
                                </div>
                                <div className="pt-1 text-[12px] font-medium text-[#8a857f]">行业标签</div>
                                <div className="pt-1">
                                    <div className="flex flex-wrap gap-2">
                                        {profile.industry.map((item) => (
                                            <div key={item} className="inline-flex items-center gap-2 rounded-full border border-[#dcd6cf] bg-white px-3 py-1.5 text-[13px] text-[#171717]">
                                                {item}
                                                {screenMode === 'editing' && (
                                                    <button type="button" onClick={() => removeIndustry(item)} className="text-[#9CA3AF]">
                                                        <X size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {screenMode === 'editing' && profile.industry.length < 10 && (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    value={industryInput}
                                                    maxLength={10}
                                                    onChange={(event) => setIndustryInput(event.target.value)}
                                                    onKeyDown={(event) => {
                                                        if (event.key === 'Enter') {
                                                            event.preventDefault();
                                                            addIndustry();
                                                        }
                                                    }}
                                                    placeholder="+ 添加标签"
                                                    className="h-9 px-3 rounded-full border border-dashed border-[#dcd6cf] bg-white text-[13px] outline-none min-w-[110px]"
                                                />
                                                <button type="button" onClick={addIndustry} className="w-9 h-9 rounded-full bg-[#111827] text-[#ffffff] flex items-center justify-center">
                                                    <Plus size={15} />
                                                </button>
                                            </div>
                                        )}
                                        {!profile.industry.length && screenMode !== 'editing' && (
                                            <span className="text-[14px] text-[#b3aca4]">暂未填写</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <BaseInfoRow
                                icon={<Briefcase size={15} strokeWidth={1.8} />}
                                label="个人介绍"
                                value={profile.notes}
                                editing={screenMode === 'editing'}
                                placeholder="说说你现在在做什么"
                                onChange={(value) => setProfile((current) => ({ ...current, notes: value.slice(0, 280) }))}
                                highlighted={polishState === 'preview' && isFieldHighlighted('notes', profile, prePolishProfile)}
                                multiline
                            />
                        </div>
                    </section>
                </div>
            )}

            {screenMode === 'editing' && polishState !== 'preview' && (
                <div className="absolute bottom-5 left-5 right-5">
                    <button
                        type="button"
                        disabled={polishState === 'loading'}
                        onClick={startPolish}
                        className={`w-full h-12 rounded-[16px] shadow-[0_18px_36px_rgba(15,23,42,0.14)] flex items-center justify-center gap-2 text-[14px] font-medium ${
                            polishState === 'loading'
                                ? 'bg-[#9CA3AF] text-white'
                                : 'bg-[#171717] text-white'
                        }`}
                    >
                        <Sparkles size={16} />
                        {polishState === 'loading' ? '正在润色...' : '一键润色'}
                    </button>
                </div>
            )}

            {screenMode === 'editing' && polishState === 'preview' && (
                <div className="absolute bottom-5 left-5 right-5 rounded-[20px] border border-[#E5E7EB] bg-white/98 backdrop-blur px-4 py-4 shadow-[0_20px_40px_rgba(15,23,42,0.16)]">
                    <div className="text-[13px] font-medium text-[#111827]">润色结果已更新到页面里，确认要采用吗？</div>
                    <div className="mt-3 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={adoptPolish}
                            className="flex-1 h-11 rounded-[14px] bg-[#171717] text-white text-[14px] font-medium inline-flex items-center justify-center gap-2"
                        >
                            <Check size={16} />
                            采用
                        </button>
                        <button
                            type="button"
                            onClick={undoPolish}
                            className="flex-1 h-11 rounded-[14px] bg-white border border-[#E5E7EB] text-[14px] font-medium text-[#4B5563] inline-flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={16} />
                            撤销
                        </button>
                    </div>
                </div>
            )}

            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#D1D5DB] rounded-full" />
        </div>
    );
};

const MyCardDemo = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-10">
            <div className="w-full max-w-[1220px] flex flex-col lg:flex-row items-start justify-center gap-8">
                <div className="w-full lg:w-[312px] shrink-0 space-y-4">
                    <div className="rounded-[24px] bg-white border border-slate-200 shadow-[0_20px_60px_rgba(148,163,184,0.16)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-[16px] bg-slate-900 flex items-center justify-center shadow-[0_16px_30px_rgba(15,23,42,0.12)]">
                                <Sparkles size={18} className="text-white" fill="currentColor" />
                            </div>
                            <div>
                                <div className="text-[11px] uppercase tracking-[0.22em] font-black text-slate-400">Moly 0.7</div>
                                <div className="text-[24px] font-black tracking-tight text-slate-900">我的名片链路</div>
                            </div>
                        </div>
                        <p className="mt-4 text-[13px] leading-relaxed text-slate-500">
                            当前展示的是数字名片主流程：首次引导、自动生成 headline、展示态、编辑态和润色确认。
                        </p>
                    </div>

                    <div className="rounded-[24px] bg-white border border-slate-200 shadow-[0_20px_60px_rgba(148,163,184,0.14)] p-5">
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-[14px] flex items-center justify-center text-[12px] font-black bg-slate-900 text-white">07</div>
                            <div className="min-w-0">
                                <div className="text-[15px] font-black tracking-tight text-slate-900">数字名片 PRD 母版</div>
                                <div className="text-[12px] leading-relaxed mt-1 text-slate-500">
                                    首屏聚焦名字、headline、适合聊什么；下滑再进入理性基础信息区，编辑也在原位完成。
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-[393px] w-full h-[852px] border-[10px] border-slate-900 rounded-[3.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative bg-white font-sans ring-4 ring-slate-800/10">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-[60] flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-slate-800 absolute right-4" />
                    </div>
                    <div className="h-full">
                        <MyCardPhoneView onBack={() => navigate('/contacts')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyCardDemo;
