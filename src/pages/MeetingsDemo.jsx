import { MeetingDetailScreen } from './MeetingDetailScreens';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, MoreHorizontal, Play, Pause, Square, Mic,
    MessageCircle, FileText, CheckCircle2, AlertCircle, LayoutTemplate,
    RefreshCw, Trash2, Send, CornerDownRight, X, ChevronRight, Check,
    Calendar, ChevronDown, Sparkles, Menu, Plus, Users, MessageSquare, 
    Lightbulb, Info, Filter, Folder, FileSignature, RotateCcw, RotateCw
} from 'lucide-react';

const BUILTIN_TEMPLATES = [
    { id: 't1', name: '通用会议', desc: '适用于大部分常规会议', prompt: '作为专业的会议秘书，请整理本次会议记录。提取核心结论，记录关键议题和讨论要点，并单列出下一步的 Action Items。', structure: ['核心结论', '重点记录', 'Action Items'] },
    { id: 't2', name: '产品评审', desc: '需求评审、技术评审、设计评审', prompt: '提炼产品的核心方案与设计要点；总结评审中产生的各种决策和结论；列出当前未解决的遗留问题；最后整理具体的 Action Items 及其对应负责人。', structure: ['方案要点', '决策结论', '遗留问题', 'Action Items'] },
    { id: 't3', name: '销售/客户拜访', desc: 'BD 会议、客户拜访', prompt: '总结客户介绍与业务背景；分析客户提出的主要痛点与诉求；概述针对这些痛点的沟通反馈和接下来的推进计划。', structure: ['客户背景', '痛点分析', '推进计划'] },
    { id: 't4', name: '1:1', desc: '一对一沟通', prompt: '梳理沟通者的近期心理与工作状态；总结本次对话中提供的正负面工作反馈；明确在之后能提供的后续资源或支持。', structure: ['近期状态', '工作反馈', '后续支持'] },
    { id: 't5', name: '头脑风暴', desc: '创意讨论', prompt: '发散性地记录讨论中提出的所有观点和脑洞；提炼出具有实际可行性或潜在商业价值的重点创意；规划针对这些优质创意的下一步探索或实验计划。', structure: ['发散纪要', '价值创意', '下一步探索'] },
    { id: 't6', name: '站会/周会', desc: '固定周期性会议', prompt: '简明扼要地同步各个负责项目的最新进展情况；暴露并汇总当前遇到的风险、阻塞点或延期警告；拟定接下来的近期计划和里程碑对齐。', structure: ['项目进展', '风险同步', '近期计划'] }
];

