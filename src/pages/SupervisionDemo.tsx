import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Shared State Machine ──
// States: 'idle' → 'sent' → 'responded' → 'done'

const DEMO_TODO = {
    title: '修改项目年度方案',
    contact: '张经理',
    initiator: '王老板',
};

// ── Phone Shell ──
const PhoneShell = ({ children, label, accent = 'indigo' }) => (
    <div className="flex flex-col items-center gap-4">
        <div className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${accent === 'orange' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
            {label}
        </div>
        <div className="w-[320px] h-[660px] border-[8px] border-slate-900 rounded-[44px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.2)] relative bg-white ring-4 ring-slate-800/10 flex flex-col">
            {/* Notch */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-50" />
            {children}
        </div>
        {/* Home Bar */}
        <div className="w-24 h-1 bg-slate-300 rounded-full mt-1" />
    </div>
);

// ── Chat Message Bubble ──
const Bubble = ({ text, align = 'left', className = '' }) => (
    <div className={`flex ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[75%] px-4 py-2.5 text-[13px] leading-relaxed rounded-[18px] ${align === 'right' ? 'bg-[#1C1C1E] text-white rounded-br-[5px]' : 'bg-[#F2F2F7] text-slate-800 rounded-bl-[5px]'} ${className}`}>
            {text}
        </div>
    </div>
);

// ── Left: Supervisee Phone ──
const PhoneLeft = ({ stage, onRespond }) => {
    const [responded, setResponded] = useState(false);
    const [choice, setChoice] = useState(null);

    const handleRespond = (res) => {
        if (responded) return;
        setResponded(true);
        setChoice(res);
        onRespond(res);
    };

    return (
        <PhoneShell label="📱 被督办人 · 张经理" accent="orange">
            {/* Status bar */}
            <div className="px-6 pt-7 pb-2 flex items-center justify-between shrink-0">
                <span className="text-[11px] font-semibold text-slate-900">9:41</span>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-2.5 border border-slate-400 rounded-sm"><div className="w-2 h-full bg-slate-500 rounded-sm ml-0.5 mt-0.5" /></div>
                </div>
            </div>

            {/* Chat Header */}
            <div className="px-4 pb-3 border-b border-slate-100 flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow">M</div>
                <div>
                    <div className="text-[14px] font-bold text-slate-900">Moly 秘书</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> 在线
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden px-4 py-4 space-y-3">
                <Bubble text="你好，张经理！👋" />
                <Bubble text="我是王老板的秘书 Moly。" />

                <AnimatePresence>
                    {stage >= 1 && (
                        <motion.div
                            key="supervision-card"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                            className="space-y-3"
                        >
                            {/* Supervision message card */}
                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                <div className="bg-orange-50 px-4 py-2.5 flex items-center gap-2 border-b border-orange-100">
                                    <span className="text-base">📋</span>
                                    <span className="text-[12px] font-bold text-orange-700">待办跟进请求</span>
                                </div>
                                <div className="px-4 py-3">
                                    <div className="text-[11px] text-slate-400 mb-1">来自 {DEMO_TODO.initiator}</div>
                                    <div className="text-[14px] font-bold text-slate-900 mb-2">{DEMO_TODO.title}</div>
                                    <div className="text-[13px] text-slate-500 leading-relaxed">请问这件事目前处理到哪一步了？</div>
                                </div>
                                <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => handleRespond('in_progress')}
                                        disabled={responded}
                                        className={`py-2.5 rounded-xl text-[13px] font-bold transition-all ${responded && choice !== 'in_progress' ? 'bg-slate-100 text-slate-300 cursor-default' : responded && choice === 'in_progress' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-blue-50 border border-blue-200 text-blue-700 active:scale-95'}`}
                                    >
                                        {responded && choice === 'in_progress' ? '✓ 已确认' : '↻ 正在推进'}
                                    </button>
                                    <button
                                        onClick={() => handleRespond('claimed_done')}
                                        disabled={responded}
                                        className={`py-2.5 rounded-xl text-[13px] font-bold transition-all ${responded && choice !== 'claimed_done' ? 'bg-slate-100 text-slate-300 cursor-default' : responded && choice === 'claimed_done' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-emerald-500 text-white shadow-md shadow-emerald-200 active:scale-95'}`}
                                    >
                                        {responded && choice === 'claimed_done' ? '✓ 已确认' : '✓ 已完成'}
                                    </button>
                                </div>
                            </div>

                            {responded && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-[#F2F2F7] text-slate-700 px-4 py-2.5 text-[13px] rounded-[18px] rounded-bl-[5px]">
                                        收到！已将您的反馈同步给 {DEMO_TODO.initiator} ✅
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input bar */}
            <div className="px-4 pb-6 pt-2 border-t border-slate-100 shrink-0">
                <div className="bg-slate-100 rounded-full px-4 py-2.5 flex items-center gap-2 text-slate-400 text-[13px]">
                    <span className="flex-1">回复 Moly...</span>
                    <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                </div>
            </div>
        </PhoneShell>
    );
};

// ── Right: Initiator Phone ──
const PhoneRight = ({ stage, response }) => {
    const resultLabel = response === 'claimed_done' ? '已完成 ✓' : '正在推进 ↻';
    const resultColor = response === 'claimed_done' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-blue-600 bg-blue-50 border-blue-200';

    return (
        <PhoneShell label="📱 督办发起人 · 王老板" accent="indigo">
            {/* Status bar */}
            <div className="px-6 pt-7 pb-2 flex items-center justify-between shrink-0">
                <span className="text-[11px] font-semibold text-slate-900">9:41</span>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-2.5 border border-slate-400 rounded-sm"><div className="w-2 h-full bg-slate-500 rounded-sm ml-0.5 mt-0.5" /></div>
                </div>
            </div>

            {/* Top update notification */}
            <AnimatePresence>
                {stage >= 2 && (
                    <motion.div
                        key="update-notif"
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: 'spring', damping: 22, stiffness: 380, delay: 0.3 }}
                        className="mx-3 mb-1 shrink-0"
                    >
                        <div className={`flex items-center gap-3 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.10)] border px-3 py-2.5 ${response === 'claimed_done' ? 'border-emerald-100' : 'border-blue-100'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${response === 'claimed_done' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                                {response === 'claimed_done' ? '✓' : '↻'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[11px] font-bold text-slate-800">督办结果更新</div>
                                <div className="text-[10px] text-slate-400 truncate">{DEMO_TODO.contact} 反馈：{resultLabel} · {DEMO_TODO.title}</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Header */}
            <div className="px-4 pb-3 border-b border-slate-100 flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow">M</div>
                <div>
                    <div className="text-[14px] font-bold text-slate-900">Moly 助理</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Agent Online
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden px-4 py-4 space-y-3">
                <Bubble text="老板，您好！" align="left" />
                <Bubble text="「修改项目年度方案」已设置督办，张经理为被督办人。" align="left" />
                <Bubble text="好，督办发起后告诉我进展。" align="right" />
                <Bubble text="已发送督办消息给张经理，等待其反馈（最长4小时）⏱️" align="left" />

                <AnimatePresence>
                    {stage >= 2 && (
                        <motion.div
                            key="result-card"
                            initial={{ opacity: 0, y: 24, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 280, delay: 0.5 }}
                            className="space-y-2"
                        >
                            {/* Result card */}
                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                <div className={`px-4 py-2.5 flex items-center gap-2 border-b ${response === 'claimed_done' ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'}`}>
                                    <span className="text-base">{response === 'claimed_done' ? '✅' : '🔵'}</span>
                                    <span className={`text-[12px] font-bold ${response === 'claimed_done' ? 'text-emerald-700' : 'text-blue-700'}`}>督办结果回传</span>
                                </div>
                                <div className="px-4 py-3 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[11px] text-slate-400">待办事项</span>
                                        <span className="text-[12px] font-bold text-slate-800 text-right max-w-[55%]">{DEMO_TODO.title}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] text-slate-400">督办对象</span>
                                        <span className="text-[12px] font-bold text-slate-800">{DEMO_TODO.contact}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] text-slate-400">本次结果</span>
                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${resultColor}`}>{resultLabel}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] text-slate-400">更新时间</span>
                                        <span className="text-[11px] text-slate-500">刚刚</span>
                                    </div>
                                </div>
                            </div>

                            <Bubble text={response === 'claimed_done' ? '张经理已完成该事项，请您确认是否可关闭督办 ✅' : '张经理已确认正在推进，我将持续跟进进展 🔔'} align="left" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input bar */}
            <div className="px-4 pb-6 pt-2 border-t border-slate-100 shrink-0">
                <div className="bg-slate-100 rounded-full px-4 py-2.5 flex items-center gap-2 text-slate-400 text-[13px]">
                    <span className="flex-1">让 Moly 帮你安排...</span>
                    <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                </div>
            </div>
        </PhoneShell>
    );
};

// ── Connection Arrow ──
const ConnectionArrow = ({ stage, response }) => {
    const colors = { 0: 'text-slate-200', 1: 'text-orange-400', 2: response === 'claimed_done' ? 'text-emerald-500' : 'text-blue-500' };
    const labels = { 0: '等待触发', 1: '督办消息 →', 2: '← 结果回传' };
    const color = colors[Math.min(stage, 2)];
    const label = labels[Math.min(stage, 2)];
    const isReturn = stage >= 2;

    return (
        <div className="flex flex-col items-center justify-center gap-3 pt-8 px-2">
            <motion.div
                animate={{ x: isReturn ? [-8, 8, -8] : [8, -8, 8] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className={`text-2xl ${color}`}
            >
                {isReturn ? '←' : '→'}
            </motion.div>
            <div className={`text-[10px] font-bold uppercase tracking-widest ${color} text-center whitespace-nowrap`}>{label}</div>
            {stage === 1 && (
                <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 bg-orange-400 rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.25 }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// ── Main Page ──
export default function SupervisionDemo() {
    const [stage, setStage] = useState(0);   // 0: idle, 1: supervision sent, 2: responded
    const [response, setResponse] = useState(null);

    const handleSend = () => {
        if (stage === 0) setStage(1);
    };

    const handleRespond = (res) => {
        setResponse(res);
        setTimeout(() => setStage(2), 400);
    };

    const handleReset = () => {
        setStage(0);
        setResponse(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50/30 to-orange-50/30 flex flex-col items-center py-12 px-6 font-sans">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                    督办功能演示
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                    App 内督办流程
                </h1>
                <p className="text-slate-400 text-sm max-w-md">
                    演示督办发起 → 被督办人在 App 内收到消息并反馈 → 结果实时回传给督办发起人
                </p>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-2 mb-10">
                {[
                    { label: '①  触发督办', active: stage >= 0 },
                    { label: '②  督办消息送达', active: stage >= 1 },
                    { label: '③  被督办人反馈', active: stage >= 2 },
                ].map((s, i) => (
                    <React.Fragment key={i}>
                        <div className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${s.active && (stage === i || (i === 2 && stage >= 2)) ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : s.active ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                            {s.label}
                        </div>
                        {i < 2 && <div className="w-6 h-[2px] bg-slate-200 rounded" />}
                    </React.Fragment>
                ))}
            </div>

            {/* Phones */}
            <div className="flex items-start gap-6 lg:gap-10">
                <PhoneLeft stage={stage} onRespond={handleRespond} />
                <ConnectionArrow stage={stage} response={response} />
                <PhoneRight stage={stage} response={response} />
            </div>

            {/* CTA Button */}
            <div className="mt-12 flex gap-4">
                {stage === 0 && (
                    <button
                        onClick={handleSend}
                        className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[15px] rounded-2xl shadow-lg shadow-orange-200 active:scale-95 transition-all flex items-center gap-2"
                    >
                        📨 发起督办
                    </button>
                )}
                {stage === 1 && (
                    <div className="px-6 py-3 bg-white border border-orange-200 rounded-2xl text-orange-600 font-bold text-[14px] flex items-center gap-2 shadow-sm">
                        <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }}>⏱️</motion.span>
                        等待张经理在左侧手机点击反馈...
                    </div>
                )}
                {stage >= 2 && (
                    <div className="flex items-center gap-4">
                        <div className={`px-6 py-3 rounded-2xl font-bold text-[14px] flex items-center gap-2 ${response === 'claimed_done' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                            {response === 'claimed_done' ? '✅ 督办完成！张经理已反馈完成' : '🔵 张经理正在推进'}
                        </div>
                        <button
                            onClick={handleReset}
                            className="px-5 py-3 border border-slate-200 text-slate-600 font-semibold text-[13px] rounded-2xl hover:bg-slate-100 active:scale-95 transition-all"
                        >
                            🔄 重置演示
                        </button>
                    </div>
                )}
            </div>

            {/* Back link */}
            <a href="/" className="mt-8 text-[12px] text-slate-400 hover:text-slate-600 transition-colors">← 返回演示中心</a>
        </div>
    );
}
