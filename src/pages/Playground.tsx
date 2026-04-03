import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Settings, User, Bell, Search, Menu, Plus, Star, Heart, Share2, MoreHorizontal, Sparkles, Check, AlertCircle, Info, Loader2, Image as ImageIcon, Wifi, Battery, Fingerprint, Lock, Shield, ArrowRight, MapPin, MessageSquare, FileText, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Playground = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="min-h-screen bg-[#F0F2F5] p-8 font-sans text-gray-900 pb-20">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Moly UI Playground</h1>
                        <p className="text-gray-500">A collection of UI components for easy reference and selection.</p>
                    </div>
                    <Link to="/" className="px-5 py-2.5 bg-white rounded-xl shadow-sm text-sm font-bold border border-gray-200 hover:border-gray-300 transition-all flex items-center gap-2">
                        <Home size={16} />
                        Back to Hub
                    </Link>
                </div>

                {/* 1. Buttons */}
                <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-black tracking-tight mb-6">1. Buttons 按钮</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Style 1.1 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">1.1</span> <h3 className="font-bold">Primary Solid</h3></div>
                            <div className="flex flex-wrap gap-3">
                                <button className="px-6 py-3 bg-black text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-all">Action</button>
                                <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md">Submit</button>
                                <button className="px-5 py-2.5 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-all">Rounded</button>
                            </div>
                        </div>

                        {/* Style 1.2 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">1.2</span> <h3 className="font-bold">Secondary Soft</h3></div>
                            <div className="flex flex-wrap gap-3">
                                <button className="px-6 py-3 bg-gray-100 text-gray-800 rounded-2xl font-bold hover:bg-gray-200 transition-all">Cancel</button>
                                <button className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all">Light</button>
                                <button className="px-5 py-2.5 bg-rose-50 text-rose-500 rounded-full font-bold hover:bg-rose-100 transition-all">Delete</button>
                            </div>
                        </div>

                        {/* Style 1.3 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">1.3</span> <h3 className="font-bold">Outlined</h3></div>
                            <div className="flex flex-wrap gap-3">
                                <button className="px-6 py-3 bg-white border-2 border-black text-black rounded-2xl font-bold hover:bg-gray-50 transition-all">Border 2px</button>
                                <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:border-gray-300 shadow-sm transition-all">Border 1px</button>
                            </div>
                        </div>

                        {/* Style 1.4 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">1.4</span> <h3 className="font-bold">Icon Buttons</h3></div>
                            <div className="flex flex-wrap gap-3 items-center">
                                <button className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"><Plus size={24} /></button>
                                <button className="w-10 h-10 bg-white border border-gray-200 text-gray-600 rounded-xl flex items-center justify-center shadow-sm hover:border-gray-300 hover:text-black transition-all"><Menu size={20} /></button>
                                <button className="p-3 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-all"><Settings size={20} /></button>
                                <button className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center hover:bg-indigo-100 transition-all"><Star size={20} /></button>
                            </div>
                        </div>

                        {/* Style 1.5 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">1.5</span> <h3 className="font-bold">Text Buttons</h3></div>
                            <div className="flex flex-wrap gap-4 items-center">
                                <button className="text-indigo-600 font-bold hover:underline underline-offset-4">Learn More</button>
                                <button className="text-gray-500 font-bold hover:text-black transition-colors flex items-center gap-1">Next <ChevronRight size={16} /></button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Tags / Badges */}
                <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-black tracking-tight mb-6">2. Tags & Badges 标签</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Style 2.1 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">2.1</span> <h3 className="font-bold">Small Solid</h3></div>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2.5 py-1 bg-gray-800 text-white text-[11px] font-bold rounded-lg tracking-wide">DESIGN</span>
                                <span className="px-2.5 py-1 bg-rose-500 text-white text-[11px] font-bold rounded-lg tracking-wide">URGENT</span>
                                <span className="px-2.5 py-1 bg-emerald-500 text-white text-[11px] font-bold rounded-lg tracking-wide">DONE</span>
                            </div>
                        </div>

                        {/* Style 2.2 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">2.2</span> <h3 className="font-bold">Soft Round</h3></div>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">Development</span>
                                <span className="px-3 py-1.5 bg-sky-50 text-sky-600 text-xs font-bold rounded-full">Research</span>
                                <span className="px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-full">Meeting</span>
                            </div>
                        </div>

                        {/* Style 2.3 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">2.3</span> <h3 className="font-bold">Outlined</h3></div>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg bg-white">v1.2.0</span>
                                <span className="px-3 py-1 border-2 border-gray-900 text-gray-900 text-xs font-black rounded-full uppercase tracking-widest">Premium</span>
                            </div>
                        </div>

                        {/* Style 2.4 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">2.4</span> <h3 className="font-bold">Status Dots</h3></div>
                            <div className="flex flex-wrap gap-4">
                                <span className="flex items-center gap-1.5 text-sm font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded-full border border-gray-100"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Online</span>
                                <span className="flex items-center gap-1.5 text-sm font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded-full border border-gray-100"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Away</span>
                                <span className="flex items-center gap-1.5 text-sm font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded-full border border-gray-100"><div className="w-2 h-2 rounded-full bg-red-500"></div> Busy</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Navigation Bars */}
                <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-black tracking-tight mb-6">3. Navigation Bars 导航栏</h2>

                    <div className="space-y-10">
                        {/* Style 3.1 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">3.1</span> <h3 className="font-bold">Standard Header (Title Center, Actions Sides)</h3></div>
                            <div className="w-full max-w-md bg-white border border-gray-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col pointer-events-none">
                                <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 bg-white">
                                    <button className="p-2 -ml-2 text-gray-400"><ChevronLeft size={24} /></button>
                                    <h3 className="font-black text-lg tracking-tight">Settings</h3>
                                    <button className="p-2 -mr-2 text-gray-400"><MoreHorizontal size={24} /></button>
                                </div>
                                <div className="h-24 bg-gray-50"></div>
                            </div>
                        </div>

                        {/* Style 3.2 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">3.2</span> <h3 className="font-bold">Dynamic Header (Large Title Left)</h3></div>
                            <div className="w-full max-w-md bg-[#F9F9F9] border border-gray-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col pointer-events-none">
                                <div className="px-6 pt-8 pb-4 flex items-end justify-between">
                                    <div>
                                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Thursday, 12 Oct</p>
                                        <h3 className="font-black text-3xl tracking-tighter">Today</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500"><Search size={18} /></div>
                                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 relative">
                                            <Bell size={18} />
                                            <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-20 bg-gray-100 mt-2 rounded-t-3xl"></div>
                            </div>
                        </div>

                        {/* Style 3.3 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">3.3</span> <h3 className="font-bold">Segmented Tab Bar</h3></div>
                            <div className="w-full max-w-md bg-white border border-gray-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col pointer-events-none">
                                <div className="px-6 pt-6 pb-2">
                                    <h3 className="font-black text-xl mb-4 text-center">Library</h3>
                                    <div className="flex bg-gray-100 p-1 rounded-2xl">
                                        <div className={`flex-1 py-1.5 rounded-xl text-center text-sm font-bold ${activeTab === 0 ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>Recent</div>
                                        <div className={`flex-1 py-1.5 rounded-xl text-center text-sm font-bold ${activeTab === 1 ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>Favorites</div>
                                    </div>
                                </div>
                                <div className="h-20 bg-gray-50"></div>
                            </div>
                        </div>

                        {/* Style 3.4 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">3.4</span> <h3 className="font-bold">Floating Bottom Nav</h3></div>
                            <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col h-48 relative pointer-events-none">
                                <div className="absolute bottom-6 left-6 right-6 h-16 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-3xl flex items-center justify-between px-6 border border-gray-100">
                                    <button className="text-black"><Home size={22} strokeWidth={2.5} /></button>
                                    <button className="text-gray-400"><Search size={22} strokeWidth={2} /></button>
                                    <button className="w-12 h-12 bg-black rounded-full text-white flex items-center justify-center -mt-6 shadow-lg border-4 border-gray-50"><Plus size={24} strokeWidth={3} /></button>
                                    <button className="text-gray-400 relative"><Bell size={22} strokeWidth={2} /><div className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-white"></div></button>
                                    <button className="text-gray-400"><User size={22} strokeWidth={2} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Cards */}
                <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-black tracking-tight mb-6">4. Cards 卡片</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Style 4.1 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">4.1</span> <h3 className="font-bold">Simple Info Card</h3></div>
                            <div className="p-5 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center mb-4"><Star size={20} /></div>
                                <h4 className="font-black text-lg mb-1 tracking-tight">Design System</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">Update the core library components to match the new visual guidelines.</p>
                            </div>
                        </div>

                        {/* Style 4.2 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">4.2</span> <h3 className="font-bold">Action Card (Horizontal)</h3></div>
                            <div className="p-4 rounded-[1.5rem] bg-gray-50 border border-transparent hover:border-gray-200 transition-colors flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-800 font-black text-xl">
                                        M
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Meeting Note</h4>
                                        <p className="text-xs text-gray-400 mt-0.5 font-mono">10:00 AM</p>
                                    </div>
                                </div>
                                <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-black transition-colors"><ChevronRight size={18} /></button>
                            </div>
                        </div>

                        {/* Style 4.3 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">4.3</span> <h3 className="font-bold">Solid Color Callout</h3></div>
                            <div className="p-6 rounded-[2rem] bg-indigo-600 text-white shadow-lg relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                                <h4 className="font-black text-xl mb-2 flex items-center gap-2"><Sparkles size={20} className="text-indigo-200" /> Pro Tip</h4>
                                <p className="text-sm text-indigo-100 leading-relaxed max-w-[90%]">Use shortcuts to quickly create tasks directly from the home screen.</p>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-black tracking-tight mt-12 mb-6 pt-8 border-t border-gray-100 flex items-center gap-2">
                        <Sparkles className="text-amber-500" /> Premium Chat Cards (高质感卡片变体)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#F9F9FB] p-8 rounded-[2rem] border border-gray-100 items-start">

                        {/* Option A: Vertical Elegant Contact */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-200/50 rounded text-xs font-mono font-bold text-gray-500">Option A</span> <h3 className="font-bold text-gray-700">纵向排印 (联系人)</h3></div>
                            {/* Card Container - Adjusted Aspect Ratio for Chat */}
                            <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50/50 flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all max-w-[280px]">

                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shadow-sm relative">
                                        <img src="https://i.pravatar.cc/150?img=47" className="w-full h-full object-cover" alt="Profile" />
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider bg-gray-50 px-2.5 py-1 rounded-full">New Match</span>
                                </div>

                                <div className="space-y-1 mb-6 text-center">
                                    <h4 className="font-serif text-[20px] text-gray-900 font-semibold tracking-wide">李子轩</h4>
                                    <p className="text-indigo-600/80 text-[13px] font-medium tracking-wide">字节跳动 · 高级产品专家</p>
                                </div>

                                {/* Info blocks with subtle dividing lines */}
                                <div className="space-y-3">
                                    <div className="flex flex-col gap-1 pb-3 border-b border-gray-50">
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Location</span>
                                        <span className="text-gray-800 text-[13px]">北京，海淀区</span>
                                    </div>
                                    <div className="flex flex-col gap-1 pb-3 border-b border-gray-50">
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Match Reason</span>
                                        <span className="text-gray-800 text-[13px] leading-snug">双方都在关注 SaaS 出海业务，且均有 5 年以上 B 端经验。</span>
                                    </div>
                                </div>

                                <button className="mt-4 w-full py-2.5 bg-gray-900 text-white rounded-xl text-[13px] font-medium shadow-sm hover:bg-black transition-colors">
                                    Send Message
                                </button>
                            </div>
                        </div>

                        {/* Option B: Clean Event Ticket */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-200/50 rounded text-xs font-mono font-bold text-gray-500">Option B</span> <h3 className="font-bold text-gray-700">模块化日程 (Ticket)</h3></div>
                            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50/50 flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all max-w-[280px] overflow-hidden">

                                {/* Top Banner/Color accent */}
                                <div className="bg-emerald-50 px-5 py-4 flex justify-between items-center border-b border-emerald-100/50">
                                    <div className="flex items-center gap-2 text-emerald-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider">Upcoming Sync</span>
                                    </div>
                                    <span className="text-emerald-600 font-medium text-[13px]">In 30m</span>
                                </div>

                                <div className="p-5 flex flex-col gap-4">
                                    <div className="flex gap-4 items-start">
                                        <div className="flex flex-col items-center bg-gray-50 rounded-xl px-3 py-2 min-w-[56px] border border-gray-100">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase">Dec</span>
                                            <span className="text-[18px] text-gray-900 font-black leading-tight">09</span>
                                        </div>
                                        <div className="pt-0.5">
                                            <h3 className="text-[16px] font-bold text-gray-900 leading-tight mb-1">Q4 Strategy Review</h3>
                                            <p className="text-[12px] text-gray-500">14:00 - 15:30 (GMT+8)</p>
                                        </div>
                                    </div>

                                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent my-1"></div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            <img src="https://i.pravatar.cc/150?img=11" className="w-7 h-7 rounded-full border-2 border-white" alt="Avatar" />
                                            <img src="https://i.pravatar.cc/150?img=33" className="w-7 h-7 rounded-full border-2 border-white" alt="Avatar" />
                                        </div>
                                        <span className="text-[12px] text-gray-500 font-medium">+ you, Sarah</span>
                                    </div>

                                    <div className="flex gap-2 mt-2">
                                        <button className="flex-1 py-2.5 bg-gray-50 text-gray-700 rounded-xl text-[12px] font-semibold border border-gray-100 hover:bg-gray-100 transition-colors">Reschedule</button>
                                        <button className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-[12px] font-semibold shadow-sm hover:bg-emerald-700 transition-colors">Join Call</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Option C: Concise Data Card */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-200/50 rounded text-xs font-mono font-bold text-gray-500">Option C</span> <h3 className="font-bold text-gray-700">精简纪要 (Note)</h3></div>
                            <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50/50 flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all max-w-[280px]">

                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2 px-2.5 py-1 bg-amber-50 rounded-lg text-amber-700">
                                        <FileText size={12} strokeWidth={2.5} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Meeting Note</span>
                                    </div>
                                    <button className="text-gray-300 hover:text-gray-500 transition-colors"><MoreHorizontal size={16} /></button>
                                </div>

                                <h3 className="text-[16px] font-bold text-gray-900 leading-snug mb-2">
                                    Product Sync: AI Assistant Integration Guidelines
                                </h3>

                                <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3 mb-5">
                                    Key decisions: Context length will be capped at 8k tokens. The new chat UI components need to be completely isolated from the old legacy views...
                                </p>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-[12px] text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <Check size={14} className="text-gray-400" /> Update token limits in API
                                    </div>
                                    <div className="flex items-center gap-2 text-[12px] text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <Check size={14} className="text-gray-400" /> PR review for UI components
                                    </div>
                                </div>

                                <button className="mt-5 w-full py-2.5 text-indigo-600 bg-indigo-50 rounded-xl text-[13px] font-bold hover:bg-indigo-100 transition-colors">
                                    Read Full Doc
                                </button>
                            </div>
                        </div>

                        {/* Option D: Quick Action Contact */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-200/50 rounded text-xs font-mono font-bold text-gray-500">Option D</span> <h3 className="font-bold text-gray-700">轻量交互 (联系人)</h3></div>
                            <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100/80 max-w-[280px] flex flex-col gap-4">
                                <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
                                    <div className="relative">
                                        <img src="https://i.pravatar.cc/150?img=12" alt="Avatar" className="w-14 h-14 rounded-[14px] object-cover" />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white border border-gray-100 rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-[17px] leading-tight mb-1">张启明</h4>
                                        <p className="text-gray-500 text-[12px] font-medium">商业化负责人</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-gray-50 rounded-xl p-2.5 text-center cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors group">
                                        <MessageSquare size={18} className="mx-auto mb-1 text-gray-400 group-hover:text-indigo-500" />
                                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-indigo-600">文字</span>
                                    </div>
                                    <div className="flex-1 bg-gray-50 rounded-xl p-2.5 text-center cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors group">
                                        <svg className="mx-auto mb-1 text-gray-400 group-hover:text-indigo-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-indigo-600">语音</span>
                                    </div>
                                    <div className="flex-1 bg-gray-50 rounded-xl p-2.5 text-center cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors group">
                                        <User size={18} className="mx-auto mb-1 text-gray-400 group-hover:text-slate-600" />
                                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-slate-700">名片</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Option E: Timeline Schedule */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-200/50 rounded text-xs font-mono font-bold text-gray-500">Option E</span> <h3 className="font-bold text-gray-700">时间轴 (日程)</h3></div>
                            <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100/80 max-w-[280px]">
                                <div className="flex items-center justify-between mb-5">
                                    <h4 className="font-bold text-gray-900 text-sm">Tomorrow</h4>
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">2 Meetings</span>
                                </div>

                                <div className="relative border-l-2 border-gray-100 ml-2 space-y-6">
                                    {/* Event 1 */}
                                    <div className="relative pl-5">
                                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white"></div>
                                        <span className="block text-[11px] font-bold text-gray-400 mb-0.5">09:30 AM</span>
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 cursor-pointer hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                                            <h5 className="font-bold text-[13px] text-gray-900 mb-1">Design Review</h5>
                                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                                <MapPin size={10} /> <span>Zoom</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Event 2 */}
                                    <div className="relative pl-5">
                                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-orange-400 ring-4 ring-white"></div>
                                        <span className="block text-[11px] font-bold text-gray-400 mb-0.5">14:00 PM</span>
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 cursor-pointer hover:border-orange-200 hover:bg-orange-50/50 transition-colors">
                                            <h5 className="font-bold text-[13px] text-gray-900 mb-1">Client Sync: Alpha Corp</h5>
                                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                                <MapPin size={10} /> <span>Meeting Room C</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Option F: Focus To-Do */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-200/50 rounded text-xs font-mono font-bold text-gray-500">Option F</span> <h3 className="font-bold text-gray-700">聚焦待办 (To-Do)</h3></div>
                            <div className="bg-[#111827] text-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] max-w-[280px] relative overflow-hidden group">
                                {/* Subtle background glow */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

                                <div className="flex justify-between items-center mb-6 relative">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full border-[1.5px] border-gray-600 flex items-center justify-center cursor-pointer group-hover:bg-indigo-500/20 group-hover:border-indigo-400 transition-colors">
                                            <Check size={12} className="text-indigo-400 opacity-0 group-hover:opacity-100" strokeWidth={3} />
                                        </div>
                                        <span className="text-[11px] uppercase tracking-widest font-bold text-gray-400 group-hover:text-indigo-300">Next Action</span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse"></div>
                                </div>

                                <h3 className="font-serif text-[22px] font-medium leading-tight mb-3 relative">
                                    Prepare Q4 Financial Report
                                </h3>

                                <p className="text-[13px] text-gray-400 leading-relaxed mb-6 relative border-l-2 border-gray-700 pl-3">
                                    Need to aggregate revenue data from APAC and EMEA regions before the board meeting.
                                </p>

                                <div className="flex items-center justify-between border-t border-gray-800 pt-4 relative">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-mono text-gray-500">Wait, James...</span>
                                    </div>
                                    <span className="text-[12px] font-bold text-rose-400">Due Today</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-black tracking-tight mt-12 mb-6 pt-8 border-t border-gray-100 flex items-center gap-2">
                        <Sparkles className="text-gray-400" /> Ultra-Minimalist Cards (极简主义风格)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-8 rounded-[2rem] border border-gray-100 items-start">

                        {/* Option G: Ultra-minimal Contact */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-400">Option G</span> <h3 className="font-bold text-gray-700">留白优先 (联系人)</h3></div>
                            <div className="p-6 max-w-[280px] bg-white border border-gray-100 hover:border-black transition-colors rounded-2xl cursor-pointer group">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="w-14 h-14 bg-gray-100 rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                        <img src="https://i.pravatar.cc/150?img=32" alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-black group-hover:border-black transition-colors">
                                        <ArrowRight size={14} />
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[24px] font-light text-black tracking-tight mb-1">Elara Vance</h4>
                                    <p className="text-[13px] text-gray-400 font-medium">Independent Curator</p>
                                </div>
                            </div>
                        </div>

                        {/* Option H: Ultra-minimal Schedule */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-400">Option H</span> <h3 className="font-bold text-gray-700">纯排版 (日程)</h3></div>
                            <div className="p-6 max-w-[280px] bg-white border-l-2 border-black hover:pl-8 transition-all duration-300 cursor-pointer">
                                <div className="mb-4">
                                    <span className="text-[12px] uppercase font-bold tracking-widest text-gray-400">Dec 09</span>
                                    <h4 className="text-[28px] font-serif font-medium text-black leading-none mt-1">10:30<span className="text-[14px] text-gray-400 ml-1">AM</span></h4>
                                </div>

                                <h5 className="text-[16px] font-bold text-black mb-2">Typography Review</h5>
                                <p className="text-[13px] text-gray-400 leading-relaxed mb-6">Review the new font hierarchy for the marketing site overhaul.</p>

                                <div className="flex gap-2">
                                    <img src="https://i.pravatar.cc/150?img=1" className="w-6 h-6 rounded-full grayscale" alt="P" />
                                    <img src="https://i.pravatar.cc/150?img=2" className="w-6 h-6 rounded-full grayscale" alt="P" />
                                    <div className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-[10px] text-gray-400">+2</div>
                                </div>
                            </div>
                        </div>

                        {/* Option I: Ultra-minimal Todo */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-400">Option I</span> <h3 className="font-bold text-gray-700">划线检视 (任务)</h3></div>
                            <div className="p-5 max-w-[280px] bg-gray-50/50 rounded-2xl flex items-start gap-4 group cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="mt-1">
                                    <div className="w-5 h-5 border-[1.5px] border-gray-300 rounded group-hover:border-black transition-colors flex items-center justify-center">
                                        <Check size={12} className="text-transparent" strokeWidth={4} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-1 block">Urgent</span>
                                    <h4 className="text-[15px] font-medium text-black leading-snug group-hover:line-through group-hover:text-gray-400 transition-all duration-300 decoration-1">
                                        Finalize Q4 Budget Allocations
                                    </h4>
                                </div>
                            </div>
                        </div>

                        {/* Option J: Ghost Outline Contact */}
                        <div className="space-y-4 mt-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-400">Option J</span> <h3 className="font-bold text-gray-700">细线描边 (联系人)</h3></div>
                            <div className="p-5 max-w-[280px] bg-white border-[0.5px] border-gray-300 rounded-[20px] flex items-center justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-gray-400 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <img src="https://i.pravatar.cc/150?img=68" alt="Avatar" className="w-11 h-11 rounded-full border-[0.5px] border-gray-200" />
                                    <div>
                                        <h4 className="font-medium text-[16px] text-gray-900 leading-tight">林晓</h4>
                                        <p className="text-[12px] text-gray-400 mt-0.5">运营总监</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full border-[0.5px] border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-black transition-colors">
                                    <MessageSquare size={13} />
                                </div>
                            </div>
                        </div>

                        {/* Option K: Compact Monospace Date */}
                        <div className="space-y-4 mt-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-400">Option K</span> <h3 className="font-bold text-gray-700">单行摘要 (日程)</h3></div>
                            <div className="p-4 max-w-[280px] bg-gray-50/80 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                                <div className="flex flex-col items-center justify-center min-w-[40px]">
                                    <span className="text-[10px] font-mono text-gray-400 uppercase leading-none mb-1">Dec</span>
                                    <span className="text-[18px] font-mono font-bold text-gray-900 leading-none">09</span>
                                </div>
                                <div className="w-[1px] h-8 bg-gray-200"></div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-medium text-[14px] text-gray-900 truncate">Q4 Strategy Sync</h4>
                                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">14:00 - 15:30</p>
                                </div>
                            </div>
                        </div>

                        {/* Option L: Micro-Badge Tag */}
                        <div className="space-y-4 mt-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-400">Option L</span> <h3 className="font-bold text-gray-700">微标签 (纪要)</h3></div>
                            <div className="p-5 max-w-[280px] bg-white border border-gray-100 rounded-[20px] cursor-pointer hover:border-indigo-100 hover:bg-indigo-50/20 transition-all group">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Note Extracted</span>
                                </div>
                                <h4 className="font-serif text-[18px] font-medium text-gray-900 leading-tight mb-2 group-hover:text-indigo-900 transition-colors">
                                    Design System v2.0
                                </h4>
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-md text-[10px] text-gray-600 font-medium">#Typography</span>
                                    <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-md text-[10px] text-gray-600 font-medium">#Colors</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <h3 className="text-xl font-black tracking-tight mt-12 mb-6 pt-8 border-t border-gray-100">Legacy Chat Feed Cards (旧版卡片参考)</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">

                        {/* Chat Card: Schedule */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-200 rounded text-xs font-mono font-bold text-gray-600">4.4</span> <h3 className="font-bold">Schedule (日程安排)</h3></div>
                            <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 flex flex-col gap-3 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                                <div className="flex justify-between items-start pl-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded">Meeting</span>
                                            <span className="text-xs font-bold text-gray-400">Today, 2:00 PM</span>
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-base leading-tight">Q3 Product Roadmap Review</h4>
                                        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5"><MapPin size={12} /> Tencent Conference Room A</p>
                                    </div>
                                    <div className="flex -space-x-2">
                                        <img src="https://i.pravatar.cc/150?img=33" alt="Avatar" className="w-6 h-6 rounded-full border-2 border-white bg-gray-100" />
                                        <img src="https://i.pravatar.cc/150?img=12" alt="Avatar" className="w-6 h-6 rounded-full border-2 border-white bg-gray-100" />
                                        <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-600">+3</div>
                                    </div>
                                </div>
                                <div className="pl-2 pt-2 border-t border-gray-50 flex gap-2">
                                    <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors">Join Meeting</button>
                                    <button className="px-3 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">Details</button>
                                </div>
                            </div>
                        </div>

                        {/* Chat Card: Contact */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-200 rounded text-xs font-mono font-bold text-gray-600">4.5</span> <h3 className="font-bold">Contact (人脉推荐)</h3></div>
                            <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                                <img src="https://i.pravatar.cc/150?img=68" alt="Avatar" className="w-14 h-14 rounded-full object-cover shadow-sm bg-gray-100 border border-gray-50" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-base leading-tight flex items-center gap-1.5">
                                        David Chen
                                        <div className="w-3 h-3 bg-green-500 rounded-full border-[1.5px] border-white" title="Online"></div>
                                    </h4>
                                    <p className="text-xs text-gray-500 font-medium">Head of Engineering @ TechCorp</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-600 font-bold rounded flex items-center gap-1"><Sparkles size={10} /> 相似经历</span>
                                    </div>
                                </div>
                                <button className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors"><MessageSquare size={16} /></button>
                            </div>
                        </div>

                        {/* Chat Card: Meeting Note */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-200 rounded text-xs font-mono font-bold text-gray-600">4.6</span> <h3 className="font-bold">Meeting Note (会议纪要)</h3></div>
                            <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 flex flex-col gap-2 relative">
                                <div className="absolute top-4 right-4 text-gray-300"><FileText size={20} /></div>
                                <h4 className="font-bold text-gray-900 text-base leading-tight pr-8">Weekly Sync Notes</h4>
                                <p className="text-xs text-gray-400 font-mono mb-2">Yesterday, 10:00 AM · 2 pages</p>

                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                                    <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-2">
                                        <span className="font-bold text-indigo-600">Summary:</span> Discussed the upcoming Q4 goals and finalized the marketing budget. Next steps include...
                                    </p>
                                </div>
                                <button className="mt-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors w-full border border-gray-100 rounded-xl hover:bg-indigo-50/50 hover:border-indigo-100">
                                    <Eye size={14} /> View Details
                                </button>
                            </div>
                        </div>

                        {/* Chat Card: To-Do Task */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-200 rounded text-xs font-mono font-bold text-gray-600">4.7</span> <h3 className="font-bold">To-Do Task (待办任务)</h3></div>
                            <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 flex items-start gap-3">
                                <div className="mt-0.5">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors group">
                                        <Check size={12} className="text-emerald-500 opacity-0 group-hover:opacity-100" strokeWidth={4} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-900 text-sm leading-tight">Review Figma Prototypes</h4>
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-500 rounded uppercase tracking-wider">High</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Leave comments on the new onboarding flow before the presentation tomorrow.</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs font-bold text-orange-500">Due Tomorrow</span>
                                        <div className="flex gap-1">
                                            <span className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">#</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Inputs & Forms */}
                <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-black tracking-tight mb-6">5. Inputs 输入框</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Style 5.1 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">5.1</span> <h3 className="font-bold">Standard Input</h3></div>
                            <div className="flex flex-col gap-2 pointer-events-none">
                                <label className="text-xs font-bold text-gray-500 ml-1">Username</label>
                                <input type="text" placeholder="Enter your username" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium" />
                            </div>
                        </div>

                        {/* Style 5.2 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">5.2</span> <h3 className="font-bold">Search Bar (Pill)</h3></div>
                            <div className="relative pointer-events-none flex items-center">
                                <Search size={18} className="absolute left-4 text-gray-400" />
                                <input type="text" placeholder="Search anything..." className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 shadow-sm rounded-full focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm font-medium placeholder:text-gray-400" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Lists & Rows */}
                <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-black tracking-tight mb-6">6. Lists & Rows 列表 (iOS Style)</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Style 6.1 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">6.1</span> <h3 className="font-bold">Grouped List (Settings)</h3></div>
                            <div className="bg-gray-100 rounded-[2rem] p-4">
                                <div className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100/50">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center text-white"><Wifi size={16} /></div>
                                            <span className="font-medium text-gray-900 text-sm">Wi-Fi</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <span className="text-sm">HomeNetwork</span>
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white"><Shield size={16} /></div>
                                            <span className="font-medium text-gray-900 text-sm">Bluetooth</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <span className="text-sm">On</span>
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center text-white"><Battery size={16} /></div>
                                            <span className="font-medium text-gray-900 text-sm">Battery</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <span className="text-sm">80%</span>
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Style 6.2 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">6.2</span> <h3 className="font-bold">Contact List Item</h3></div>
                            <div className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm flex flex-col gap-4">
                                <div className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-12 h-12 rounded-full object-cover shadow-sm bg-gray-100" />
                                        <div>
                                            <h4 className="font-bold text-gray-900 leading-tight">Alice Johnson</h4>
                                            <p className="text-xs text-gray-500">Active 2m ago</p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-1.5 bg-gray-100 text-gray-800 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors">Follow</button>
                                </div>
                                <div className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 font-black flex items-center justify-center shadow-sm text-lg">
                                            B
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 leading-tight">Bob Smith</h4>
                                            <p className="text-xs text-gray-500">Product Designer</p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-bold shadow-sm hover:bg-indigo-700 transition-colors">Message</button>
                                </div>
                            </div>
                        </div>

                        {/* Style 6.3 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">6.3</span> <h3 className="font-bold">Action Row (Destructive)</h3></div>
                            <div className="bg-gray-100 rounded-[2rem] p-4 flex items-center justify-center">
                                <div className="bg-white rounded-2xl w-full text-center overflow-hidden shadow-sm">
                                    <button className="w-full py-4 font-semibold text-rose-500 hover:bg-rose-50 transition-colors border-b border-gray-100">Delete Account</button>
                                    <button className="w-full py-4 font-medium text-gray-800 hover:bg-gray-50 transition-colors">Log Out</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. Controls & Toggles */}
                <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-black tracking-tight mb-6">7. Controls & Toggles 开关与控制</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Style 7.1 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">7.1</span> <h3 className="font-bold">iOS Style Switches</h3></div>
                            <div className="flex flex-col gap-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-800">Push Notifications</span>
                                    <div className="w-12 h-7 bg-emerald-500 rounded-full p-1 cursor-pointer transition-colors relative shadow-inner">
                                        <div className="w-5 h-5 bg-white rounded-full shadow-sm absolute right-1"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-800">Dark Mode</span>
                                    <div className="w-12 h-7 bg-gray-300 rounded-full p-1 cursor-pointer transition-colors relative shadow-inner">
                                        <div className="w-5 h-5 bg-white rounded-full shadow-sm absolute left-1"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Style 7.2 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">7.2</span> <h3 className="font-bold">Custom Radio/Check Select</h3></div>
                            <div className="flex flex-col gap-3 p-6 bg-white rounded-[2rem] border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between p-3 rounded-xl border-2 border-indigo-600 bg-indigo-50/50 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">💳</span>
                                        <span className="font-bold text-indigo-900">Credit Card</span>
                                    </div>
                                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white"><Check size={14} strokeWidth={4} /></div>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl border-2 border-transparent bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">🅿️</span>
                                        <span className="font-bold text-gray-700">PayPal</span>
                                    </div>
                                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Style 7.3 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">7.3</span> <h3 className="font-bold">Slider (Volume/Brightness)</h3></div>
                            <div className="p-8 bg-gray-100 rounded-[2rem] border border-gray-200 flex flex-col justify-center h-full">
                                <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner flex items-center cursor-pointer">
                                    <div className="absolute left-0 top-0 bottom-0 w-[60%] bg-indigo-500 rounded-full"></div>
                                    <div className="absolute left-3 text-white z-10 opacity-70"><Sparkles size={16} /></div>
                                    <div className="absolute right-3 text-gray-400 z-10"><Sparkles size={20} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 8. Modals & Action Sheets */}
                <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-black tracking-tight mb-6">8. Modals & Action Sheets 弹窗与底部菜单</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Style 8.1 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">8.1</span> <h3 className="font-bold">iOS Style Alert / Dialog</h3></div>
                            <div className="h-64 bg-black/40 rounded-[2rem] flex items-center justify-center p-6 backdrop-blur-sm pointer-events-none">
                                <div className="bg-white/90 backdrop-blur-xl w-64 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-center">
                                    <div className="p-5">
                                        <h4 className="font-bold text-gray-900 mb-1 leading-tight">Allow "App" to use your location?</h4>
                                        <p className="text-xs text-gray-600 leading-tight">Your location is used to show nearby restaurants.</p>
                                    </div>
                                    <div className="border-t border-gray-200/60 flex flex-col">
                                        <button className="py-3 text-sm font-semibold text-indigo-600 border-b border-gray-200/60 active:bg-gray-100/50">Allow While Using App</button>
                                        <button className="py-3 text-sm font-semibold text-indigo-600 border-b border-gray-200/60 active:bg-gray-100/50">Allow Once</button>
                                        <button className="py-3 text-sm font-semibold text-gray-900 active:bg-gray-100/50">Don't Allow</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Style 8.2 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">8.2</span> <h3 className="font-bold">Bottom Action Sheet</h3></div>
                            <div className="h-64 bg-black/40 rounded-[2rem] flex flex-col justify-end p-4 backdrop-blur-sm pointer-events-none overflow-hidden relative">
                                <div className="bg-white rounded-[2rem] w-full mt-auto text-center overflow-hidden shadow-2xl pb-4">
                                    {/* Handle */}
                                    <div className="w-full flex justify-center py-3">
                                        <div className="w-10 h-1.5 bg-gray-200 rounded-full"></div>
                                    </div>
                                    <div className="px-6 pb-2 text-left">
                                        <h4 className="font-bold text-xl mb-4">Share Options</h4>
                                        <div className="flex gap-4 mb-4 overflow-x-auto no-scrollbar pb-2">
                                            <div className="flex flex-col items-center gap-2 min-w-[60px]">
                                                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl shadow-sm"><Share2 size={24} /></div>
                                                <span className="text-[10px] font-medium text-gray-600">Copy Link</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2 min-w-[60px]">
                                                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl shadow-sm"><MoreHorizontal size={24} /></div>
                                                <span className="text-[10px] font-medium text-gray-600">More</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 9. Feedback & Progress */}
                <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 mb-20">
                    <h2 className="text-2xl font-black tracking-tight mb-6">9. Feedback & Progress 反馈与加载</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Style 9.1 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">9.1</span> <h3 className="font-bold">Floating Toasts</h3></div>
                            <div className="flex flex-col gap-3 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 h-full justify-center">
                                {/* Success Toast */}
                                <div className="bg-white px-4 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center gap-3 border border-gray-100">
                                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white"><Check size={14} strokeWidth={3} /></div>
                                    <span className="font-bold text-sm text-gray-800">Changes Saved Successfully</span>
                                </div>
                                {/* Error Toast */}
                                <div className="bg-gray-900 px-4 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3">
                                    <AlertCircle size={18} className="text-rose-500" />
                                    <span className="font-medium text-sm text-white text-center flex-1">Connection lost</span>
                                </div>
                            </div>
                        </div>

                        {/* Style 9.2 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">9.2</span> <h3 className="font-bold">Loaders & Spinners</h3></div>
                            <div className="flex justify-center items-center gap-8 p-8 bg-white rounded-[2rem] border border-gray-200 shadow-sm h-full">
                                <Loader2 size={32} className="text-indigo-600 animate-spin" />
                                <div className="flex gap-1.5 p-3 bg-gray-100 rounded-full">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                </div>
                                <div className="relative w-10 h-10">
                                    <svg className="animate-spin w-full h-full text-blue-500" viewBox="0 0 50 50">
                                        <circle className="opacity-25" cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4"></circle>
                                        <circle className="opacity-75" cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="90 150" strokeLinecap="round"></circle>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Style 9.3 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-bold text-gray-500">9.3</span> <h3 className="font-bold">Skeleton Loading (Shimmer)</h3></div>
                            <div className="flex flex-col gap-4 p-6 bg-white rounded-[2rem] border border-gray-200 shadow-sm h-full">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                        <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-[85%]"></div>
                                        <div className="h-3 bg-gray-100 rounded animate-pulse w-[40%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Playground;
