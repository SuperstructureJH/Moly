import React, { useState } from 'react';
import { ChevronLeft, Share2, MapPin, Briefcase, Plus, ArrowUpRight, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const ProfileContext = React.createContext<any>(null);


// ======= 1. Data Model =======

// Default interface and styles imported below
// Profile Data is passed down to components as a prop.

// ======= 2. Theme-Specific Bottom Layers =======

// Mathematical animated waves component
const AnimatedWaves = () => {
    const svgRef = React.useRef(null);

    React.useEffect(() => {
        let animationFrameId;
        let time = 0;

        const draw = () => {
            time += 0.006; // Base speed of time (0.5x original)

            if (!svgRef.current) return;
            const width = 1200; // SVG internal coordinate width
            const height = 120; // SVG internal coordinate height

            // Back Wave: Longer period (smaller frequency), lower amplitude, moving left
            const wave1 = {
                amplitude: 15,
                frequency: 0.003, // Period = ~2094
                speed: 1.0,
                offset: time * 1.0,
                baseY: 65
            };

            // Front Wave: Shorter period (larger freq), slightly higher amplitude, moving right
            const wave2 = {
                amplitude: 18,
                frequency: 0.005, // Period = ~1256
                speed: 1.5,
                offset: -time * 1.5,
                baseY: 80
            };

            const generatePath = (w) => {
                let d = `M 0,${height}`; // Start at bottom left
                
                // Construct the sine wave
                for (let x = 0; x <= width + 10; x += 10) {
                    const y = w.baseY + Math.sin(x * w.frequency + w.offset) * w.amplitude;
                    d += ` L ${x},${y}`;
                }
                
                d += ` L ${width},${height} Z`; // Down to bottom right and close path
                return d;
            };

            const path1 = svgRef.current.querySelector('#wave-back');
            const path2 = svgRef.current.querySelector('#wave-front');

            if (path1) path1.setAttribute('d', generatePath(wave1));
            if (path2) path2.setAttribute('d', generatePath(wave2));

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0 transform translate-y-[2px]">
            <svg 
                ref={svgRef} 
                viewBox="0 0 1200 120" 
                preserveAspectRatio="none" 
                className="w-full h-[120px]"
            >
                <path id="wave-back" fill="#2563EB" opacity="1" />
                <path id="wave-front" fill="#3B82F6" opacity="1" />
            </svg>
        </div>
    );
};

export const BaseInfoWater = () => {
    const profileData = React.useContext(ProfileContext);
    return (
        <div className="relative z-20 font-sans min-h-screen px-6 pt-6 pb-32 flex flex-col items-start bg-transparent -mt-[1px]">

            {/* Lighter Blue Background */}
            <div className="absolute inset-0 bg-[#3B82F6] -z-20"></div>

            <div className="w-full space-y-10 relative z-10 text-white">

                {/* Position & Company */}
                <div>
                    <h3 className="text-[12px] font-black uppercase tracking-widest opacity-60 mb-5 text-blue-100">// IDENTITY.PROFILE</h3>
                    <div className="space-y-3">
                        <div className="flex items-baseline gap-3 border-b border-white/20 pb-3">
                            <span className="text-[11px] font-mono opacity-60 text-blue-100 w-8">[01]</span>
                            <span className="text-[15px] tracking-wide">{profileData.baseInfo.position} — {profileData.baseInfo.company}</span>
                        </div>
                        <div className="flex items-baseline gap-3 border-b border-white/20 pb-3">
                            <span className="text-[11px] font-mono opacity-60 text-blue-100 w-8">[02]</span>
                            <span className="text-[15px] tracking-wide">{profileData.baseInfo.address}</span>
                        </div>
                        <div className="flex items-baseline gap-3 border-b border-white/20 pb-3">
                            <span className="text-[11px] font-mono opacity-60 text-blue-100 w-8">[03]</span>
                            <span className="text-[14px] tracking-wide opacity-80">{profileData.baseInfo.industry}</span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <h3 className="text-[12px] font-black uppercase tracking-widest opacity-60 mb-5 text-blue-100">// BIO.NOTES</h3>
                    <p className="text-[14px] leading-relaxed opacity-80 border-l-2 border-blue-400 pl-4">
                        {profileData.baseInfo.notes}
                    </p>
                </div>

                {/* Footer Signature */}
                <div className="w-full text-center pt-8 pb-4 opacity-50 font-bold text-[10px] tracking-widest uppercase text-blue-100 flex items-center justify-center gap-2">
                    <span className="w-6 h-[1px] bg-blue-100 opacity-50"></span>
                    Designed by Moly
                    <span className="w-6 h-[1px] bg-blue-100 opacity-50"></span>
                </div>

            </div>

            {/* Bottom Action */}
            <div className="absolute bottom-0 left-0 w-full p-6 pt-28 bg-gradient-to-t from-[#3B82F6] via-[#3B82F6]/95 to-transparent pointer-events-none z-50">
                <button className="w-full py-5 bg-white text-[#2563EB] font-black text-[14px] uppercase tracking-[0.2em] rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:scale-[1.02] transition-transform pointer-events-auto flex justify-center gap-3 items-center px-6">
                    <span>[ SYS.CONNECT ]</span>
                    <Plus size={20} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};


// ======= Default Bottom Layer =======

export const StandardBaseInfo = ({ theme }: { theme: string }) => {
    const profileData = React.useContext(ProfileContext);
    if (theme === 'water') {
        return <BaseInfoWater />;
    }
    if (theme === 'metal') {
        return <BaseInfoMetal />;
    }
    if (theme === 'fire') {
        return <BaseInfoFire />;
    }
    if (theme === 'earth') {
        return null; // HeroEarth is self-contained with sections 01–03
    }

    return (
        <div className="bg-white text-gray-900 rounded-t-[40px] px-6 pt-10 pb-32 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] min-h-screen">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>

            <h3 className="text-xl font-black mb-8">基础信息</h3>

            {/* Position & Company */}
            <div className="mb-6 flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="p-2 bg-white rounded-xl shadow-sm"><Briefcase size={20} className="text-indigo-600" /></div>
                <div>
                    <h4 className="text-[15px] font-bold text-gray-900">{profileData.baseInfo.position}</h4>
                    <p className="text-[13px] text-gray-500 mt-1">{profileData.baseInfo.company}</p>
                </div>
            </div>

            {/* Address */}
            <div className="mb-6 flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="p-2 bg-white rounded-xl shadow-sm"><MapPin size={20} className="text-indigo-600" /></div>
                <div>
                    <h4 className="text-[15px] font-bold text-gray-900">{profileData.baseInfo.address}</h4>
                </div>
            </div>

            {/* Industry Tag */}
            <div className="mb-8">
                <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3">Industry</h4>
                <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-[12px] font-medium rounded-lg">
                    {profileData.baseInfo.industry}
                </span>
            </div>

            {/* Notes */}
            <div className="mb-8">
                <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3">About</h4>
                <p className="text-[14px] text-gray-700 leading-relaxed bg-[#F8F9FA] p-5 rounded-2xl border-l-[3px] border-indigo-500">
                    {profileData.baseInfo.notes}
                </p>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 pt-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-50">
                <button className="w-full py-4 bg-black text-white font-bold text-[15px] rounded-2xl shadow-lg hover:scale-[0.98] transition-all pointer-events-auto">
                    保存名片
                </button>
            </div>
        </div>
    );
};

// ======= 3. Top Layer Variations (Hero) =======

// 1. Base (Clean, Standard Layout)
export const HeroBase = () => {
    const profileData = React.useContext(ProfileContext);
    return (
    <div className="h-screen w-full relative flex flex-col pt-32 px-6 bg-white overflow-hidden shrink-0">
        <h1 className="text-5xl font-black text-gray-900 mb-2 leading-tight">
            {profileData.enName} <span className="text-2xl font-medium text-gray-400">{profileData.name}</span>
        </h1>
        <p className="text-xl text-indigo-600 font-medium leading-relaxed mb-10 max-w-[85%]">
            {profileData.headline}
        </p>
        
        <div className="mt-auto mb-12 flex flex-col gap-4">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Our Intersection</h3>
            
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <span className="text-[11px] font-bold text-indigo-500 uppercase flex items-center gap-1 mb-1">✦ Match</span>
                <p className="text-[13px] text-gray-800 font-medium leading-snug">{profileData.intersections.common}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <span className="text-[11px] font-bold text-gray-500 uppercase mb-2 block">Suggested Topics</span>
                <div className="flex flex-wrap gap-2">
                    {profileData.intersections.topics.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 bg-white border border-gray-200 text-gray-600 text-[12px] rounded-lg shadow-sm">{t}</span>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
};

// 2. Metal (Aura Wealth style: dark charcoal + white body + gold labels/accents)
export const HeroMetal = () => {
    const profileData = React.useContext(ProfileContext);
    const [tick, setTick] = React.useState(0);
    React.useEffect(() => {
        const id = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(id);
    }, []);
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');

    const gold = '#B8933A';
    const cream = '#EEEBE3';
    const ink = '#1C1A16';
    const inkMuted = 'rgba(28,26,22,0.5)';
    const cardBorder = '1px solid rgba(184,147,58,0.20)';

    return (
        <div className="min-h-screen w-full relative flex flex-col overflow-hidden shrink-0"
             style={{ background: cream, fontFamily: "'Georgia', 'Times New Roman', serif" }}>

            {/* Faint warm grid texture */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(160,130,80,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(160,130,80,0.055) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }} />

            {/* Top gold hairline */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: gold }} />

            {/* Nav bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between z-20"
                 style={{ height: 52, padding: '0 20px', borderBottom: cardBorder }}>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 flex items-center justify-center"
                         style={{ border: `1px solid ${gold}` }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: gold, fontFamily: 'Inter,sans-serif', letterSpacing: '0.05em' }}>JH</span>
                    </div>
                    <span style={{ fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: ink, fontFamily: 'Inter,sans-serif', fontWeight: 500 }}>
                        {profileData.enName}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span style={{ fontSize: 9, letterSpacing: '0.18em', color: inkMuted, fontFamily: 'Inter,sans-serif', textTransform: 'uppercase' }}>
                        {hh}:{mm}
                    </span>
                    <div style={{ padding: '3px 9px', background: gold }}>
                        <span style={{ fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: cream, fontFamily: 'Inter,sans-serif', fontWeight: 700 }}>AUREUM</span>
                    </div>
                </div>
            </div>

            {/* Main content — card grid */}
            <div className="relative z-10 flex flex-col"
                 style={{ paddingTop: 64, paddingBottom: 28, paddingLeft: 16, paddingRight: 16, minHeight: '100vh', gap: 10 }}>

                {/* Main identity card */}
                <div style={{ border: cardBorder, background: 'rgba(255,255,255,0.48)', padding: '20px 20px 18px' }}>
                    <p style={{ fontSize: 8, letterSpacing: '0.38em', textTransform: 'uppercase', color: gold, fontFamily: 'Inter,sans-serif', marginBottom: 12 }}>
                        Selected Profile
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10, flexWrap: 'nowrap' }}>
                        <h1 style={{ fontSize: 44, fontWeight: 400, lineHeight: 0.9, color: ink, letterSpacing: '-0.02em', margin: 0, whiteSpace: 'nowrap' }}>
                            {profileData.enName}
                        </h1>
                        <span style={{ fontSize: 17, color: ink, opacity: 0.5, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                            {profileData.name}
                        </span>
                    </div>
                    <div style={{ height: 1, background: gold, opacity: 0.45, marginBottom: 12 }} />
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: ink, opacity: 0.72, margin: 0, fontStyle: 'italic' }}>
                        {profileData.headline}
                    </p>
                </div>

                {/* Two-column grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>

                    {/* Profile card */}
                    <div style={{ border: cardBorder, background: 'rgba(255,255,255,0.35)', padding: '16px 14px' }}>
                        <p style={{ fontSize: 8, letterSpacing: '0.35em', textTransform: 'uppercase', color: gold, fontFamily: 'Inter,sans-serif', marginBottom: 10 }}>
                            Profile
                        </p>
                        <div style={{ height: 1.5, background: gold, width: 20, marginBottom: 12 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {[
                                profileData.baseInfo.position,
                                profileData.baseInfo.company,
                                profileData.baseInfo.address,
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, paddingBottom: 8, paddingTop: i > 0 ? 8 : 0, borderBottom: '1px solid rgba(184,147,58,0.14)' }}>
                                    <span style={{ color: gold, fontSize: 8, marginTop: 3, flexShrink: 0 }}>✦</span>
                                    <span style={{ fontSize: 11, color: ink, opacity: 0.72, lineHeight: 1.45, fontFamily: 'Inter,sans-serif' }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Areas of Focus card */}
                    <div style={{ border: cardBorder, background: 'rgba(255,255,255,0.35)', padding: '16px 14px' }}>
                        <p style={{ fontSize: 8, letterSpacing: '0.35em', textTransform: 'uppercase', color: gold, fontFamily: 'Inter,sans-serif', marginBottom: 10 }}>
                            Areas of Focus
                        </p>
                        <div style={{ height: 1.5, background: gold, width: 20, marginBottom: 12 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {profileData.intersections.topics.map((t, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, paddingBottom: 8, paddingTop: i > 0 ? 8 : 0, borderBottom: '1px solid rgba(184,147,58,0.14)' }}>
                                    <span style={{ color: gold, fontSize: 8, marginTop: 3, flexShrink: 0 }}>✦</span>
                                    <span style={{ fontSize: 11, color: ink, opacity: 0.72, lineHeight: 1.45, fontFamily: 'Inter,sans-serif' }}>{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mutual Coordinates card */}
                <div style={{ border: cardBorder, background: 'rgba(255,255,255,0.30)', padding: '16px 18px' }}>
                    <p style={{ fontSize: 8, letterSpacing: '0.38em', textTransform: 'uppercase', color: gold, fontFamily: 'Inter,sans-serif', marginBottom: 8 }}>
                        Mutual Coordinates
                    </p>
                    <p style={{ fontSize: 12, lineHeight: 1.75, color: ink, opacity: 0.60, margin: 0, fontFamily: 'Inter,sans-serif' }}>
                        {profileData.intersections.common}
                    </p>
                </div>

                {/* Bottom strip */}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
                    <span style={{ fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: inkMuted, fontFamily: 'Inter,sans-serif' }}>Moly · Beijing</span>
                    <span style={{ fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: inkMuted, fontFamily: 'Inter,sans-serif' }}>Scroll ↓</span>
                </div>

            </div>
        </div>
    );
};



export const BaseInfoMetal = () => {
    const profileData = React.useContext(ProfileContext);
    return (
        <div className="relative font-sans min-h-screen px-6 pt-8 pb-32 flex flex-col"
             style={{ fontFamily: "'Georgia', serif", background: 'linear-gradient(180deg, #120F05 0%, #0D0B04 100%)' }}>
            {/* Gold grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(201,169,110,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.10) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }} />
            {/* Warm glow top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] pointer-events-none"
                 style={{ background: 'radial-gradient(ellipse, rgba(201,169,110,0.12) 0%, transparent 70%)' }} />

            <div className="relative z-10 space-y-10">

                {/* Identity info */}
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-[1px] w-5 bg-[#C9A96E]" />
                        <h3 className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#C9A96E]">Identity</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-baseline gap-3 border-b pb-3" style={{ borderColor: 'rgba(201,169,110,0.25)' }}>
                            <span className="text-[10px] font-mono" style={{ color: 'rgba(201,169,110,0.5)' }}>01</span>
                            <span className="text-[14px] tracking-wide" style={{ color: 'rgba(201,169,110,0.85)' }}>{profileData.baseInfo.position} — {profileData.baseInfo.company}</span>
                        </div>
                        <div className="flex items-baseline gap-3 border-b pb-3" style={{ borderColor: 'rgba(201,169,110,0.25)' }}>
                            <span className="text-[10px] font-mono" style={{ color: 'rgba(201,169,110,0.5)' }}>02</span>
                            <span className="text-[14px] tracking-wide" style={{ color: 'rgba(201,169,110,0.85)' }}>{profileData.baseInfo.address}</span>
                        </div>
                        <div className="flex items-baseline gap-3 border-b pb-3" style={{ borderColor: 'rgba(201,169,110,0.25)' }}>
                            <span className="text-[10px] font-mono" style={{ color: 'rgba(201,169,110,0.5)' }}>03</span>
                            <span className="text-[13px] tracking-wide" style={{ color: 'rgba(201,169,110,0.65)' }}>{profileData.baseInfo.industry}</span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-[1px] w-5 bg-[#C9A96E]" />
                        <h3 className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#C9A96E]">About</h3>
                    </div>
                    <p className="text-[13px] leading-relaxed font-sans" style={{ color: 'rgba(201,169,110,0.65)', borderLeft: '2px solid rgba(201,169,110,0.4)', paddingLeft: '1rem' }}>
                        {profileData.baseInfo.notes}
                    </p>
                </div>

                {/* Footer Signature */}
                <div className="w-full text-center pt-8 pb-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-[1px] w-12 bg-[#C9A96E]/40" />
                        <span className="text-[8px] tracking-[0.4em] uppercase font-bold text-[#C9A96E]/50">Moly ✦ 2026</span>
                        <div className="h-[1px] w-12 bg-[#C9A96E]/40" />
                    </div>
                </div>
            </div>

            {/* Bottom Action */}
            <div className="absolute bottom-0 left-0 w-full p-6 pt-24 pointer-events-none z-50"
                 style={{ background: 'linear-gradient(to top, #0D0B04 60%, transparent)' }}>
                <button className="w-full py-4 font-bold text-[13px] uppercase tracking-[0.25em] active:scale-[0.98] transition-all pointer-events-auto flex justify-center gap-3 items-center"
                        style={{ background: '#C9A96E', color: '#080600', boxShadow: '0 10px 40px rgba(201,169,110,0.35)' }}>
                    <div className="w-1.5 h-1.5 rotate-45" style={{ background: '#080600' }} />
                    <span>Establish Connection</span>
                    <div className="w-1.5 h-1.5 rotate-45" style={{ background: '#080600' }} />
                </button>
            </div>
        </div>
    );
};


// 3. Wood — flat bold mobile (design-d9894cc7 structure)
export const HeroWood = () => {
    const profileData = React.useContext(ProfileContext);
    return (
    <div className="min-h-screen w-full flex flex-col bg-[#2D6A4F] text-white overflow-hidden shrink-0"
         style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>

        {/* Monogram header — centered like design-d9894cc7 */}
        <div className="flex flex-col items-center pt-16 pb-0">
            <div className="w-16 h-16 border-2 border-white flex items-center justify-center mb-8">
                <span className="text-[26px] font-black uppercase tracking-tight">
                    {profileData.enName[0]}
                </span>
            </div>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase opacity-60 mb-1">
                {profileData.baseInfo.position}
            </p>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {profileData.baseInfo.company}
            </p>
        </div>

        {/* Big name — same scale as design's clamp(48px, 15vw, 76px) */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <h1 className="font-black uppercase tracking-[-0.04em] leading-[0.9] text-white mb-5"
                style={{ fontSize: 'clamp(56px, 18vw, 80px)', wordBreak: 'break-word' }}>
                {profileData.enName}
            </h1>
            <p className="text-[17px] font-normal opacity-70 leading-relaxed max-w-[80%]" style={{ fontStyle: 'italic' }}>
                {profileData.headline}
            </p>
        </div>

        {/* Divider */}
        <div className="mx-6" style={{ height: 1, background: 'rgba(255,255,255,0.2)' }} />

        {/* Intersection section */}
        <div className="px-6 py-8">
            <p className="text-[9px] font-bold tracking-[0.18em] uppercase opacity-50 mb-4">Mutual Coordinates</p>
            <p className="text-[14px] leading-relaxed opacity-80 mb-5">{profileData.intersections.common}</p>
            <div className="flex flex-col gap-2">
                {profileData.intersections.topics.map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-4 h-[1px]" style={{ background: 'rgba(255,255,255,0.4)' }} />
                        <span className="text-[13px] font-medium opacity-75">{t}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Bottom action — fixed bar like design-d9894cc7 */}
        <div className="px-6 pb-8 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            <button className="w-full py-4 font-black text-[14px] uppercase tracking-[0.1em] text-[#2D6A4F] bg-white active:scale-[0.97] transition-transform">
                Connect
            </button>
        </div>
    </div>
);
};

// 4. Water (Entity style + animated waves)
export const HeroWater = () => {
    const profileData = React.useContext(ProfileContext);
    return (
    <div className="min-h-screen w-full relative flex flex-col pt-20 px-6 pb-48 bg-transparent text-white shrink-0">
        {/* Background Base Color */}
        <div className="absolute inset-0 bg-[#1D4ED8] -z-20"></div>

        <div className="flex justify-between items-start mb-16 z-10">
            <div className="w-[50px] h-[50px] rounded-full border-[1.5px] border-white flex items-center justify-center font-bold italic text-[22px]">
                {profileData.enName[0].toUpperCase()}
            </div>
            <div className="text-right text-[12px] font-bold leading-none tracking-tight">
                Id — <br/>Entity <br/>004
            </div>
        </div>
        
        <div className="text-[10px] font-black tracking-widest uppercase mb-16 z-10 opacity-90 text-blue-100">
            CURRENT — ACTIVE
        </div>

        <h1 className="text-[80px] font-black leading-[0.85] tracking-tighter mb-12 z-10 whitespace-nowrap relative">
            {profileData.enName}<br/>
            <span className="text-[36px] tracking-tight font-normal opacity-60">{profileData.name}</span>
            {/* Subtle glow behind text */}
            <div className="absolute top-1/2 left-0 w-full h-full bg-[#111ae6] rounded-full blur-[60px] opacity-30 -z-10 -translate-y-1/2"></div>
        </h1>

        <div className="z-10 mt-4 space-y-10 border-l-[3px] border-[#3B82F6] pl-6 flex-1">
            
            {/* Mission / Headline */}
            <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3 text-blue-200">// SYS.MISSION</h3>
                <p className="text-[16px] font-black leading-relaxed text-white">
                    {profileData.headline}
                </p>
            </div>
            
            {/* Topics / Intersections */}
            <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4 text-blue-200">// PARAMS.TOPICS</h3>
                <div className="space-y-4">
                    {profileData.intersections.topics.map((t, i) => (
                        <div key={i} className={`font-bold flex items-baseline ${i === 0 ? 'text-white opacity-100' : 'text-blue-100 opacity-80 text-[13px]'}`}>
                            <span className="font-mono text-[10px] opacity-60 inline-block w-8 shrink-0">[{String(i+1).padStart(2, '0')}]</span>
                            <span className={`${i === 0 ? 'text-[15px] tracking-wide' : 'text-[14px]'}`}>{t}</span>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>

        {/* Spacer to guarantee wave visibility under constraints */}
        <div className="mt-auto"></div>

        {/* Dual Mathematical Sine Wave Transition */}
        <AnimatedWaves />

    </div>
);
};

// 5. Fire — watercolor blob style (design-b64cf791 / Card07 watercolor theme)
export const HeroFire = () => {
    const profileData = React.useContext(ProfileContext);
    return (
    <div className="min-h-screen w-full relative flex flex-col overflow-hidden shrink-0"
         style={{ background: '#F7F6F0', fontFamily: "'Jost', 'Inter', sans-serif", color: '#232321' }}>

        {/* Watercolor SVG filter */}
        <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
            <defs>
                <filter id="wc-fire" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </defs>
        </svg>

        {/* Blob background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-85"
             style={{ filter: 'url(#wc-fire) blur(15px)' }}>
            <div className="absolute rounded-full mix-blend-multiply bg-[#E63935] opacity-90 w-[320px] h-[320px] -top-[10%] -left-[20%] scale-125 rotate-[15deg]"></div>
            <div className="absolute rounded-full mix-blend-multiply bg-[#F58220] opacity-80 w-[360px] h-[280px] top-[20%] left-[10%] scale-150 -rotate-[20deg]"></div>
            <div className="absolute rounded-full mix-blend-multiply bg-[#F3C622] opacity-70 w-[280px] h-[280px] -bottom-[10%] -right-[10%] scale-125 rotate-[45deg]"></div>
            <div className="absolute rounded-full mix-blend-multiply bg-[#E63935] opacity-60 w-[200px] h-[200px] bottom-[10%] right-[20%]"></div>
        </div>

        {/* Card layout */}
        <div className="relative z-10 flex flex-col" style={{ padding: '4rem 1.75rem 2.5rem', minHeight: '100vh' }}>

            {/* Header */}
            <header className="mb-auto mt-4">
                <h2 style={{ fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.85rem', lineHeight: 1.2, marginBottom: '0.4rem' }}>
                    <span style={{ display: 'block' }}>Moly</span>
                    <span style={{ display: 'block' }}>Memo</span>
                </h2>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'rgba(35,35,33,0.65)', fontFamily: "'Noto Serif SC', Georgia, serif" }}>
                    面向商务人士的 AI 秘书
                </div>
            </header>

            {/* Identity — pushed to middle */}
            <section style={{ marginTop: 'auto', marginBottom: '3rem' }}>
                <div className="flex items-baseline gap-3 mb-2" style={{ flexWrap: 'nowrap' }}>
                    <h1 style={{ fontWeight: 500, fontSize: '2.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1, whiteSpace: 'nowrap' }}>
                        {profileData.enName}
                    </h1>
                    <span style={{ fontFamily: "Georgia, serif", fontWeight: 600, fontSize: '1.6rem', lineHeight: 1, whiteSpace: 'nowrap' }}>
                        {profileData.name}
                    </span>
                </div>
                <div style={{ fontFamily: "Georgia, serif", fontStyle: 'italic', fontSize: '1.1rem', letterSpacing: '0.02em', marginBottom: '0.6rem', opacity: 0.85 }}>
                    {profileData.headline}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(35,35,33,0.65)', lineHeight: 1.6 }}>
                    {profileData.intersections.common}
                </div>
            </section>

            {/* Topic list — right-aligned with sandwiched label */}
            <section className="flex flex-col items-end" style={{ gap: '1.4rem', paddingBottom: '2rem' }}>
                {profileData.intersections.topics.map((t, i) => (
                    <div key={i} className="flex items-center justify-end group" style={{ gap: '0.9rem', width: '100%' }}>
                        <div className="flex flex-col items-center" style={{ position: 'relative' }}>
                            <span className="block" style={{ width: '100%', height: 1, background: '#232321', opacity: 0.5, marginBottom: 2 }} />
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '0 4px', color: '#232321' }}>0{i+1}</span>
                            <span className="block" style={{ width: '100%', height: 1, background: '#232321', opacity: 0.5, marginTop: 2 }} />
                        </div>
                        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: '0.9rem', letterSpacing: '0.04em', textAlign: 'right', transition: 'color 0.2s' }}>{t}</div>
                    </div>
                ))}
            </section>
        </div>
    </div>
);
};

// 6. Earth — editorial style (design-e5650fdc / Card07 editorial theme)
export const HeroEarth = () => {
    const profileData = React.useContext(ProfileContext);
    return (
    <div className="min-h-screen w-full overflow-hidden shrink-0"
         style={{ background: '#ffffff', color: '#111111', fontFamily: "'Inter', sans-serif" }}>

        {/* Content scroll — no top padding since outer overlay handles nav */}
        <div className="px-6 pb-32">

            {/* Hero — big Cormorant name */}
            <div className="pt-8 pb-12">
                <h1 className="flex flex-col text-[72px] leading-[0.85] tracking-tight mb-10"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    <span>Jiang</span>
                    <span className="self-end mr-4">Han</span>
                </h1>
                <div className="flex justify-between items-start mt-12 border-t border-gray-100 pt-6">
                    <span className="text-[9px] uppercase tracking-[0.18em] font-medium text-gray-400 leading-relaxed">
                        Moly Memo<br/>AI PM
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.18em] font-medium text-gray-900 leading-relaxed text-right">
                        Based in<br/>Beijing
                    </span>
                </div>
            </div>

            {/* Section 01 — Bio */}
            <div className="relative mb-24 pt-6 mt-12">
                <span className="absolute -top-12 left-0 text-[40px] text-gray-200 font-light leading-none"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>01</span>
                <p className="text-[26px] leading-[1.3] text-[#111]"
                   style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {profileData.headline} <i className="text-gray-400">{profileData.intersections.common}</i>
                </p>
            </div>

            {/* Section 02 — Topics */}
            <div className="relative mb-24 pt-6">
                <span className="absolute -top-12 left-0 text-[40px] text-gray-200 font-light leading-none"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>02</span>
                <span className="text-[9px] uppercase tracking-[0.18em] font-medium text-gray-400 mb-8 block">Areas of Focus</span>
                <div className="space-y-6">
                    {profileData.intersections.topics.map((t, i) => (
                        <div key={i} className="flex flex-col border-b border-gray-100 pb-6">
                            <span className="text-[20px] font-medium text-[#111]"
                                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                                {t}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 03 — Contact */}
            <div className="relative mb-20 pt-6">
                <span className="absolute -top-12 left-0 text-[40px] text-gray-200 font-light leading-none"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>03</span>
                <div className="flex flex-col gap-6">
                    <div className="grid items-baseline border-b border-gray-100 pb-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
                        <span className="text-[9px] uppercase tracking-[0.18em] font-medium text-gray-400">Position</span>
                        <span className="text-[18px] text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                            {profileData.baseInfo.position}
                        </span>
                    </div>
                    <div className="grid items-baseline border-b border-gray-100 pb-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
                        <span className="text-[9px] uppercase tracking-[0.18em] font-medium text-gray-400">Company</span>
                        <span className="text-[16px] text-gray-600 leading-snug" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                            {profileData.baseInfo.company}
                        </span>
                    </div>
                    <div className="grid items-baseline border-b border-gray-100 pb-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
                        <span className="text-[9px] uppercase tracking-[0.18em] font-medium text-gray-400">Location</span>
                        <span className="text-[16px] text-gray-600 leading-snug" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                            {profileData.baseInfo.address}
                        </span>
                    </div>
                    <div className="grid items-start border-b border-gray-100 pb-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
                        <span className="text-[9px] uppercase tracking-[0.18em] font-medium text-gray-400 pt-1">About</span>
                        <span className="text-[15px] text-gray-600 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                            {profileData.baseInfo.notes}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

// BaseInfoFire — watercolor aesthetic, same warm cream + blob vibe as HeroFire
export const BaseInfoFire = () => {
    const profileData = React.useContext(ProfileContext);
    return (
    <div className="relative overflow-hidden min-h-screen px-7 pt-12 pb-32"
         style={{ background: '#F7F6F0', fontFamily: "'Jost', 'Inter', sans-serif", color: '#232321' }}>

        {/* Subtle watercolor wash behind */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden"
             style={{ filter: 'blur(40px)', opacity: 0.3 }}>
            <div className="absolute rounded-full bg-[#E63935] w-[200px] h-[200px] -top-[5%] -right-[10%]"></div>
            <div className="absolute rounded-full bg-[#F58220] w-[180px] h-[180px] bottom-[20%] -left-[10%]"></div>
        </div>

        <div className="relative z-10">
            {/* Section pull-tab */}
            <div className="flex items-center gap-3 mb-10">
                <div className="h-[1px] flex-1" style={{ background: 'rgba(35,35,33,0.15)' }} />
                <span style={{ fontSize: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(35,35,33,0.4)' }}>About</span>
                <div className="h-[1px] flex-1" style={{ background: 'rgba(35,35,33,0.15)' }} />
            </div>

            {/* Info rows — matching the right-aligned label style from HeroFire */}
            <div className="flex flex-col" style={{ gap: '1.6rem', marginBottom: '3rem' }}>
                {[
                    { label: 'POS', value: `${profileData.baseInfo.position} — ${profileData.baseInfo.company}` },
                    { label: 'LOC', value: profileData.baseInfo.address },
                    { label: 'IND', value: profileData.baseInfo.industry },
                ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between" style={{ borderBottom: '1px solid rgba(35,35,33,0.1)', paddingBottom: '1.2rem' }}>
                        <div className="flex flex-col items-center" style={{ position: 'relative', marginRight: '0.75rem' }}>
                            <span className="block" style={{ width: '100%', height: 1, background: '#232321', opacity: 0.4, marginBottom: 2 }} />
                            <span style={{ fontSize: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '0 4px', color: '#232321', opacity: 0.6 }}>{label}</span>
                            <span className="block" style={{ width: '100%', height: 1, background: '#232321', opacity: 0.4, marginTop: 2 }} />
                        </div>
                        <span style={{ fontSize: '0.95rem', letterSpacing: '0.02em', textAlign: 'right', flex: 1 }}>{value}</span>
                    </div>
                ))}
            </div>

            {/* Note */}
            <div style={{ marginBottom: '3rem', padding: '1rem 1.2rem', borderLeft: '2px solid rgba(230,57,53,0.4)', background: 'rgba(230,57,53,0.04)' }}>
                <p style={{ fontFamily: "Georgia, serif", fontStyle: 'italic', fontSize: '0.9rem', lineHeight: 1.7, color: 'rgba(35,35,33,0.7)' }}>
                    {profileData.baseInfo.notes}
                </p>
            </div>
        </div>

        {/* Save CTA — dark on cream, matching watercolor */}
        <div className="absolute bottom-0 left-0 w-full px-7 pb-8 pt-16 pointer-events-none"
             style={{ background: 'linear-gradient(to top, #F7F6F0 60%, transparent)' }}>
            <button className="w-full py-4 font-bold text-[13px] uppercase tracking-[0.15em] pointer-events-auto"
                    style={{ background: '#232321', color: '#F7F6F0', letterSpacing: '0.15em' }}>
                Add to Contacts
            </button>
        </div>
    </div>
);
};

// Components end