const INITIAL_MEETINGS = [
    {
        id: 'm1',
        title: '优化录音文件上传流程与接口开发',
        time: '2026-04-07T14:15:42Z',
        duration: 576,
        status: 'completed',
        templateId: 't2',
        summaryText: '讨论了录音文件上传失败问题，指出失败文件手机有记录但本地可能无记录，计划通过开发新接口和绘制流程图优化上传方案，确保准确性和效率，对新接口实现持乐观态度。',
        summary: [],
        note: '', chatHistory: [], transcript: [
            { speaker: '说话人1', time: '00:00:23', text: '你说你说你看这个是我上录的音，然后他这这这说是之前说那个，会有一个，一个传失败了，一个传成功，是这原因。' },
            { speaker: '说话人2', time: '00:00:38', text: '那我就删一个呗。' },
            { speaker: '说话人1', time: '00:00:40', text: '他现在我想想，他现在会有两个原因，是啥来着。' },
            { speaker: '说话人2', time: '00:00:45', text: '网络不稳定，或者当时本地缓存满了。' },
            { speaker: '说话人1', time: '00:00:52', text: '对，所以我们需要加一个接口重传机制，并在交互上给出明确的断点提示。' },
            { speaker: '说话人2', time: '00:01:05', text: '行，那这个我先来出个流程图对一下。' }
        ]
    },
    {
        id: 'm2',
        title: '软件研发与授权流程优化讨论',
        time: '2026-04-03T20:22:00Z',
        duration: 232,
        status: 'completed',
        templateId: 't1',
        summaryText: '团队聚焦软件研发及授权流程优化，强调反复测试与授权取...',
        summary: [{ section: '要点', items: ['团队聚焦软件研发及授权流程优化，强调反复测试与授权取...'] }],
        note: '', chatHistory: [], transcript: []
    },
    {
        id: 'm3',
        title: '会议录音功能优化策略',
        time: '2026-04-03T20:08:00Z',
        duration: 101,
        status: 'completed',
        templateId: 't1',
        summaryText: '讨论聚焦于提升会议录音功能的稳定性和用户体验，提出将...',
        summary: [{ section: '要点', items: ['讨论聚焦于提升会议录音功能的稳定性和用户体验，提出将...'] }],
        note: '', chatHistory: [], transcript: []
    },
    {
        id: 'm4',
        title: '录音上传失败问题引发用户困惑与不满',
        time: '2026-04-03T20:06:00Z',
        duration: 13,
        status: 'completed',
        templateId: 't1',
        summaryText: '用户报告录音上传后系统默认显示失败，即使多次重试，问...',
        summary: [{ section: '要点', items: ['用户报告录音上传后系统默认显示失败，即使多次重试，问...'] }],
        note: '', chatHistory: [], transcript: []
    },
    {
        id: 'm5',
        title: 'AI赋能销售管理与客户成功',
        time: '2026-04-03T19:20:00Z',
        duration: 1611,
        status: 'completed',
        templateId: 't3',
        summaryText: '对话聚焦AI在销售管理、客户成功中的应用，强调业务链...',
        summary: [{ section: '要点', items: ['对话聚焦AI在销售管理、客户成功中的应用，强调业务链...'] }],
        note: '', chatHistory: [], transcript: []
    },
    {
        id: 'm6',
        title: 'AI平台功能与限制：结构化数据优化与成...',
        time: '2026-04-03T17:57:00Z',
        duration: 194,
        status: 'completed',
        templateId: 't1',
        summaryText: '讨论了在线AI平台针对结构化数据模型训练的优势及对非...',
        summary: [{ section: '要点', items: ['讨论了在线AI平台针对结构化数据模型训练的优势及对非...'] }],
        note: '', chatHistory: [], transcript: []
    },
    {
        id: 'm7',
        title: '设计测试案例评估模型能力',
        time: '2026-04-03T17:50:00Z',
        duration: 2708,
        status: 'completed',
        templateId: 't2',
        summaryText: '讨论了设计测试案例评估模型处理记忆、检索和常识理解能...',
        summary: [{ section: '要点', items: ['讨论了设计测试案例评估模型处理记忆、检索和常识理解能...'] }],
        note: '', chatHistory: [], transcript: []
    }
];

