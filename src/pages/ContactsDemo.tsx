import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MyCardPhoneView } from './MyCardDemo';
import {
    DEMO_COMPLETED_PROFILE,
    DigitalCardProfile,
    MY_CARD_DRAFT_KEY,
    MY_CARD_STORAGE_KEY,
    MyCardDraft,
    getProfileStatus,
    readStoredJson,
    removeStoredJson,
    writeStoredJson,
} from '../lib/digitalCard07';

const contacts = [
    { section: 'A', items: [{ name: 'Alex Chen', initial: 'A', isMolyUser: true, id: 'u1' }] },
    { section: 'C', items: [{ name: 'Cody 彭程', initial: 'C', isMolyUser: true, id: 'u2' }, { name: '程立', initial: '程', isMolyUser: false, id: 'u3' }] },
    { section: '陈', items: [{ name: '陈序言', initial: '陈', isMolyUser: false, id: 'u4' }, { name: '陈星野', initial: '陈', isMolyUser: false, id: 'u5' }] },
    { section: 'D', items: [{ name: 'Daniel Sun', initial: 'D', isMolyUser: false, id: 'u6' }, { name: 'David Chen', initial: 'D', isMolyUser: true, id: 'u7' }] },
];

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

export const ContactsPhoneList = ({ onOpenMyCard }: { onOpenMyCard: () => void }) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<DigitalCardProfile | null>(null);
    const [draft, setDraft] = useState<MyCardDraft | null>(null);

    useEffect(() => {
        setProfile(readStoredJson<DigitalCardProfile>(MY_CARD_STORAGE_KEY));
        setDraft(readStoredJson<MyCardDraft>(MY_CARD_DRAFT_KEY));
    }, []);

    const cardState = useMemo(() => getProfileStatus(profile), [profile]);
    const hasDraft = Boolean(draft?.profile);
    const statusMeta = {
        empty: {
            subtitle: '创建你的数字名片',
        },
        partial: {
            subtitle: hasDraft ? '继续完善你未完成的名片' : '完善你的数字名片',
        },
        complete: {
            subtitle: '查看并分享你的数字名片',
        },
    }[cardState];

    const avatarLabel = profile?.name?.slice(0, 1) || '我';

    return (
        <div className="h-full flex flex-col bg-[#F3F2EF] text-[#171717] overflow-hidden">
            <div className="px-6 pt-12 pb-4 flex justify-between items-center bg-[#F3F2EF] z-10 sticky top-0">
                <button className="p-2 -ml-2 text-[#7b766f] hover:text-[#171717]">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="text-center">
                    <h1 className="text-[17px] font-semibold text-black">联系人</h1>
                    <p className="text-[11px] text-[#9b948c] mt-0.5">135个联系人</p>
                </div>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar relative flex bg-[#fbfbfa] rounded-t-[24px] shadow-[0_-10px_40px_rgba(0,0,0,0.04)] mt-2">
                <div className="flex-1 px-6 pb-32 pt-6">
                    <div className="mb-8 cursor-pointer group" onClick={onOpenMyCard}>
                        <div className="p-4 bg-white rounded-[18px] border border-[#ece8e3] shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all hover:shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-[16px] bg-[#171717] flex items-center justify-center text-white font-semibold text-xl shrink-0">
                                    {avatarLabel}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[16px] font-semibold text-[#171717]">{statusMeta.subtitle}</p>
                                    {hasDraft && cardState !== 'empty' && (
                                        <div className="mt-2 flex items-center gap-2 text-[11px] text-[#5E6AD2] font-medium">
                                            <Sparkles size={12} strokeWidth={1.8} />
                                            检测到草稿
                                        </div>
                                    )}
                                </div>
                                <ChevronRight className="w-5 h-5 text-[#9b948c] group-hover:text-[#171717] transition-colors" />
                            </div>
                        </div>
                    </div>

                    {contacts.map((group) => (
                        <div key={group.section} className="mb-6">
                            <div className="text-[#9b948c] text-[13px] py-1 mb-2 sticky top-0 bg-[#fbfbfa]/95 backdrop-blur-sm z-10 font-bold">
                                {group.section}
                            </div>
                            <div className="space-y-4">
                                {group.items.map((contact) => (
                                    <div
                                        key={contact.id}
                                        onClick={() => contact.isMolyUser && navigate('/contact-card')}
                                        className={`flex items-center space-x-4 border-b border-[#f1eeea] pb-4 last:border-0 last:pb-0 ${contact.isMolyUser ? 'cursor-pointer group' : ''}`}
                                    >
                                        <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center font-medium shrink-0 ${contact.isMolyUser ? 'bg-[#eef1ff] border border-[#dfe4ff] text-[#5E6AD2]' : 'bg-[#f5f4f2] border border-[#ece8e3] text-[#7b766f]'}`}>
                                            {contact.initial}
                                        </div>
                                        <div className="flex-1 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className={`text-[16px] font-medium ${contact.isMolyUser ? 'text-[#171717] group-hover:text-[#5E6AD2] transition-colors' : 'text-[#262626]'}`}>
                                                    {contact.name}
                                                </span>
                                                {contact.isMolyUser && (
                                                    <span className="text-[10px] text-[#5E6AD2] mt-0.5 font-semibold flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> Moly 用户
                                                    </span>
                                                )}
                                            </div>
                                            {contact.isMolyUser && <ChevronRight className="w-4 h-4 text-[#c5beb6] group-hover:text-[#5E6AD2] transition-colors" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-8 absolute right-0 top-6 bottom-32 flex flex-col justify-between items-center text-[10px] text-[#b6afa7] font-bold bg-white/70 backdrop-blur-sm py-2 rounded-l-full">
                    {alphabet.map((letter) => (
                        <span key={letter} className="w-5 h-5 flex items-center justify-center hover:bg-[#eef1ff] hover:text-[#5E6AD2] rounded-full cursor-pointer transition-colors">
                            {letter}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ContactsDemo = () => {
    const [phoneScreen, setPhoneScreen] = useState<'contacts' | 'my-card'>('contacts');
    const [cardPreviewMode, setCardPreviewMode] = useState<'default' | 'onboarding' | 'completed'>('default');
    const [cardPreviewKey, setCardPreviewKey] = useState(0);

    const openOnboardingPreview = () => {
        removeStoredJson(MY_CARD_STORAGE_KEY);
        removeStoredJson(MY_CARD_DRAFT_KEY);
        setCardPreviewMode('onboarding');
        setPhoneScreen('my-card');
        setCardPreviewKey((key) => key + 1);
    };

    const openCompletedPreview = () => {
        writeStoredJson(MY_CARD_STORAGE_KEY, DEMO_COMPLETED_PROFILE);
        removeStoredJson(MY_CARD_DRAFT_KEY);
        setCardPreviewMode('completed');
        setPhoneScreen('my-card');
        setCardPreviewKey((key) => key + 1);
    };

    const openDefaultFlow = () => {
        setCardPreviewMode('default');
        setPhoneScreen('contacts');
        setCardPreviewKey((key) => key + 1);
    };

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
                                <div className="text-[24px] font-black tracking-tight text-slate-900">联系人与名片</div>
                            </div>
                        </div>
                        <p className="mt-4 text-[13px] leading-relaxed text-slate-500">
                            右侧现在是完整的 iPhone 原型链路。联系人页顶部有“我的数字名片”入口，点进去会直接进入首填、展示、编辑与润色的同一条流程。
                        </p>
                        <div className="mt-5 grid gap-2">
                            <button
                                type="button"
                                onClick={openOnboardingPreview}
                                className="h-10 rounded-[12px] bg-[#7a684f] text-[#f7f2eb] text-[13px] font-semibold"
                            >
                                查看首次进入引导
                            </button>
                            <button
                                type="button"
                                onClick={openCompletedPreview}
                                className="h-10 rounded-[12px] bg-[#ede8df] border border-[#d9cdbb] text-[#6b5a45] text-[13px] font-semibold"
                            >
                                查看已填写完成展示
                            </button>
                            <button
                                type="button"
                                onClick={openDefaultFlow}
                                className="h-10 rounded-[12px] bg-slate-100 text-slate-700 text-[13px] font-semibold"
                            >
                                恢复当前真实流程
                            </button>
                        </div>
                    </div>

                    <div className="rounded-[24px] bg-white border border-slate-200 shadow-[0_20px_60px_rgba(148,163,184,0.14)] p-5">
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-[14px] flex items-center justify-center text-[12px] font-black bg-slate-900 text-white">01</div>
                            <div className="min-w-0">
                                <div className="text-[15px] font-black tracking-tight text-slate-900">串联演示视角</div>
                                <div className="text-[12px] leading-relaxed mt-1 text-slate-500">
                                    不再把联系人页和名片页拆成两张外部网页，而是放进同一个手机壳里看，信息宽度也严格受 iPhone 原型约束。
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 rounded-[14px] border border-slate-200 bg-slate-50/70 px-4 py-3">
                            <div className="text-[10px] uppercase tracking-[0.18em] font-black text-slate-400">Current Flow</div>
                            <div className="mt-2 text-[13px] leading-relaxed text-slate-600">
                                联系人列表 → 我的数字名片入口 → 首次引导 / 展示态 / 编辑态 → 一键润色确认
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-[393px] w-full h-[852px] border-[10px] border-slate-900 rounded-[3.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative bg-white font-sans ring-4 ring-slate-800/10">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-[60] flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-slate-800 absolute right-4" />
                    </div>

                    <div className="h-full">
                        {phoneScreen === 'contacts' ? (
                            <ContactsPhoneList onOpenMyCard={() => setPhoneScreen('my-card')} />
                        ) : (
                            <MyCardPhoneView key={cardPreviewKey} initialMode={cardPreviewMode} onBack={() => setPhoneScreen('contacts')} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactsDemo;
