import React, { useState } from 'react';
import { ChevronLeft, Share2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
    HeroBase, HeroMetal, HeroWood, HeroWater, HeroFire, HeroEarth, 
    StandardBaseInfo, ProfileContext 
} from './DigitalCard08Themes';

export const FiveElementsDemoShell = ({ profileData, title, backUrl, backText }: any) => {
    const navigate = useNavigate();
    const [activeTheme, setActiveTheme] = useState<'base' | 'metal' | 'wood' | 'water' | 'fire' | 'earth'>('base');

    const renderHero = () => {
        switch (activeTheme) {
            case 'metal': return <HeroMetal />;
            case 'wood': return <HeroWood />;
            case 'water': return <HeroWater />;
            case 'fire': return <HeroFire />;
            case 'earth': return <HeroEarth />;
            case 'base':
            default: return <HeroBase />;
        }
    };

    const containerStyle = () => {
        switch (activeTheme) {
            case 'metal': return "bg-[#EDE8DF] border-[8px] border-[#B8933A]/40 rounded-[40px] shadow-[0_0_40px_rgba(184,147,58,0.15)] overflow-hidden";
            case 'fire': return "bg-[#F7F5EF] border-[8px] border-[#E63935]/20 rounded-[40px] shadow-2xl overflow-hidden";
            case 'earth': return "bg-white border-[8px] border-gray-200 rounded-[40px] shadow-2xl overflow-hidden";
            case 'water': return "bg-[#1D4ED8] border-[8px] border-[#1E293B] rounded-[40px] shadow-2xl overflow-hidden";
            case 'wood': return "bg-[#2D6A4F] border-[8px] border-[#1B4332] rounded-[40px] shadow-2xl overflow-hidden";
            case 'base': 
            default: return "bg-gray-100 border-[8px] border-white rounded-[40px] shadow-2xl overflow-hidden";
        }
    };

    return (
        <ProfileContext.Provider value={profileData}>
            <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
                {/* Sidebar Controls */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-20">
                    <div className="p-6 border-b border-gray-100 bg-white sticky top-0">
                        <button onClick={() => navigate(backUrl)} className="mb-4 flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
                            <ChevronLeft size={16} className="-ml-1" /> {backText}
                        </button>
                        <h2 className="text-xl font-black text-gray-900 md:tracking-tight">{title}</h2>
                        <p className="text-[13px] text-gray-500 mt-2 font-medium leading-relaxed">
                            五行名片架构预览。在此确认不同主题下的名片渲染效果。
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {([
                            { id: 'base', name: '基础版 (Base)', desc: '干净、现代的首屏布局' },
                            { id: 'metal', name: '金 (Metal)', desc: '锋利网格体系与极简大字' },
                            { id: 'wood', name: '木 (Wood)', desc: '自然色块堆叠与柔和圆角' },
                            { id: 'water', name: '水 (Water)', desc: '深蓝渐变、无卡片文字流排版' },
                            { id: 'fire', name: '火 (Fire)', desc: '高饱和对比、倾斜张力构图' },
                            { id: 'earth', name: '土 (Earth)', desc: '稳定砖块感与厚重图文组' }
                        ] as const).map((t) => {
                            const isActive = activeTheme === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTheme(t.id as any)}
                                    className={`w-full text-left p-4 rounded-2xl transition-all border ${isActive ? 'bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-500/50' : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`block text-[15px] font-bold ${isActive ? 'text-indigo-900' : 'text-gray-900'}`}>
                                            {t.name}
                                        </span>
                                        {isActive && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                                    </div>
                                    <span className={`block text-[12px] leading-relaxed ${isActive ? 'text-indigo-700/80' : 'text-gray-500'}`}>
                                        {t.desc}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area - Preview Mockup */}
                <div className="flex-1 flex justify-center items-center overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 p-8 relative">
                    
                    {/* Device Container */}
                    <div className={`relative w-full max-w-[400px] h-[850px] transition-all duration-500 flex flex-col ${containerStyle()}`}>
                        
                        {/* Header Controls (Overlay) */}
                        <div className="absolute top-0 w-full px-5 z-50 flex justify-end items-center gap-2 pointer-events-none" style={{ paddingTop: 14 }}>
                            <button className="pointer-events-auto p-2 rounded-full hover:opacity-100 transition-opacity"
                                    style={{ opacity: 0.65, color: activeTheme === 'water' || activeTheme === 'wood' ? 'white' : activeTheme === 'metal' ? '#B8933A' : '#232321' }}>
                                <Edit2 size={18} strokeWidth={1.5} />
                            </button>
                            <button className="pointer-events-auto p-2 rounded-full hover:opacity-100 transition-opacity"
                                    style={{ opacity: 0.65, color: activeTheme === 'water' || activeTheme === 'wood' ? 'white' : activeTheme === 'metal' ? '#B8933A' : '#232321' }}>
                                <Share2 size={18} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Scrollable Container (Dual-Layer: Hero -> Base Info) */}
                        <div className="flex-1 overflow-y-auto no-scrollbar relative w-full h-full text-white">
                            
                            {/* Universal Dot Grid Overlay (Water Theme) */}
                            {activeTheme === 'water' && (
                                <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.25]" 
                                     style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 1.5px, transparent 1.5px)', backgroundSize: '16px 16px', backgroundPosition: 'center top' }}>
                                </div>
                            )}

                            {/* Layer 1: Art/Identity Hero */}
                            <div className="w-full min-h-screen relative z-10 transition-opacity duration-300">
                                 {renderHero()}
                            </div>

                            {/* Layer 2: Rational Data Base Info */}
                            <div className="w-full relative z-20 transition-transform duration-500">
                                <StandardBaseInfo theme={activeTheme} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </ProfileContext.Provider>
    );
};
