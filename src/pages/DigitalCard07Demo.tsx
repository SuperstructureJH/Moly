import React, { useState } from 'react';
import { ChevronLeft, Share2, MoveUpRight, Quote, Plus, Navigation, MapPin, Globe, Sparkles, MessageSquare, Briefcase, Mail, Edit2 } from 'lucide-react';
import FluidBackground from '../components/FluidBackground';
import { useNavigate } from 'react-router-dom';

const StandardBaseInfo = ({ profile, theme, className = "" }: { profile: any, theme: string, className?: string }) => {
    const defaultTheme = 'cleanWhite';
    const themes: any = {
        poster: {
            bg: "bg-[#0b0b0b] text-white border-t border-white/5",
            rounded: "rounded-t-[40px]",
            title: "text-[15px] font-black text-white tracking-widest uppercase",
            tag: "bg-white/10 border border-white/10 text-white rounded-full",
            card: "bg-[#141414] border border-white/10 rounded-[20px] backdrop-blur-md",
            num: "text-[24px] font-black text-white",
            sub: "text-[10px] text-gray-400 font-bold",
            icon: "text-orange-500",
            text: "text-[13px] text-gray-300 font-medium",
            topicBox: "bg-[#141414] border border-white/10 rounded-[16px] px-4 py-3.5 flex items-center gap-3",
            topicText: "text-[13px] font-bold text-white",
            greeting: "text-white"
        },

        entity: {
            bg: "bg-[#f8f8f8] text-[#050505] border-t-[3px] border-[#111ae6]",
            rounded: "rounded-none",
            title: "text-[10px] font-black uppercase text-[#111ae6] tracking-widest",
            tag: "bg-transparent border-2 border-[#111ae6]/20 text-[#050505] rounded-none",
            card: "bg-white/60 border border-[#111ae6]/20 rounded-none",
            num: "text-[22px] font-black text-[#050505] font-mono tracking-tighter",
            sub: "text-[10px] text-[#111ae6] font-black uppercase tracking-widest",
            icon: "text-[#111ae6]",
            text: "text-[12px] text-[#050505] font-bold leading-relaxed",
            topicBox: "bg-white/60 border border-[#111ae6]/20 rounded-none px-4 py-3 flex items-center gap-3",
            topicText: "text-[12px] font-bold text-[#050505]",
            greeting: "text-[#050505] uppercase tracking-tighter"
        },
        editorial: {
            bg: "bg-white text-[#111] border-t border-gray-200",
            rounded: "rounded-t-none",
            title: "font-serif text-[24px] italic font-medium text-[#111]",
            tag: "bg-white border border-gray-200 text-gray-600 rounded-full",
            card: "bg-transparent border-t border-gray-100 rounded-none pt-5",
            num: "font-serif text-[28px] font-medium text-[#111]",
            sub: "text-[9px] uppercase tracking-[0.18em] font-medium text-gray-400 mt-1",
            icon: "text-[#111]",
            text: "text-[15px] text-gray-600 font-medium font-serif italic leading-snug",
            topicBox: "border-b border-gray-100 py-4 flex items-center gap-3",
            topicText: "font-serif text-[18px] text-[#111]",
            greeting: "font-serif text-[26px] text-[#111]"
        },
        watercolor: {
            bg: "bg-[#F7F6F0] text-[#232321] border-t border-[#232321]/10",
            rounded: "rounded-t-[32px]",
            title: "font-sans text-[10px] tracking-[0.15em] font-bold text-[#E63935] uppercase",
            tag: "bg-transparent border border-[#E63935]/30 text-[#E63935] rounded-full",
            card: "bg-white/40 border border-[#232321]/5 rounded-[20px] backdrop-blur-[2px]",
            num: "font-serif text-[28px] font-medium text-[#232321]",
            sub: "text-[10px] uppercase tracking-[0.1em] font-medium text-[#232321]/50 mt-1",
            icon: "text-[#E63935]",
            text: "text-[14px] text-[#232321]/80 font-medium leading-relaxed font-serif",
            topicBox: "bg-white/40 border border-[#232321]/5 rounded-[16px] px-4 py-3.5 flex items-center gap-3",
            topicText: "text-[14px] font-medium text-[#232321]",
            greeting: "font-serif text-[24px] font-semibold text-[#232321]"
        },
        vermeer: {
            bg: "bg-[#151311] text-[#F7F6F0] border-t border-[#D29F54]/20",
            rounded: "rounded-t-[40px]",
            title: "font-serif text-[13px] tracking-[0.2em] font-medium text-[#D29F54] uppercase",
            tag: "bg-transparent border border-[#6B8DAF]/40 text-[#6B8DAF] rounded-full",
            card: "bg-zinc-900/40 border border-[#D29F54]/10 rounded-[20px] backdrop-blur-[4px]",
            num: "font-serif text-[32px] font-medium text-[#F7F6F0]",
            sub: "text-[10px] uppercase tracking-[0.15em] font-medium text-[#F7F6F0]/50 mt-1",
            icon: "text-[#D29F54]",
            text: "text-[15px] text-[#F7F6F0]/80 font-medium font-serif italic leading-relaxed",
            topicBox: "border-b border-[#D29F54]/10 py-4 flex items-center gap-3",
            topicText: "font-serif text-[17px] text-[#F7F6F0]",
            greeting: "font-serif text-[26px] text-[#F7F6F0]"
        },
        monoRed: {
            bg: "bg-[#D8281B] text-white border-t border-white/20",
            rounded: "rounded-none",
            title: "text-[10px] font-black uppercase text-white/60 tracking-widest",
            tag: "bg-transparent border border-white/40 text-white rounded-none",
            card: "bg-white/10 border border-white/20 rounded-none",
            num: "text-[22px] font-black text-white",
            sub: "text-[10px] text-white/60 font-black uppercase tracking-widest mt-1",
            icon: "text-white",
            text: "text-[13px] text-white/80 font-medium leading-relaxed",
            topicBox: "border-b border-white/20 py-3.5 flex items-center gap-3",
            topicText: "text-[13px] font-bold text-white",
            greeting: "text-white font-black uppercase tracking-tight text-[18px]"
        }
    };
    const s = themes[theme] || themes[defaultTheme];

    const titles = {
        poster: ['同频交集', '找我聊聊'],
        entity: ['[ SYS.INTERSECTIONS ]', '[ PARAMS.TOPICS ]'],
        editorial: ['Intersections', 'Topics for Discussion'],
        watercolor: ['INT', 'TPC'],
        vermeer: ['Shared Resonances', 'Gallery of Topics'],
        monoRed: ['Topics', 'Connect']
    }[theme as 'poster'|'entity'|'editorial'|'watercolor'|'vermeer'|'monoRed'] || ['同频交集', '找我聊聊'];

    return (
        <div className={`${s.bg} ${s.rounded} px-6 pt-10 pb-32 mt-16 font-sans relative z-20 ${className}`}>
            {/* Avatar & Greeting */}
            <div className="flex items-start gap-4 mb-8">
                <div className={`w-14 h-14 bg-gray-200 shadow-inner shrink-0 overflow-hidden flex items-center justify-center text-gray-400 ${theme === 'editorial' || theme === 'entity' ? 'rounded-md' : 'rounded-full'}`}>
                    Avatar
                </div>
                <div>
                    <h2 className={`font-extrabold flex items-center gap-1 ${s.greeting} ${theme !== 'editorial' ? 'text-[18px]' : ''}`}>
                        {theme === 'entity' ? `[USR] ${profile.enName}` : `我是${profile.name}`} <span className="text-xl ml-1">{theme !== 'entity' && theme !== 'editorial' && '👋'}</span>
                    </h2>
                    <p className={`mt-1 leading-snug ${s.text}`}>{theme === 'entity' ? `STATUS: ACTIVE // LOOKING_FOR: IMPACT` : `期待探讨一个改变世界的产品`}</p>
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2.5 mb-8">
                <div className={`px-3.5 py-1.5 flex items-center gap-1.5 text-[11px] font-bold ${s.tag}`}>
                    <Briefcase size={12} className={s.icon} /> {profile.role.split(' / ')[0]}
                </div>
                <div className={`px-3.5 py-1.5 flex items-center gap-1.5 text-[11px] font-bold ${s.tag}`}>
                    <MapPin size={12} className={s.icon} /> {profile.location}
                </div>
                <div className={`px-3.5 py-1.5 flex items-center gap-1.5 text-[11px] font-bold ${s.tag}`}>
                    <Mail size={12} className={s.icon} /> {profile.enName.toLowerCase()}@{profile.website}
                </div>
            </div>

            {/* Mission / Bio Card */}
            <div className={`p-4 mb-10 flex items-start gap-3 ${s.card}`}>
                <Edit2 size={16} className={`${s.icon} shrink-0 mt-0.5`} />
                <p className={`${s.text} flex-1`}>
                    {profile.mission}
                </p>
            </div>

            {/* Intersections */}
            <div className="mb-10">
                <h3 className={`mb-5 ${s.title}`}>{titles[0]}</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className={`p-4 flex flex-col justify-center ${s.card}`}>
                        <div className={`mb-1 leading-none ${s.num}`}>3+</div>
                        <div className={`mb-3 ${s.sub}`}>共同好友</div>
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4].map(i => <div key={i} className={`w-[10px] h-[10px] ${theme==='entity' ? 'rounded-none bg-[#111ae6]/40' : 'rounded-full bg-gray-300'}`}></div>)}
                        </div>
                    </div>
                    <div className={`p-4 flex flex-col justify-center ${s.card}`}>
                        <div className={`mb-1 leading-none ${s.num}`}>4+</div>
                        <div className={`mb-3 ${s.sub}`}>共同的行业标签</div>
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4].map(i => <div key={i} className={`w-[10px] h-[10px] ${theme==='entity' ? 'rounded-none bg-[#111ae6]/40' : 'rounded-full bg-gray-300'}`}></div>)}
                        </div>
                    </div>
                </div>
                <div className={`p-4 flex items-start gap-3 ${s.card}`}>
                    <Sparkles size={16} className={`${s.icon} shrink-0 mt-0.5`} />
                    <p className={`${s.text} flex-1`}>
                        基于你们的背景，{profile.name}可能对Moly当前的效率工具矩阵感兴趣，建议围绕“Agent办公流集成”探讨。
                    </p>
                </div>
            </div>

            {/* Topics */}
            <div>
                <h3 className={`mb-4 ${s.title}`}>{titles[1]}</h3>
                <div className="space-y-3">
                    {profile.topics.map((item: any, idx: number) => (
                        <div key={idx} className={s.topicBox}>
                            <Sparkles size={14} className={`${s.icon} shrink-0`} />
                            <span className={s.topicText}>{item.title}</span>
                        </div>
                    ))}
                    <div className={s.topicBox}>
                        <Sparkles size={14} className={`${s.icon} shrink-0`} />
                        <span className={s.topicText}>初创团队的资源对接需求</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DigitalCard07Demo = () => {
    const navigate = useNavigate();
    const [activeTheme, setActiveTheme] = useState<'poster' | 'entity' | 'editorial' | 'watercolor' | 'vermeer' | 'monoRed'>('poster');

    const [aiQuestion, setAiQuestion] = useState('');
    const [chatLog, setChatLog] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);

    const handleAskAI = (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiQuestion.trim()) return;

        setChatLog((prev) => [...prev, { role: 'user', text: aiQuestion }]);
        setAiQuestion('');

        setTimeout(() => {
            setChatLog((prev) => [
                ...prev,
                { role: 'ai', text: '根据对方名片，Han 是 Moly 的联合创始人，目前专注于大模型产品以及商务效率工具的场景挖掘。' },
            ]);
        }, 1200);
    };

    // Content variables to keep it consistent across themes
    const profile = {
        name: '董江涵',
        enName: 'Han',
        role: '联合创始人 / AI 产品方向',
        company: 'Moly',
        location: '北京朝阳',
        website: 'moly.ai',
        mission: '在做一款面向商务人士的 AI 秘书产品，帮助用户更自然地管理日程、联系人、会议和后续推进事项。',
        topics: [
            { id: '01', title: '大模型 AI 产品设计与商业化', color: 'orange' },
            { id: '02', title: '商务效率工具的场景挖掘', color: 'indigo' },
            { id: '03', title: '设计与体验、新产品的合作可能性', color: 'neutral' },
        ],
        hook: '我最近在寻找做大模型应用或企业服务的同行交流想法，欢迎随时打招呼。'
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            
            {/* Sidebar Controls */}
            <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-20">
                <div className="p-6 border-b border-gray-100 pb-4">
                    <button onClick={() => navigate('/')} className="mb-4 flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        <ChevronLeft size={16} className="-ml-1" /> 返回演示中心
                    </button>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">版式实验室</h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">0.7 数字名片布局方案</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {/* Theme 1: Posters */}
                    <button
                        onClick={() => setActiveTheme('poster')}
                        className={`w-full text-left p-4 rounded-2xl transition-all border ${activeTheme === 'poster' ? 'bg-[#0c0c0c] border-gray-800 shadow-md transform scale-[1.02]' : 'bg-white border-gray-200 hover:border-gray-400'}`}
                    >
                        <span className={`block text-[15px] font-black tracking-tight mb-1 ${activeTheme === 'poster' ? 'text-white' : 'text-gray-900'}`}>01 暗黑海报风</span>
                        <span className={`block text-[12px] leading-relaxed ${activeTheme === 'poster' ? 'text-gray-400' : 'text-gray-500'}`}>
                            名字作为超级视觉符号，结合深色噪点与微光，极具先锋艺术感与视觉冲击力。
                        </span>
                    </button>

                    {/* Theme 2: Entity Data Flow */}
                    <button
                        onClick={() => setActiveTheme('entity')}
                        className={`w-full text-left p-4 rounded-2xl transition-all border ${activeTheme === 'entity' ? 'bg-blue-50 border-blue-200 shadow-md transform scale-[1.02]' : 'bg-white border-gray-200 hover:border-gray-400'}`}
                    >
                        <span className={`block text-[15px] font-black tracking-tight mb-1 ${activeTheme === 'entity' ? 'text-blue-900' : 'text-gray-900'}`}>02 数据流图谱 (Entity)</span>
                        <span className={`block text-[12px] leading-relaxed ${activeTheme === 'entity' ? 'text-blue-700/80' : 'text-gray-500'}`}>
                            动态 WebGL 斑斓流体背景，极度理性的数据排版，仿佛在操控一台未来主机。
                        </span>
                    </button>

                    {/* Theme 3: Editorial */}
                    <button
                        onClick={() => setActiveTheme('editorial')}
                        className={`w-full text-left p-4 rounded-2xl transition-all border ${activeTheme === 'editorial' ? 'bg-[#111] border-gray-900 shadow-xl transform scale-[1.02]' : 'bg-white border-gray-200 hover:border-gray-400'}`}
                    >
                        <span className={`block text-[15px] font-black tracking-tight mb-1 ${activeTheme === 'editorial' ? 'text-white' : 'text-gray-900'}`}>03 优雅杂志风 (Editorial)</span>
                        <span className={`block text-[12px] leading-relaxed ${activeTheme === 'editorial' ? 'text-gray-400' : 'text-gray-500'}`}>
                            大号衬线字体与极致留白，宛如一本高端时尚杂志的个人专访页。
                        </span>
                    </button>

                    {/* Theme 4: Watercolor */}
                    <button
                        onClick={() => setActiveTheme('watercolor')}
                        className={`w-full text-left p-4 rounded-2xl transition-all border ${activeTheme === 'watercolor' ? 'bg-[#F7F6F0] border-[#E63935]/30 shadow-xl transform scale-[1.02]' : 'bg-white border-gray-200 hover:border-gray-400'}`}
                    >
                        <span className={`block text-[15px] font-black tracking-tight mb-1 ${activeTheme === 'watercolor' ? 'text-[#E63935]' : 'text-gray-900'}`}>04 水彩晕染风 (Watercolor)</span>
                        <span className={`block text-[12px] leading-relaxed ${activeTheme === 'watercolor' ? 'text-[#F58220]' : 'text-gray-500'}`}>
                            底层 CSS 滤镜与大色块融合，创造出真实纸张上水彩颜料晕染的艺术质感。
                        </span>
                    </button>

                    {/* Theme 5: Vermeer */}
                    <button
                        onClick={() => setActiveTheme('vermeer')}
                        className={`w-full text-left p-4 rounded-2xl transition-all border ${activeTheme === 'vermeer' ? 'bg-[#151311] border-[#D29F54]/50 shadow-[0_10px_30px_rgba(215,65,52,0.15)] transform scale-[1.02]' : 'bg-white border-gray-200 hover:border-gray-400'}`}
                    >
                        <span className={`block text-[15px] font-black tracking-tight mb-1 ${activeTheme === 'vermeer' ? 'text-[#F3CD89]' : 'text-gray-900'}`}>05 珍珠少女风 (Vermeer)</span>
                        <span className={`block text-[12px] leading-relaxed ${activeTheme === 'vermeer' ? 'text-[#6B8DAF]' : 'text-gray-500'}`}>
                            戴珍珠耳环的少女。利用传世名画的色彩提取（明黄、青金石蓝、珠光渐变）进行个人主题渲染。
                        </span>
                    </button>

                    {/* Theme 6: Monogram Red */}
                    <button
                        onClick={() => setActiveTheme('monoRed')}
                        className={`w-full text-left p-4 rounded-2xl transition-all border ${activeTheme === 'monoRed' ? 'bg-[#D8281B] border-[#D8281B] shadow-[0_10px_30px_rgba(216,40,27,0.35)] transform scale-[1.02]' : 'bg-white border-gray-200 hover:border-gray-400'}`}
                    >
                        <span className={`block text-[15px] font-black tracking-tight mb-1 ${activeTheme === 'monoRed' ? 'text-white' : 'text-gray-900'}`}>06 红色 Monogram 风</span>
                        <span className={`block text-[12px] leading-relaxed ${activeTheme === 'monoRed' ? 'text-white/70' : 'text-gray-500'}`}>
                            大胆纯色背景 + 方形零圆角 + Inter Black 超重字体，移动原生感极强的品牌卡片。
                        </span>
                    </button>
                </div>
            </div>

            {/* Main Content Area - iPhone Mockup */}
            <div className="flex-1 flex justify-center items-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200 to-slate-300 p-8 relative">
                
                {/* 
                    RENDER CONCEPT 1: 暗黑海报风 (Dark Poster) 
                */}
                {activeTheme === 'poster' && (
                    <div className="relative w-full max-w-[400px] h-[850px] bg-[#0c0c0c] text-neutral-200 rounded-[50px] overflow-hidden border-[8px] border-zinc-900 shadow-2xl transition-opacity animate-fade-in">
                        {/* Noise & Backgrounds */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30 mix-blend-overlay pointer-events-none z-50"></div>
                        <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-orange-600/30 rounded-full blur-[120px] mix-blend-color-dodge"></div>
                        <div className="absolute bottom-[20%] left-[-20%] w-[250px] h-[350px] bg-indigo-700/20 rounded-full blur-[100px] mix-blend-color-dodge"></div>
                        
                        {/* Header */}
                        <div className="absolute top-0 w-full px-6 py-5 flex justify-between items-center z-40 mix-blend-difference text-white">
                            <button className="p-2 -ml-2 hover:text-white/60 transition-colors"><ChevronLeft strokeWidth={1.5} size={28} /></button>
                            <button className="p-2 -mr-2 hover:text-white/60 transition-colors"><Share2 strokeWidth={1.5} size={22} /></button>
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 overflow-y-auto no-scrollbar pb-32 pt-28 px-6 z-10 flex flex-col">
                            {/* Decorative Letter */}
                            <div className="absolute top-16 right-6 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center -rotate-12 mix-blend-overlay backdrop-blur-sm">
                                <span className="font-serif italic text-white/40 text-sm">H</span>
                            </div>

                            <div className="flex flex-col items-start mb-12 relative">
                                <div className="w-12 h-[2px] bg-orange-500 mb-6 -ml-6"></div>
                                <h1 className="text-6xl font-black tracking-tighter leading-[0.85] text-white">DONG<br /><span className="font-serif italic font-light ml-8 text-neutral-400">Jianghan</span></h1>
                                <div className="mt-6 flex flex-col gap-1 border-l border-white/10 pl-4">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-bold">CO-FOUNDER · AI PRODUCT</p>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-orange-400 font-bold flex items-center gap-2">
                                        @ MOLY.AI <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span> BEIJING
                                    </p>
                                </div>
                            </div>

                            <div className="mb-14 relative">
                                <div className="absolute -top-12 -left-4 text-[120px] font-serif font-black text-white/5 opacity-50 select-none">"</div>
                                <h2 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-4 flex items-center gap-3"><span className="w-4 h-[1px] bg-neutral-600"></span>Mission Statement</h2>
                                <p className="text-[20px] md:text-[22px] font-serif font-medium leading-[1.6] text-neutral-100 tracking-wide text-justify indent-8 z-10 relative">
                                    在做一款面向商务人士的 <i className="text-orange-400 font-normal">AI 秘书产品</i>，帮助用户更自然地管理日程、联系人、会议和后续推进事项。
                                </p>
                            </div>

                            <div className="mb-12 border-t border-white/10 pt-8">
                                <div className="flex justify-between items-end mb-8">
                                    <h2 className="text-[12px] uppercase tracking-[0.2em] text-neutral-400">Let's Talk About</h2>
                                    <MoveUpRight size={16} className="text-orange-500 mb-1" />
                                </div>
                                <ul className="space-y-4">
                                    {profile.topics.map((item, idx) => (
                                        <li key={idx} className="group relative flex items-start gap-4 p-4 border border-white/5 bg-white/5 rounded-xl backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 cursor-crosshair overflow-hidden">
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity ${item.color === 'orange' ? 'bg-orange-500' : item.color === 'indigo' ? 'bg-indigo-500' : 'bg-neutral-300'}`}></div>
                                            <span className="text-[10px] font-mono text-neutral-500 mt-1">{item.id}</span>
                                            <p className="text-[14px] leading-relaxed text-neutral-200 group-hover:text-white transition-colors">
                                                {idx === 0 ? <><strong className="font-medium text-orange-300">大模型 AI </strong>产品设计与商业化</> : 
                                                 idx === 1 ? <><strong className="font-medium text-indigo-300">商务效率工具</strong>的场景挖掘</> : 
                                                 <>设计与体验、<strong className="font-medium">新产品合作的可能性</strong></>}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-auto mb-8 border border-orange-500/30 bg-orange-500/10 p-5 rounded-2xl relative overflow-hidden backdrop-blur-md">
                                <div className="absolute top-0 right-0 p-2 opacity-20"><Quote size={40} className="text-orange-500" /></div>
                                <p className="text-[12px] leading-relaxed text-orange-100/90 relative z-10 font-medium">
                                    <span className="block text-[9px] uppercase tracking-widest text-orange-400 font-bold mb-2">Notice</span>
                                    我最近在寻找做<span className="text-orange-400 bg-orange-900/40 px-1 py-0.5 rounded mx-0.5 shadow-[0_0_8px_rgba(249,115,22,0.4)]">大模型应用</span>或<span className="text-orange-400 bg-orange-900/40 px-1 py-0.5 rounded mx-0.5 shadow-[0_0_8px_rgba(249,115,22,0.4)]">企业服务</span>的同行交流想法，欢迎随时打招呼。
                                </p>
                            </div>
                            
                            <StandardBaseInfo profile={profile} theme={activeTheme} className="w-[calc(100%+48px)] -mx-6" />
                        </div>

                        <div className="absolute bottom-0 left-0 w-full z-40">
                            <div className="h-20 bg-gradient-to-t from-[#0c0c0c] to-transparent w-full absolute -top-20 pointer-events-none"></div>
                            <div className="p-6 bg-[#0c0c0c]/80 backdrop-blur-xl border-t border-white/5">
                                <button className="w-full relative group overflow-hidden bg-white text-black py-4 rounded-xl flex items-center justify-center gap-3">
                                    <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                                    <span className="relative z-10 text-[13px] uppercase tracking-[0.1em] font-black group-hover:text-white transition-colors">Initiate Connection</span>
                                    <Plus size={18} className="relative z-10 group-hover:text-white transition-colors group-hover:rotate-90 duration-300" strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[8px] uppercase tracking-[0.4em] text-neutral-600 font-bold opacity-30 pointer-events-none">Moly Identity // Edition 0.7</div>
                    </div>
                )}



                {/* RENDER CONCEPT 4: Entity */}
                {activeTheme === 'entity' && (
                    <div className="relative w-full max-w-[400px] h-[850px] bg-[#f8f8f8] text-[#050505] rounded-[50px] overflow-hidden border-[8px] border-gray-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] transition-opacity animate-fade-in flex flex-col" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                        
                        <FluidBackground />
                        
                        {/* Header Controls */}
                        <div className="absolute top-0 w-full px-6 py-5 flex justify-between items-center z-40 mix-blend-difference text-white">
                            <button className="p-2 -ml-2 rounded-full hover:opacity-70 transition-opacity"><ChevronLeft size={28} strokeWidth={1.5} /></button>
                            <button className="p-2 -mr-2 rounded-full hover:opacity-70 transition-opacity"><Share2 size={24} strokeWidth={1.5} /></button>
                        </div>

                        {/* Content Scroll */}
                        <div className="absolute inset-0 overflow-y-auto no-scrollbar pb-32 pt-24 px-6 z-10 font-bold" style={{ letterSpacing: '-0.03em' }}>
                            
                            <div className="flex justify-between items-end mb-10 mix-blend-difference text-white">
                                <div>
                                    <div className="w-12 h-12 border border-white/40 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-xl inline-block -skew-x-12 opacity-80">H</span>
                                    </div>
                                    <div className="text-[10px] uppercase tracking-[0.05em] font-black">Current — Active</div>
                                </div>
                                <div className="text-right text-[14px] font-black leading-[0.95] tracking-tight">
                                    Id<span className="inline-block w-4 h-[2px] bg-white align-middle ml-1 -translate-y-1"></span><br />
                                    Entity<br />
                                    004
                                </div>
                            </div>
                            
                            {/* Hero */}
                            <div className="mb-8 mix-blend-difference text-white">
                                <h1 className="text-[80px] leading-[0.85] font-black tracking-tighter mb-4 -ml-[3px]">{profile.enName}<br/>Han</h1>
                                <ul className="list-none text-[12px] font-black leading-tight space-y-1 tracking-tighter uppercase ml-1">
                                    <li className="ml-[20px] opacity-90 text-[10px]"><span className="text-blue-400 mr-2">_</span>{profile.role}</li>
                                    <li className="ml-[40px] opacity-90 text-[10px]"><span className="text-blue-400 mr-2">_</span>{profile.company} Solutions</li>
                                    <li className="ml-[60px] opacity-90 text-[10px]"><span className="text-blue-400 mr-2">_</span>{profile.location}</li>
                                </ul>
                            </div>
                            
                            {/* Mission & Topics */}
                            <div className="mb-10 flex flex-col gap-6 mix-blend-difference text-white">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.1em] opacity-50 mb-2 flex items-center justify-between">
                                        <span>// Sys.Mission</span>
                                    </h3>
                                    <p className="text-[14px] leading-[1.65] font-black tracking-tight opacity-95 text-justify">
                                        {profile.mission}
                                    </p>
                                </div>
                                
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.1em] opacity-50 mb-3">
                                        // Params.Topics
                                    </h3>
                                    <ul className="space-y-3">
                                        {profile.topics.map((t, i) => (
                                            <li key={i} className="text-[13px] font-black flex items-start gap-4">
                                                <span className="opacity-40 font-mono text-[10px] mt-[3px]">[{String(i + 1).padStart(2, '0')}]</span>
                                                <span className="opacity-90 leading-[1.2]">{t.title}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Hook */}
                            <div className="mb-12 border-l-[3px] border-white/40 pl-4 mix-blend-difference text-white">
                                <p className="text-[12px] font-bold leading-relaxed opacity-80 italic">
                                    "{profile.hook}"
                                </p>
                            </div>

                            {/* Bottom Right Meta */}
                            <div className="flex justify-between items-end mix-blend-difference text-white mb-6">
                                <div className="text-[10px] opacity-60 font-medium tracking-tight">
                                    Connection restricted<br/>to verified peers
                                </div>
                                <div className="text-right text-[11px] leading-[1.4] tracking-normal">
                                    <div className="text-[16px] font-black leading-[0.95] tracking-tight mb-2">
                                        Ctc<br/>Nfo
                                    </div>
                                    <div className="font-bold tracking-tight">
                                        <span className="block">Init: {profile.enName.toLowerCase()}@{profile.website}</span>
                                        <span className="block">Node: Verified Web</span>
                                    </div>
                                </div>
                            </div>
                            
                            <StandardBaseInfo profile={profile} theme={activeTheme} className="w-[calc(100%+48px)] -mx-6" />
                        </div>

                        {/* Base Action Area - Styled for Entity Theme */}
                        <div className="absolute bottom-0 left-0 w-full p-6 pt-16 bg-gradient-to-t from-[#f8f8f8] via-[#f8f8f8]/95 to-transparent z-40 pointer-events-none">
                            <button className="w-full pointer-events-auto bg-[#111ae6] text-white py-4 rounded-xl font-black text-[14px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(17,26,230,0.3)] hover:scale-[0.98] transition-all">
                                <span>[ SYS.CONNECT ]</span>
                                <Plus size={18} strokeWidth={2.5} />
                            </button>
                        </div>

                    </div>
                )}

                {/* RENDER CONCEPT 5: Editorial */}
                {activeTheme === 'editorial' && (
                    <div className="relative w-full max-w-[400px] h-[850px] bg-white text-[#111] rounded-[50px] overflow-hidden border-[8px] border-gray-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] transition-opacity animate-fade-in flex flex-col font-sans" style={{ fontFamily: '"Inter", sans-serif' }}>
                        
                        {/* Elegant Header */}
                        <div className="px-6 py-6 flex justify-between items-center z-40 bg-white sticky top-0">
                            <button className="text-[9px] uppercase tracking-[0.2em] font-medium opacity-80 hover:opacity-100 flex items-center gap-1">
                               D. Han <span className="w-1 h-1 bg-orange-600 rounded-full inline-block ml-1"></span>
                            </button>
                            <div className="w-6 h-3 flex flex-col justify-between cursor-pointer opacity-80 hover:opacity-100">
                                <span className="w-full h-[1px] bg-[#111] block"></span>
                                <span className="w-full h-[1px] bg-[#111] block"></span>
                            </div>
                        </div>

                        {/* Content Scroll */}
                        <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6">
                            
                            {/* Hero */}
                            <div className="pt-8 pb-12">
                                <h1 className="flex flex-col text-[72px] leading-[0.85] tracking-tight mb-10" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                                    <span>Dong</span>
                                    <span className="self-end mr-4">Han</span>
                                </h1>
                                <div className="flex justify-between items-start mt-12 border-t border-gray-100 pt-6">
                                    <span className="text-[9px] uppercase tracking-[0.18em] font-medium text-gray-400 leading-relaxed">
                                        Moly<br/>Founder
                                    </span>
                                    <span className="text-[9px] uppercase tracking-[0.18em] font-medium text-gray-900 leading-relaxed text-right">
                                        Based in<br/>Beijing
                                    </span>
                                </div>
                            </div>
                            
                            {/* Section 02 - Bio */}
                            <div className="relative mb-24 pt-6 mt-12">
                                <span className="absolute -top-12 left-0 text-[40px] text-gray-200 font-light leading-none" style={{ fontFamily: '"Cormorant Garamond", serif' }}>01</span>
                                <p className="text-[26px] leading-[1.3] text-[#111]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                                    在做一款面向商务人士的 <i className="text-gray-400 font-serif">AI 秘书产品</i>，帮助用户更自然地管理日程、联系人、会议。
                                </p>
                            </div>

                            {/* Section 03 - Topics */}
                            <div className="relative mb-24 pt-6">
                                <span className="absolute -top-12 left-0 text-[40px] text-gray-200 font-light leading-none" style={{ fontFamily: '"Cormorant Garamond", serif' }}>02</span>
                                <span className="text-[9px] uppercase tracking-[0.18em] font-medium text-gray-400 mb-8 block">Areas of Focus</span>
                                <div className="space-y-6">
                                    {profile.topics.map((t, i) => (
                                        <div key={i} className="flex flex-col border-b border-gray-100 pb-6">
                                            <span className="text-[20px] font-medium text-[#111]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                                                {t.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 04 - Details */}
                            <div className="relative mb-20 pt-6">
                                <span className="absolute -top-12 left-0 text-[40px] text-gray-200 font-light leading-none" style={{ fontFamily: '"Cormorant Garamond", serif' }}>03</span>
                                <div className="flex flex-col gap-6">
                                    <div className="grid grid-cols-[1fr_2fr] items-baseline border-b border-gray-100 pb-4">
                                        <span className="text-[9px] uppercase tracking-[0.18em] font-medium text-gray-400">Website</span>
                                        <a href="#" className="text-[22px] text-[#111] hover:text-orange-600 transition-colors" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{profile.website}</a>
                                    </div>
                                    <div className="grid grid-cols-[1fr_2fr] items-baseline border-b border-gray-100 pb-4">
                                        <span className="text-[9px] uppercase tracking-[0.18em] font-medium text-gray-400">Notice</span>
                                        <span className="text-[16px] text-gray-600 leading-snug" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{profile.hook}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <StandardBaseInfo profile={profile} theme={activeTheme} className="w-[calc(100%+48px)] -mx-6" />
                        </div>

                        {/* Floating Action Button */}
                        <div className="absolute bottom-6 right-6 z-50">
                            <div className="w-[60px] h-[60px] rounded-full border border-gray-200 bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 hover:scale-[0.96] transition-all text-gray-900 group">
                                <Plus size={24} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-300" />
                            </div>
                        </div>

                    </div>
                )}

                {/* RENDER CONCEPT 6: Watercolor (now 4) */}
                {activeTheme === 'watercolor' && (
                    <div className="relative w-full max-w-[400px] h-[850px] bg-[#F7F6F0] text-[#232321] rounded-[50px] overflow-hidden border-[8px] border-zinc-900 shadow-[0_20px_60px_-15px_rgba(230,57,53,0.15)] transition-opacity animate-fade-in flex flex-col font-sans" style={{ fontFamily: '"Jost", sans-serif' }}>
                        
                        {/* Watercolor SVG Filter Definition */}
                        <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true" focusable="false">
                            <defs>
                                <filter id="watercolor-filter" x="-20%" y="-20%" width="140%" height="140%">
                                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise"></feTurbulence>
                                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
                                </filter>
                            </defs>
                        </svg>

                        {/* Background Blobs */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-85" style={{ filter: 'url(#watercolor-filter) blur(15px)' }}>
                            <div className="absolute rounded-full mix-blend-multiply bg-[#E63935] opacity-90 w-[320px] h-[320px] -top-[10%] -left-[20%] scale-125 rotate-[15deg]"></div>
                            <div className="absolute rounded-full mix-blend-multiply bg-[#F58220] opacity-80 w-[360px] h-[280px] top-[20%] left-[10%] scale-150 -rotate-[20deg]"></div>
                            <div className="absolute rounded-full mix-blend-multiply bg-[#F3C622] opacity-70 w-[280px] h-[280px] -bottom-[10%] -right-[10%] scale-125 rotate-[45deg]"></div>
                            <div className="absolute rounded-full mix-blend-multiply bg-[#E63935] opacity-60 w-[200px] h-[200px] bottom-[10%] right-[20%]"></div>
                        </div>

                        {/* Top Controls Overlay */}
                        <div className="absolute top-0 w-full px-6 py-5 flex justify-between items-center z-40 text-[#232321]">
                            <button className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors"><ChevronLeft size={26} strokeWidth={1.5} /></button>
                            <button className="p-2 -mr-2 rounded-full hover:bg-black/5 transition-colors"><Share2 size={22} strokeWidth={1.5} /></button>
                        </div>

                        {/* Content Scroll */}
                        <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar flex flex-col pt-16 px-8 pb-32">
                            
                            {/* Header */}
                            <header className="mb-auto mt-4 flex flex-col items-start gap-1">
                                <h2 className="uppercase tracking-[0.2em] text-[13px] leading-[1.2] opacity-90 font-medium">
                                    <span className="block">Moly</span>
                                    <span className="block">AI</span>
                                </h2>
                                <div className="text-[11px] tracking-[0.1em] opacity-60 font-serif">魔力智能</div>
                            </header>

                            {/* Center Identity */}
                            <section className="mb-20 mt-32 flex flex-col gap-1">
                                <div className="flex items-baseline gap-4 mb-2">
                                    <h1 className="text-[40px] uppercase tracking-[0.05em] leading-[1] font-semibold">{profile.enName}</h1>
                                    <span className="text-[32px] font-serif font-bold text-[#232321]">{profile.name}</span>
                                </div>
                                <div className="font-serif italic text-[18px] tracking-[0.02em]">{profile.role}</div>
                            </section>

                            {/* Contact / Meta List mapped from Reference */}
                            <section className="flex flex-col items-end gap-6 mb-16">
                                
                                <div className="flex items-center justify-end gap-4 w-full group">
                                    <div className="flex flex-col items-center justify-center relative opacity-50">
                                        <span className="block w-full h-[1px] bg-[#232321] mb-0.5"></span>
                                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] px-1">LOC</span>
                                        <span className="block w-full h-[1px] bg-[#232321] mt-0.5"></span>
                                    </div>
                                    <div className="text-[15px] tracking-[0.05em] text-right w-[150px] group-hover:text-[#E63935] transition-colors">{profile.location}</div>
                                </div>
                                <div className="w-[150px] h-[1px] bg-[#232321] opacity-20 -my-2 self-end"></div>

                                <div className="flex items-center justify-end gap-4 w-full group">
                                    <div className="flex flex-col items-center justify-center relative opacity-50">
                                        <span className="block w-full h-[1px] bg-[#232321] mb-0.5"></span>
                                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] px-1">EML</span>
                                        <span className="block w-full h-[1px] bg-[#232321] mt-0.5"></span>
                                    </div>
                                    <div className="text-[14px] lowercase tracking-[0.02em] text-right w-[150px] group-hover:text-[#F58220] transition-colors">{profile.enName.toLowerCase()}@{profile.website}</div>
                                </div>
                                <div className="w-[150px] h-[1px] bg-[#232321] opacity-20 -my-2 self-end"></div>

                                <div className="flex items-center justify-end gap-4 w-full group">
                                    <div className="flex flex-col items-center justify-center relative opacity-50">
                                        <span className="block w-full h-[1px] bg-[#232321] mb-0.5"></span>
                                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] px-1">WEB</span>
                                        <span className="block w-full h-[1px] bg-[#232321] mt-0.5"></span>
                                    </div>
                                    <div className="text-[17px] font-serif font-semibold tracking-[0.02em] text-right w-[150px] group-hover:text-[#F3C622] transition-colors">{profile.website}</div>
                                </div>

                            </section>

                            <StandardBaseInfo profile={profile} theme={activeTheme} className="w-[calc(100%+64px)] -mx-8 mt-auto" />
                        </div>
                    </div>
                )}

                {/* RENDER CONCEPT 7: Vermeer (now 5) */}
                {activeTheme === 'vermeer' && (
                    <div className="relative w-full max-w-[400px] h-[850px] bg-[#151311] text-[#F7F6F0] rounded-[50px] overflow-hidden border-[8px] border-zinc-900 shadow-[0_20px_60px_-15px_rgba(21,19,17,0.5)] transition-opacity animate-fade-in flex flex-col font-serif">
                        
                        {/* The "Pearl Glow" Background Highlight */}
                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_40%,_rgba(255,255,255,0.12)_0%,_rgba(215,65,52,0.02)_40%,_transparent_70%)]"></div>
                        <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-[#D29F54] rounded-full mix-blend-screen opacity-10 blur-[80px]"></div>

                        {/* Top Controls Overlay */}
                        <div className="absolute top-0 w-full px-6 py-5 flex justify-between items-center z-40 text-[#F7F6F0]/80">
                            <button className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"><ChevronLeft size={26} strokeWidth={1.5} /></button>
                            <button className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors"><Share2 size={22} strokeWidth={1.5} /></button>
                        </div>

                        {/* Top Museum Plaque Layout */}
                        <header className="relative z-10 px-8 py-20 flex flex-col items-start gap-1 pointer-events-none">
                            <h2 className="uppercase tracking-[0.25em] text-[10px] text-[#D29F54] font-sans pb-2 border-b border-[#D29F54]/30 w-8 inline-block mb-1">EXH</h2>
                            <div className="text-[11px] tracking-[0.1em] opacity-50 font-sans uppercase">Moly Permanent Collection</div>
                        </header>

                        {/* Content Scroll */}
                        <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar flex flex-col px-8 pb-32">
                            
                            {/* Dramatic Chiaroscuro Title */}
                            <section className="mt-8 mb-24 flex flex-col gap-2">
                                <h1 className="text-[64px] leading-[0.9] font-medium tracking-tight">
                                    <span className="block text-[#F3CD89] drop-shadow-[0_2px_10px_rgba(243,205,137,0.2)]">{profile.enName.split(' ')[0]}</span>
                                    <span className="block text-[#6B8DAF] drop-shadow-[0_2px_10px_rgba(107,141,175,0.2)]">{profile.enName.split(' ')[1] || profile.name}</span>
                                </h1>
                                <div className="mt-6 border-l w-max border-[#D74134] pl-5 flex flex-col gap-1.5">
                                    <div className="text-[15px] italic opacity-80">{profile.role}</div>
                                    <div className="text-[11px] font-sans tracking-[0.1em] text-[#D29F54] uppercase opacity-70">{profile.company}</div>
                                </div>
                            </section>

                            {/* Minimalist Data Structure */}
                            <section className="flex flex-col gap-6 mb-16 pl-1 pr-4">
                                <div className="flex justify-between items-end border-b border-white/10 pb-3">
                                    <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#D29F54]">Origin</span>
                                    <span className="text-[14px] italic opacity-90">{profile.location}</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/10 pb-3">
                                    <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#D29F54]">Contact</span>
                                    <span className="text-[14px] italic opacity-90">{profile.enName.toLowerCase().replace(' ', '')}@{profile.website}</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/10 pb-3">
                                    <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#D29F54]">Web</span>
                                    <span className="text-[15px] italic opacity-100 text-[#F3CD89] hover:underline underline-offset-4 pointer-events-auto cursor-pointer">{profile.website}</span>
                                </div>
                            </section>

                            <StandardBaseInfo profile={profile} theme={activeTheme} className="w-[calc(100%+64px)] -mx-8 mt-auto" />
                        </div>
                        
                        {/* Red "Seal" Floating Button */}
                        <div className="absolute bottom-6 right-6 z-50">
                            <div className="w-[54px] h-[54px] rounded-full bg-[#D74134] shadow-[0_5px_15px_rgba(215,65,52,0.4)] flex items-center justify-center cursor-pointer hover:scale-[1.05] transition-all text-white group">
                                <Plus size={24} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-300" />
                            </div>
                        </div>

                    </div>
                )}

                {/* RENDER CONCEPT 6: Monogram Red */}
                {activeTheme === 'monoRed' && (
                    <div className="relative w-full max-w-[400px] h-[850px] bg-[#D8281B] text-white rounded-[50px] overflow-hidden border-[8px] border-red-950 shadow-[0_20px_60px_-10px_rgba(216,40,27,0.6)] transition-opacity animate-fade-in flex flex-col" style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {/* Top Controls */}
                        <div className="absolute top-0 w-full px-6 py-5 flex justify-between items-center z-40 text-white">
                            <button className="p-2 -ml-2 hover:opacity-70 transition-opacity"><ChevronLeft strokeWidth={1.5} size={28} /></button>
                            <button className="p-2 -mr-2 hover:opacity-70 transition-opacity"><Share2 strokeWidth={1.5} size={22} /></button>
                        </div>
                        {/* Scrollable Content */}
                        <div className="absolute inset-0 overflow-y-auto no-scrollbar pb-[120px] pt-20 z-10 flex flex-col">
                            {/* Profile Section */}
                            <div className="flex flex-col items-center pt-10 px-6 pb-10 text-center">
                                <div className="w-[72px] h-[72px] border-2 border-white flex items-center justify-center mb-8 shrink-0">
                                    <span className="font-black text-[28px] uppercase tracking-tight text-white leading-none">DH</span>
                                </div>
                                <h1 className="font-black uppercase leading-[0.88] text-white mb-6 break-words w-full" style={{ fontSize: 'clamp(48px, 15vw, 76px)', letterSpacing: '-0.04em' }}>
                                    {profile.enName.toUpperCase()}
                                </h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/75 mb-1">{profile.role}</p>
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white">{profile.company}</p>
                            </div>
                            {/* Divider */}
                            <div className="h-[1px] bg-white/30 mx-6 mb-8" />
                            {/* Bio Quote */}
                            <div className="px-6 mb-8">
                                <p className="text-center text-[19px] leading-[1.35] text-white" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, serif' }}>
                                    "{profile.mission}"
                                </p>
                            </div>
                            {/* Contact List */}
                            <div className="px-6 flex flex-col">
                                <div className="flex items-center py-3 gap-4">
                                    <div className="w-[44px] h-[44px] border border-white/30 flex items-center justify-center shrink-0">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/60 mb-0.5">Mobile</span>
                                        <span className="text-[18px] text-white" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, serif' }}>+86 138 0000 0000</span>
                                    </div>
                                </div>
                                <div className="flex items-center py-3 gap-4">
                                    <div className="w-[44px] h-[44px] border border-white/30 flex items-center justify-center shrink-0">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/60 mb-0.5">Email</span>
                                        <span className="text-[18px] text-white" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, serif' }}>{profile.enName.toLowerCase()}@{profile.website}</span>
                                    </div>
                                </div>
                                <div className="flex items-center py-3 gap-4">
                                    <div className="w-[44px] h-[44px] border border-white/30 flex items-center justify-center shrink-0">
                                        <Globe size={20} strokeWidth={1.5} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/60 mb-0.5">Website</span>
                                        <span className="text-[18px] text-white" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, serif' }}>{profile.website}</span>
                                    </div>
                                </div>
                                <div className="flex items-center py-3 gap-4">
                                    <div className="w-[44px] h-[44px] border border-white/30 flex items-center justify-center shrink-0">
                                        <MessageSquare size={20} strokeWidth={1.5} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/60 mb-0.5">WeChat</span>
                                        <span className="text-[18px] text-white" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, serif' }}>{profile.enName.toLowerCase()}_moly</span>
                                    </div>
                                </div>
                            </div>
                            <StandardBaseInfo profile={profile} theme={activeTheme} className="w-full mt-8" />
                        </div>
                        {/* Fixed Action Bar */}
                        <div className="absolute bottom-0 left-0 w-full z-40">
                            <div className="h-12 bg-gradient-to-t from-[#D8281B] to-transparent w-full pointer-events-none" />
                            <div className="px-6 pb-8 pt-2 bg-[#D8281B] flex items-center gap-3">
                                <button className="w-[56px] h-[56px] border-2 border-white flex items-center justify-center text-white shrink-0 hover:bg-white/10 transition-colors active:scale-95">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                                    </svg>
                                </button>
                                <button className="flex-1 h-[56px] bg-white text-[#D8281B] font-black text-[15px] uppercase tracking-[0.05em] flex items-center justify-center gap-2 hover:bg-white/90 transition-colors active:scale-[0.98]">
                                    储存联系人 <Plus size={18} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DigitalCard07Demo;