function formatDuration(seconds) {
    if (!seconds && seconds !== 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatMeetingDate(dateString) {
    if (!dateString) return '';
    const d = new Date(dateString);
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    const hh = d.getHours().toString().padStart(2, '0');
    const min = d.getMinutes().toString().padStart(2, '0');
    return `${mm}月${dd}日 ${hh}:${min}`;
}

export default function MeetingsDemo() {
    const [view, setView] = useState('list'); // list, recording, detail, templates
    const [meetings, setMeetings] = useState(INITIAL_MEETINGS);
    const [templates, setTemplates] = useState(BUILTIN_TEMPLATES);
    const [defaultTemplate, setDefaultTemplate] = useState('t1');
    const [selectedMeetingId, setSelectedMeetingId] = useState(null);

    // Audio Playback global state
    const [playingId, setPlayingId] = useState(null);
    const [playProgress, setPlayProgress] = useState(0);

    // Enter Detail
    const goDetail = (id) => {
        setSelectedMeetingId(id);
        setView('detail');
    };

    // Return to list
    const goList = () => {
        setSelectedMeetingId(null);
        setView('list');
    };

    // Handle Playback simulation
    useEffect(() => {
        let timer;
        if (playingId) {
            timer = setInterval(() => {
                setPlayProgress(p => (p >= 100 ? 0 : p + 2));
            }, 1000);
        } else {
            setPlayProgress(0);
        }
        return () => clearInterval(timer);
    }, [playingId]);

    // Handle Generation Simulation
    useEffect(() => {
        const generatingMeeting = meetings.find(m => m.status === 'generating');
        if (generatingMeeting) {
            const timer = setTimeout(() => {
                setMeetings(prev => prev.map(m => m.id === generatingMeeting.id ? {
                    ...m,
                    status: 'completed',
                    summary: BUILTIN_TEMPLATES.find(t => t.id === m.templateId).structure.map(sec => ({
                        section: sec,
                        items: ['智能提取的内容要点 1', '智能提取的内容要点 2']
                    })),
                    transcript: [{ speaker: 'S1', time: '00:00', text: '模拟识别出的转录内容...' }]
                } : m));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [meetings]);

    const activeMeeting = useMemo(() => meetings.find(m => m.id === selectedMeetingId), [meetings, selectedMeetingId]);

    return (
        <div className="flex-1 w-full h-full bg-[#fbfbfa] relative overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
                {view === 'list' && (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 flex flex-col"
                    >
                        <MeetingListScreen 
                            meetings={meetings} 
                            playingId={playingId}
                            setPlayingId={setPlayingId}
                            playProgress={playProgress}
                            onEnterDetail={goDetail}
                            onStartRecording={() => {
                                const newId = `rec_${Date.now()}`;
                                setMeetings(prev => [{
                                    id: newId, title: '', time: new Date().toISOString(), duration: 0,
                                    status: 'recording', templateId: defaultTemplate, note: '', chatHistory: [], transcript: [], summary: []
                                }, ...prev]);
                                setSelectedMeetingId(newId);
                                setView('recording');
                            }}
                            onManageTemplates={() => setView('templates')}
                            onRetry={(id) => {
                                setMeetings(prev => prev.map(m => m.id === id ? { ...m, status: 'generating' } : m));
                            }}
                        />
                    </motion.div>
                )}

                {view === 'recording' && activeMeeting && (
                    <motion.div
                        key="recording"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 z-20 bg-white"
                    >
                        <RecordingScreen 
                            meeting={activeMeeting}
                            onUpdate={(updates) => setMeetings(prev => prev.map(m => m.id === activeMeeting.id ? { ...m, ...updates } : m))}
                            onBack={() => {
                                // Background recording continues
                                goList();
                            }}
                            onStop={() => {
                                setMeetings(prev => prev.map(m => m.id === activeMeeting.id ? { ...m, status: 'generating' } : m));
                                goList();
                            }}
                        />
                    </motion.div>
                )}

                {view === 'detail' && activeMeeting && (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 z-20 bg-white"
                    >
                        <MeetingDetailScreen 
                            meeting={activeMeeting}
                            onBack={goList}
                            onUpdate={(updates) => setMeetings(prev => prev.map(m => m.id === activeMeeting.id ? { ...m, ...updates } : m))}
                            onDelete={() => {
                                setMeetings(prev => prev.filter(m => m.id !== activeMeeting.id));
                                goList();
                            }}
                            playingId={playingId}
                            setPlayingId={setPlayingId}
                        />
                    </motion.div>
                )}

                {view === 'templates' && (
                    <motion.div
                        key="templates"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 z-20 bg-[#fbfbfa]"
                    >
                        <TemplateManageScreen 
                            defaultTemplate={defaultTemplate}
                            setDefaultTemplate={setDefaultTemplate}
                            templates={templates}
                            setTemplates={setTemplates}
                            onBack={() => setView('list')}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ---------------------------
// Screen Components
// ---------------------------

function MeetingListScreen({ meetings, playingId, setPlayingId, playProgress, onEnterDetail, onStartRecording, onManageTemplates, onRetry }) {
    return (
        <div className="flex flex-col h-full overflow-hidden bg-white">
            <div className="pt-14 pb-3 px-6 bg-white flex justify-between items-center shadow-sm z-10 shrink-0">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">会议记录</h1>
                <div className="flex items-center gap-2">
                    <button onClick={onStartRecording} className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900 text-white shadow-sm active:scale-95 transition-transform">
                        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse border border-slate-900 shadow-[0_0_0_1px_rgba(248,113,113,0.3)]"></div>
                        <span className="text-[13px] font-bold tracking-wide">开始录音</span>
                    </button>
                    <button onClick={onManageTemplates} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100 transition-colors">
                        <LayoutTemplate size={20} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pt-2 pb-32">
                {meetings.length === 0 ? (
                    <div className="h-40 flex flex-col items-center justify-center text-slate-400">
                        <Mic size={32} className="mb-3 opacity-20" />
                        <p className="text-[14px]">还没有会议记录</p>
                    </div>
                ) : (
                    meetings.map(m => (
                        <MeetingCard 
                            key={m.id} 
                            meeting={m} 
                            isPlaying={playingId === m.id}
                            playProgress={playProgress}
                            onTogglePlay={(e) => {
                                e.stopPropagation();
                                setPlayingId(playingId === m.id ? null : m.id);
                            }}
                            onClick={() => {
                                if (m.status === 'completed' || m.status === 'recording') onEnterDetail(m.id);
                            }}
                            onRetry={(e) => {
                                e.stopPropagation();
                                onRetry(m.id);
                            }}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function MeetingCard({ meeting, isPlaying, playProgress, onTogglePlay, onClick, onRetry }) {
    const isCompleted = meeting.status === 'completed';
    const isRecording = meeting.status === 'recording';
    const isGenerating = meeting.status === 'generating';
    const isFailed = meeting.status === 'failed';

    return (
        <div 
            onClick={onClick}
            className={`py-4 border-b border-slate-100 transition-colors ${isCompleted || isRecording ? 'cursor-pointer active:bg-slate-50 hover:bg-slate-50/50 rounded-xl px-2 -mx-2' : ''}`}
        >
            <div className="flex justify-between items-start mb-2.5">
                <div className="flex-1 pr-4">
                    <h3 className="font-bold text-[16px] text-slate-800 leading-snug tracking-tight mb-1 line-clamp-1">
                        {meeting.title || (isRecording ? '新会议' : '会议记录')}
                    </h3>
                    <div className="text-[13px] text-slate-400 font-medium">
                        {formatMeetingDate(meeting.time)}
                    </div>
                </div>
                {isCompleted && (
                    <div className="flex items-center gap-3 shrink-0 mt-0.5">
                        <span className="text-[14px] text-slate-400/80 font-medium">{formatDuration(meeting.duration)}</span>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onTogglePlay(e); }}
                            className="w-[28px] h-[28px] rounded-full bg-[#1677FF] flex items-center justify-center text-white active:scale-95 hover:bg-blue-600 transition-all shadow-sm"
                        >
                            {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
                        </button>
                    </div>
                )}
                {isRecording && (
                    <div className="flex items-center gap-2 shrink-0 mt-0.5">
                        <span className="text-[14px] text-slate-500 font-mono">{formatDuration(meeting.duration)}</span>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-50 text-red-600 text-[11px] font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            录音中
                        </div>
                    </div>
                )}
            </div>

            {isCompleted && meeting.summaryText && (
                <p className="text-[14px] text-slate-500 line-clamp-1 leading-relaxed">
                    {meeting.summaryText}
                </p>
            )}

            {isGenerating && (
                <div className="flex items-center gap-2 mt-1">
                    <RefreshCw size={14} className="text-indigo-500 animate-spin" />
                    <span className="text-[13px] text-indigo-600 font-medium">正在生成总结...</span>
                </div>
            )}

            {isFailed && (
                <div className="flex items-center justify-between mt-1 border border-red-100 bg-red-50 p-2.5 rounded-lg">
                    <div className="flex items-center gap-2 text-red-500">
                        <AlertCircle size={15} />
                        <span className="text-[13px] font-medium">生成失败</span>
                    </div>
                    <button onClick={onRetry} className="text-[12px] font-bold text-slate-600 bg-white px-3 py-1.5 rounded shadow-sm active:scale-95 transition-transform">
                        重试
                    </button>
                </div>
            )}
        </div>
    );
}

function RecordingScreen({ meeting, onUpdate, onBack, onStop }) {
    const [duration, setDuration] = useState(meeting.duration || 0);
    const [title, setTitle] = useState(meeting.title || '');
    const [note, setNote] = useState(meeting.note || '');
    const [showTemplateSheet, setShowTemplateSheet] = useState(false);

    useEffect(() => {
        const t = setInterval(() => {
            setDuration(prev => prev + 1);
            onUpdate({ duration: duration + 1 });
        }, 1000);
        return () => clearInterval(t);
    }, [duration]);

    const handleBack = () => {
        if (window.confirm("录音将在后台继续进行，你可以稍后回来继续记笔记。确认离开？")) {
            onUpdate({ title, note });
            onBack();
        }
    };

    const handleStop = () => {
        onUpdate({ title, note, duration });
        onStop();
    };

    const currentTemplateName = BUILTIN_TEMPLATES.find(t => t.id === meeting.templateId)?.name || '通用模板';

    return (
        <div className="flex flex-col h-full bg-[#fcfcfc]">
            {/* Header */}
            <div className="pt-14 pb-2 px-4 flex items-start gap-2 shrink-0 border-b border-transparent relative z-10 bg-white shadow-sm">
                <button onClick={handleBack} className="p-2 -ml-2 rounded-full text-slate-400 hover:bg-slate-50">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1 mt-1.5">
                    <input 
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        placeholder="输入会议标题" 
                        className="w-full text-[20px] font-black text-slate-900 bg-transparent border-none placeholder-slate-300 focus:outline-none focus:ring-0" 
                    />
                    <button 
                        onClick={() => setShowTemplateSheet(true)}
                        className="inline-flex items-center gap-1 mt-1 px-2.5 py-1 rounded-md bg-slate-50 text-slate-500 text-[11px] font-semibold border border-slate-100 active:bg-slate-100 transition-colors"
                    >
                        <LayoutTemplate size={12} />
                        {currentTemplateName}
                    </button>
                </div>
            </div>

            {/* Note Area */}
            <div className="flex-1 w-full p-6 overflow-y-auto">
                <textarea 
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="在这里自由记录要点..."
                    className="w-full h-full resize-none text-[15px] leading-relaxed text-slate-700 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-slate-300"
                />
            </div>

            {/* Bottom Bar */}
            <div className="sticky bottom-0 left-0 right-0 p-6 pb-12 bg-gradient-to-t from-white via-white to-transparent shrink-0 pointer-events-none flex justify-center">
                <div className="pointer-events-auto w-full max-w-sm h-16 bg-slate-900 rounded-full flex items-center justify-between px-6 shadow-[0_16px_32px_rgba(15,23,42,0.15)]">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.6)]"></div>
                        <span className="text-white font-mono font-medium text-[16px] tracking-wider">{formatDuration(duration)}</span>
                    </div>
                    <button 
                        onClick={handleStop}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 hover:scale-105 active:scale-95 transition-transform shadow-sm"
                    >
                        <Square size={16} fill="currentColor" />
                    </button>
                </div>
            </div>

            {/* Template Sheet Drawer */}
            <AnimatePresence>
                {showTemplateSheet && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setShowTemplateSheet(false)}
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
                        />
                        <motion.div 
                            initial={{ y: '100%' }} 
                            animate={{ y: 0 }} 
                            exit={{ y: '100%' }} 
                            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 p-6 pb-10"
                        >
                            <h3 className="text-[18px] font-black text-slate-900 mb-4">选择会议模板</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {BUILTIN_TEMPLATES.map(t => (
                                    <button 
                                        key={t.id}
                                        onClick={() => {
                                            onUpdate({ templateId: t.id });
                                            setShowTemplateSheet(false);
                                        }}
                                        className={`p-3 rounded-xl border text-left flex flex-col transition-all ${meeting.templateId === t.id ? 'border-indigo-500 bg-indigo-50 shadow-sm text-indigo-900' : 'border-slate-100 bg-slate-50 text-slate-700 active:bg-slate-100'}`}
                                    >
                                        <div className="text-[13px] font-black mb-1">{t.name}</div>
                                        <div className={`text-[10px] ${meeting.templateId === t.id ? 'text-indigo-600/80' : 'text-slate-400'}`}>{t.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}


// A helper map for built-in template icons
const TEMPLATE_ICONS = {
    't1': <Users size={18} fill="currentColor" className="opacity-80" />,
    't2': <MessageSquare size={18} fill="currentColor" className="opacity-80" />,
    't3': <FileSignature size={18} fill="currentColor" className="opacity-80" />,
    't4': <Users size={18} fill="currentColor" className="opacity-80" />,
    't5': <Lightbulb size={18} fill="currentColor" className="opacity-80" />,
    't6': <Calendar size={18} fill="currentColor" className="opacity-80" />
};

function TemplateManageScreen({ defaultTemplate, setDefaultTemplate, templates, setTemplates, onBack }) {
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [deletingTemplate, setDeletingTemplate] = useState(null);
    
    // Form states
    const [tName, setTName] = useState('');
    const [tPrompt, setTPrompt] = useState('');
    const [original, setOriginal] = useState({ name: '', prompt: '' });
    
    // Modals & Effects
    const [showUnsaved, setShowUnsaved] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isPolishing, setIsPolishing] = useState(false);

    // Long press logic
    const [pressTimer, setPressTimer] = useState(null);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 2500);
    };

    const isEditing = editingTemplate !== null;
    const isNew = editingTemplate === 'new';
    const isDirty = tName !== original.name || tPrompt !== original.prompt;
    const canSave = tName.trim() !== '' && tPrompt.trim() !== '';
    const isCurrentDefault = !isNew && editingTemplate?.id === defaultTemplate;
    const titleText = isNew ? "新建模板" : "模板详情";

    const openEditor = (t) => {
        if (t === 'new') {
            setEditingTemplate('new');
            setTName(''); setTPrompt('');
            setOriginal({ name: '', prompt: '' });
        } else {
            setEditingTemplate(t);
            setTName(t.name); setTPrompt(t.prompt || '');
            setOriginal({ name: t.name, prompt: t.prompt || '' });
        }
    };

    const handleBackClick = () => {
        if (isEditing && isDirty) {
            setShowUnsaved(true);
        } else if (isEditing) {
            setEditingTemplate(null);
        } else {
            onBack();
        }
    };

    const handleSave = () => {
        if (!canSave) return;
        if (isNew) {
            const newId = 't_' + Date.now();
            const newT = { id: newId, name: tName.trim(), desc: '自定义模板', prompt: tPrompt.trim(), updatedAt: Date.now() };
            setTemplates([newT, ...templates]);
            showToast('模板已保存');
        } else {
            setTemplates(templates.map(t => t.id === editingTemplate.id ? { ...t, name: tName.trim(), prompt: tPrompt.trim(), updatedAt: Date.now() } : t));
            showToast('模板已保存');
        }
        setEditingTemplate(null);
    };

    const handleSetDefault = () => {
        if (!canSave) return;
        let finalId = editingTemplate?.id;
        if (isNew) {
            finalId = 't_' + Date.now();
            const newT = { id: finalId, name: tName.trim(), desc: '自定义模板', prompt: tPrompt.trim(), updatedAt: Date.now() };
            setTemplates([newT, ...templates]);
        } else {
            setTemplates(templates.map(t => t.id === editingTemplate.id ? { ...t, name: tName.trim(), prompt: tPrompt.trim(), updatedAt: Date.now() } : t));
        }
        setDefaultTemplate(finalId);
        showToast('已设为默认模板');
        setEditingTemplate(null);
    };

    const handleDelete = (id) => {
        const remaining = templates.filter(t => t.id !== id);
        setTemplates(remaining);
        if (defaultTemplate === id) {
            setDefaultTemplate(remaining.length > 0 ? remaining[0].id : null);
        }
        setDeletingTemplate(null);
    };

    const handlePressStart = (id) => {
        const t = setTimeout(() => setDeletingTemplate(id), 600);
        setPressTimer(t);
    };
    const handlePressEnd = () => {
        if (pressTimer) { clearTimeout(pressTimer); setPressTimer(null); }
    };

    const toggleVoice = () => {
        if (!isListening && !isPolishing) {
            setIsListening(true);
        } else if (isListening) {
            setIsListening(false);
            setIsPolishing(true);
            setTPrompt('');
            
            const targetText = "会议议程：列出本次会议讨论的主要议题\n关键讨论点：按议题分组，提炼核心观点和要点\n行动项：明确任务、负责人和时间\n要求：语言简练，要点清晰，优先提取我的笔记重点。";
            let index = 0;
            const interval = setInterval(() => {
                setTPrompt(targetText.slice(0, index + 1));
                index++;
                if (index === targetText.length) {
                    clearInterval(interval);
                    setIsPolishing(false);
                }
            }, 40);
        }
    };

    const sortedTemplates = [...templates].sort((a, b) => {
        if (a.id === defaultTemplate) return -1;
        if (b.id === defaultTemplate) return 1;
        
        const timeA = a.updatedAt || 0;
        const timeB = b.updatedAt || 0;
        return timeB - timeA;
    });

    return (
        <div className="flex flex-col h-full bg-[#FAFAFA] relative">
            {toastMsg && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-5 py-2.5 rounded-full text-[13px] font-bold z-50 animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-none">
                    {toastMsg}
                </div>
            )}

            <AnimatePresence>
                {!isEditing ? (
                    <motion.div 
                        key="list"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                        className="flex flex-col h-full absolute inset-0 z-10"
                    >
                        <div className="pt-14 pb-4 px-4 flex items-center justify-between shrink-0">
                            <button onClick={handleBackClick} className="flex items-center text-slate-600 font-bold active:scale-95 transition-transform text-[15px]">
                                <ChevronLeft size={20} className="-ml-1" /> 返回
                            </button>
                            <h1 className="text-[17px] font-black text-slate-900 tracking-tight">模板管理</h1>
                            <div className="w-[60px]" />
                        </div>

                        <div className="flex-1 overflow-y-auto w-full px-6 pt-2 pb-24">
                            <motion.div className="mt-8 relative origin-center">
                                <button 
                                    onClick={() => openEditor('new')}
                                    className="w-full py-[22px] rounded-[16px] border border-dashed border-slate-300 bg-[#FAFAFA] flex items-center justify-center gap-3 text-slate-700 active:bg-slate-50 transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center pointer-events-none">
                                        <Plus size={16} className="text-slate-500" />
                                    </div>
                                    <span className="text-[14px] font-black pointer-events-none">新建自定义模板</span>
                                </button>
                            </motion.div>

                            <div className="mt-10 flex justify-between items-end mb-4 px-1">
                                <h3 className="text-[17px] italic font-black text-slate-800 tracking-wide">常用模板</h3>
                                <span className="text-[12px] text-slate-400 font-medium">共 {templates.length} 个</span>
                            </div>

                            {templates.length === 0 ? (
                                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                                    <Folder size={40} className="mb-3 opacity-30" />
                                    <p className="text-[13px] font-medium">还没有模板，点击上方按钮新建一个</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {sortedTemplates.map(t => (
                                        <div 
                                            key={t.id} 
                                            onMouseDown={() => handlePressStart(t.id)} onMouseUp={handlePressEnd} onMouseLeave={handlePressEnd}
                                            onTouchStart={() => handlePressStart(t.id)} onTouchEnd={handlePressEnd}
                                            onClick={() => openEditor(t)} 
                                            className="bg-white rounded-[16px] p-2.5 flex items-center shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-transparent active:border-slate-200 transition-colors cursor-pointer select-none"
                                        >
                                            <div className="w-12 h-12 rounded-[12px] bg-[#EEF2EC] flex items-center justify-center text-[#586b62] shrink-0">
                                                {TEMPLATE_ICONS[t.id] || <FileText size={18} fill="currentColor" className="opacity-80" />}
                                            </div>
                                            <div className="ml-3.5 flex-1 pr-2 pointer-events-none">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-[15px] font-bold text-slate-800">{t.name}</h4>
                                                    {defaultTemplate === t.id && (
                                                        <span className="text-[10px] font-black bg-[#5F5e5a] text-white px-1.5 py-0.5 rounded-[4px] tracking-wider scale-90 origin-left">默认</span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{t.desc}</p>
                                            </div>
                                            <div className="w-10 h-10 flex items-center justify-center text-slate-300 shrink-0 pointer-events-none">
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="create"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                        className="absolute inset-0 z-20 bg-[#FAFAFA] flex flex-col origin-center overflow-hidden"
                    >
                        <div className="flex flex-col h-full w-full relative">
                            <div className="pt-14 pb-4 px-4 flex justify-between items-center shrink-0 border-b border-slate-100 bg-white shadow-sm z-10">
                                <button onClick={handleBackClick} className="flex items-center text-slate-600 font-bold active:scale-95 transition-transform text-[15px]">
                                    <ChevronLeft size={20} className="-ml-1" /> 返回
                                </button>
                                <h1 className="text-[17px] font-black text-slate-900 tracking-tight">{titleText}</h1>
                                <div className="w-[60px]" />
                            </div>

                            <div className="flex-1 overflow-y-auto px-5 mt-5 pb-8 relative z-0">
                                <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100">
                                    <div>
                                        <label className="text-[12px] font-bold text-slate-500 block mb-2">模板名称</label>
                                        <input 
                                            type="text" 
                                            value={tName} 
                                            onChange={e => setTName(e.target.value)} 
                                            placeholder="例如：产品周报总结" 
                                            maxLength={20}
                                            className="w-full bg-transparent text-[16px] font-black tracking-wide text-slate-800 placeholder-slate-300 border-none focus:ring-0 p-0" 
                                        />
                                    </div>
                                    <div className="h-[1px] bg-slate-100 my-5" />
                                    <div className="relative">
                                        <label className="text-[12px] font-bold text-slate-500 block mb-2 mt-1">自定义提示词</label>
                                        <div className="relative">
                                            <textarea 
                                                value={tPrompt} 
                                                onChange={e => setTPrompt(e.target.value)} 
                                                placeholder={`描述你希望 AI 如何总结会议，例如：提取关键决策和下一步行动计划...`} 
                                                className="w-full bg-transparent text-[15px] leading-relaxed text-slate-700 placeholder-slate-300 border-none focus:ring-0 p-0 h-40 resize-none z-10 relative" 
                                            />
                                            {isPolishing && (
                                                <div className="absolute bottom-2 left-0 text-[10px] text-indigo-500 flex items-center gap-1 font-bold animate-pulse">
                                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> AI 正在润色...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={toggleVoice}
                                    className={`mt-4 w-full py-4 rounded-[16px] border shadow-sm flex items-center justify-center gap-2 font-bold active:scale-95 transition-all ${isListening ? 'bg-red-50 border-red-200 text-red-500 shadow-red-100' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                                >
                                    {isListening ? (
                                        <>
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute ml-[-80px]"></div>
                                            <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                                            点此结束并让 AI 润色
                                        </>
                                    ) : (
                                        <>
                                            <Mic size={18} className="text-indigo-500" />
                                            语音输入提示词
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="p-6 shrink-0 bg-white border-t border-slate-100 flex gap-3 shadow-[0_-8px_20px_rgba(0,0,0,0.02)] z-10">
                                <button 
                                    onClick={isCurrentDefault ? null : handleSetDefault}
                                    disabled={!canSave || isCurrentDefault}
                                    className={`flex-1 py-4 rounded-full font-bold text-[16px] tracking-wide transition-all ${!canSave ? 'bg-slate-50 text-slate-300 border border-slate-100' : isCurrentDefault ? 'bg-indigo-50 text-indigo-400 border border-indigo-100' : 'bg-white border border-[#EBEBEB] text-slate-700 active:scale-95 shadow-sm'}`}
                                >
                                    {isCurrentDefault ? '已设为默认 ✓' : '设为默认'}
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={!canSave}
                                    className={`flex-1 py-4 rounded-full font-bold text-[16px] tracking-wide transition-all ${!canSave ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white active:scale-95 shadow-[0_8px_20px_rgba(15,23,42,0.15)]'}`}
                                >
                                    保存模板
                                </button>
                            </div>
                            
                            {/* Unsaved Confirm Popup */}
                            {showUnsaved && (
                                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-8 animate-in fade-in duration-200">
                                    <div className="bg-white rounded-3xl p-6 w-full shadow-2xl animate-in zoom-in-95 duration-200">
                                        <h3 className="text-[18px] font-black text-slate-900 mb-2">还没保存，确定离开吗？</h3>
                                        <p className="text-[14px] text-slate-500 mb-6">修改的内容如果未保存将会丢失哦。</p>
                                        <div className="flex gap-3">
                                            <button onClick={() => setShowUnsaved(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-2xl active:scale-95">继续编辑</button>
                                            <button onClick={() => { setShowUnsaved(false); setEditingTemplate(null); }} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-2xl shadow-[0_4px_12px_rgba(239,68,68,0.25)] active:scale-95">离开</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Deletion Confirm Popup */}
            <AnimatePresence>
                {deletingTemplate && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-8">
                        <motion.div initial={{scale:0.95}} animate={{scale:1}} exit={{scale:0.95}} className="bg-white rounded-3xl p-6 w-full shadow-2xl">
                            <h3 className="text-[18px] font-black text-slate-900 mb-2 text-center">确定删除吗？</h3>
                            <p className="text-[14px] text-slate-500 mb-6 text-center">删除后不可恢复哦</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeletingTemplate(null)} className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-2xl active:scale-95">再想想</button>
                                <button onClick={() => handleDelete(deletingTemplate)} className="flex-1 py-3.5 bg-red-500 text-white font-bold rounded-2xl shadow-[0_4px_12px_rgba(239,68,68,0.25)] active:scale-95">删除</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Sparkles icon workaround (using custom SVG if lucide Sparkles isn't imported above)
// Actually we already imported Sparkles from lucide-react above.
