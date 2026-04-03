import React, { useState, useEffect } from 'react';
import { 
    X, MapPin, Search, ChevronRight, Check, Car, Navigation, Bookmark, AlertTriangle, MoreHorizontal, Sun, Bell, Repeat, Mic, LocateFixed, Clock, CalendarDays, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CoreTask {
    id: number;
    date?: string;
    time?: string;
    endTime?: string;
    title: string;
    type?: string;
    color?: string;
    priority: number;
    goal: string;
    energy: string;
    context: string;
    impact?: number;
    completed?: boolean;
    description?: string;
    icon?: React.ReactNode;
}

export interface ScheduleDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: CoreTask | null;
    timePhase?: 'planned' | 'near';
}

export default function ScheduleDetailModal({ isOpen, onClose, task, timePhase = 'planned' }: ScheduleDetailModalProps) {
    // view: 'detail' = 日程详情, 'map-search' = 地图全屏选点, 'map-detail' = 底部弹窗详情
    const [view, setView] = useState<'detail' | 'map-search' | 'map-detail'>('detail');


    const [destination, setDestination] = useState<any>({
        name: '北京望京万科时代中心',
        address: '北京市朝阳区望京街9号'
    });

    // Ensure mock applies on every open for demo
    useEffect(() => {
        if (isOpen) {
            setDestination({
                name: '北京望京万科时代中心',
                address: '北京市朝阳区望京街9号'
            });
        }
    }, [isOpen, task]);

    const mockOrigin = timePhase === 'planned' ? {
        name: '晨会地点 (M3会议室)',
        label: '前序日程目的地'
    } : {
        name: '当前位置',
        label: '实时定位'
    };

    const mockPoi = {
        name: '万科时代中心·望京',
        address: '北京市朝阳区望京街9号 (近方恒国际中心)',
        distance: '13米',
        driveEta: '1分钟',
        walkEta: '1分钟'
    };

    const [commuteStatus, setCommuteStatus] = useState({
        etaMins: 45,
        bufferMins: 10,
        latestDepartAt: '13:05',
        statusType: 'safe'
    });

    // 每次打开新的task，重置状态
    useEffect(() => {
        if (isOpen) {
            setView('detail');
            setDestination(null); // 真实情况可能从task里读
        }
    }, [isOpen, task?.id]);

    useEffect(() => {
        if (!destination) return;
        
        // 模拟通勤计算逻辑
        if (timePhase === 'planned') {
            setCommuteStatus({
                etaMins: 45,
                bufferMins: 10,
                latestDepartAt: '13:05',
                statusType: 'safe' // 可达
            });
        } else {
            setCommuteStatus({
                etaMins: 60,
                bufferMins: 10,
                latestDepartAt: '12:50',
                statusType: 'risk' // 临近且延迟
            });
        }
    }, [destination, timePhase]);

    // Handle close wrapper
    const handleClose = () => {
        if (view !== 'detail') {
            setView('detail');
        } else {
            onClose();
        }
    };

    if (!task) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/40 z-[100]"
                    />

                    {/* Map Selection View (Overlaying the whole screen) */}
                    <AnimatePresence>
                        {(view === 'map-search' || view === 'map-detail') && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute inset-0 bg-slate-100 z-[120] flex flex-col overflow-hidden rounded-[40px]"
                            >
                                {/* Maps Top Bar */}
                                <div className="pt-14 pb-4 px-4 bg-white/80 backdrop-blur-md relative z-10 flex items-center justify-between shadow-sm">
                                    <button onClick={() => setView('detail')} className="w-8 h-8 flex items-center justify-center text-gray-700 bg-gray-100 rounded-full">
                                        <ChevronRight size={20} className="rotate-180" />
                                    </button>
                                    <div className="flex-1 px-3">
                                        <div className="w-full bg-gray-100 rounded-xl flex items-center px-3 py-2">
                                            <Search size={14} className="text-gray-400 mr-2" />
                                            <input 
                                                type="text" 
                                                placeholder="搜索地点..." 
                                                className="bg-transparent border-none outline-none text-xs text-gray-800 w-full placeholder:text-gray-400"
                                                defaultValue={view === 'map-detail' ? mockPoi.name : ''}
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => setView('detail')} className="text-xs font-bold text-gray-500">取消</button>
                                </div>

                                {/* Map Background Simulation (Realistic placeholder) */}
                                <div 
                                    className="flex-1 relative bg-cover bg-center bg-[#efede8]" 
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}
                                >
                                    {/* Blur layer to make the UI elements pop better */}
                                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>

                                    {/* Center Pin */}
                                    <div className="absolute inset-x-0 bottom-[40vh] flex flex-col items-center pointer-events-none transform translate-y-8 animate-[bounce_2s_infinite]">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white relative z-10">
                                            <span className="w-3 h-3 rounded-full bg-white shadow-inner"></span>
                                        </div>
                                        {view !== 'map-detail' && (
                                            <div onClick={() => setView('map-detail')} className="mt-2 pointer-events-auto cursor-pointer drop-shadow-md">
                                                <div className="bg-white rounded-lg px-3 py-1.5 flex flex-col items-center">
                                                    <span className="text-[10px] font-bold text-gray-900">{mockPoi.name}</span>
                                                </div>
                                                <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-transparent border-t-white mx-auto"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Locate Icon */}
                                    <div className={`absolute left-4 transition-all duration-500 ${view === 'map-detail' ? 'bottom-[230px]' : 'bottom-8'}`}>
                                        <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-black">
                                            <LocateFixed size={18} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>

                                {/* Map Bottom Sheet */}
                                <div 
                                    className={`absolute inset-x-0 bottom-0 bg-white rounded-t-[32px] shadow-[0_-5px_30px_rgba(0,0,0,0.1)] transition-transform duration-500 z-50 ${view === 'map-detail' ? 'translate-y-0' : 'translate-y-full'}`}
                                    style={{ paddingBottom: '30px' }}
                                >
                                    <div className="w-full flex justify-center pt-3 pb-4">
                                        <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
                                    </div>
                                    <div className="px-5">
                                        <div className="mb-4">
                                            <h2 className="text-lg font-black text-gray-900 leading-tight">{mockPoi.name}</h2>
                                            <p className="text-[11px] text-gray-500 mt-1 font-medium">{mockPoi.address}</p>
                                        </div>
                                        <div className="flex items-center gap-3 text-[11px] font-bold text-gray-600 mb-5 font-mono">
                                            <span className="text-gray-900">距你 {mockPoi.distance}</span>
                                            <div className="flex items-center gap-1"><Car size={12} className="text-blue-500" /> {mockPoi.driveEta}</div>
                                            <div className="flex items-center gap-1"><span role="img" aria-label="walk">🚶</span> {mockPoi.walkEta}</div>
                                            <button className="text-gray-400">更多</button>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-3 bg-gray-50 rounded-xl flex justify-center gap-1.5 text-[12px] font-bold text-gray-800">
                                                <Navigation size={16} className="text-emerald-500" /> 导航
                                            </button>
                                            <button className="flex-1 py-3 bg-gray-50 rounded-xl flex justify-center gap-1.5 text-[12px] font-bold text-gray-800">
                                                <Car size={16} className="text-indigo-500" /> 打车
                                            </button>
                                            <button className="flex-1 py-3 bg-gray-50 rounded-xl flex justify-center gap-1.5 text-[12px] font-bold text-gray-800">
                                                <Bookmark size={16} className="text-orange-400" /> 收藏
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setDestination(mockPoi);
                                                setView('detail');
                                            }}
                                            className="w-full py-3.5 mt-5 bg-black text-white rounded-2xl text-[14px] font-bold shadow-md active:scale-95 transition-all"
                                        >
                                            设为日程地点
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Native Modal Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: view === 'detail' ? '0%' : '100%' }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                        className="absolute left-0 right-0 bottom-0 top-[60px] bg-[#F9F9F9] rounded-t-[32px] z-[101] flex flex-col overflow-hidden shadow-2xl"
                    >
                        {/* Drag Handle */}
                        <div className="pt-3 pb-1 flex justify-center">
                            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                        </div>

                        {/* Header */}
                        <div className="px-5 py-2 flex items-center justify-between relative">
                            <button onClick={onClose} className="w-9 h-9 bg-gray-200/60 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                                <X size={18} strokeWidth={2.5} />
                            </button>

                            <div className="flex gap-2">
                                <button className="w-9 h-9 border-[1.5px] border-gray-200 rounded-full flex items-center justify-center text-gray-600 bg-white shadow-sm">
                                    <MoreHorizontal size={18} strokeWidth={2.5} />
                                </button>
                                <button onClick={onClose} className="w-9 h-9 border-[1.5px] border-gray-800 text-gray-800 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-800 hover:text-white transition-colors">
                                    <Check size={18} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-4 pb-32 no-scrollbar text-left relative z-0">
                            {/* Title */}
                            <h1 className="text-2xl font-black text-center text-gray-900 mb-6">{task.title}</h1>

                            {/* Date & Time */}
                            <div className="flex items-center justify-between mb-6 px-4">
                                <div className="text-center flex-1">
                                    <p className="text-[11px] font-bold text-gray-400 mb-1">2026.02.28</p>
                                    <p className="text-2xl font-black text-gray-900 leading-none">{task.time || '10:00'}</p>
                                </div>
                                <div className="text-gray-300 px-2 flex-shrink-0 mt-3">
                                    <ChevronRight size={18} strokeWidth={2} />
                                </div>
                                <div className="text-center flex-1">
                                    <p className="text-[11px] font-bold text-gray-400 mb-1">2026.02.28</p>
                                    <p className="text-2xl font-black text-gray-900 leading-none">{task.endTime || '11:00'}</p>
                                </div>
                            </div>

                            {/* Form List */}
                            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100/50 space-y-6">

                                {/* Full Day Toggle */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-gray-800 font-bold text-[14px]">
                                        <Sun size={18} className="text-gray-400" />
                                        <span>全天</span>
                                    </div>
                                    <div className="w-[42px] h-6 bg-gray-300 rounded-full relative">
                                        <div className="absolute left-1 top-1 bottom-1 w-4 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>

                                {/* Reminder */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-gray-800 font-bold text-[14px]">
                                        <Bell size={18} className="text-gray-400" />
                                        <span>提醒时间</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500 font-medium text-[13px]">
                                        <span>{destination ? commuteStatus.latestDepartAt + ' 出发' : '开始前 5 分钟'}</span>
                                        <ChevronRight size={14} className="opacity-50" />
                                    </div>
                                </div>


                                {/* Latest Depart Time (Normal styling) */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-gray-800 font-bold text-[14px]">
                                        <Clock size={18} className="text-gray-400" />
                                        <span>最晚出发时间</span>
                                    </div>
                                    <div className="text-gray-900 font-bold font-mono text-[14px] mr-5">
                                        {destination ? commuteStatus.latestDepartAt : '--:--'}
                                    </div>
                                </div>

                                {/* Origin (Departure Point) */}
                                <div className="flex items-start justify-between pt-4 border-t border-gray-100/60 mt-2 relative">
                                    <div className="absolute left-[8px] top-[30px] bottom-[-16px] w-[2px] bg-gray-100 hidden"></div>
                                    <div className="flex items-start gap-4 text-gray-800 font-bold text-[14px]">
                                        <div className="mt-1 w-4 h-4 rounded-full border-[3px] border-emerald-500/30 flex items-center justify-center relative z-10 bg-white">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                        </div>
                                        <div className="pt-0.5">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">日程起点</p>
                                            <span className="block text-gray-900 leading-tight mb-1">{mockOrigin.name}</span>
                                            <span className={`block text-[11px] font-bold mt-1 px-1.5 py-0.5 inline-block rounded shadow-sm border ${timePhase === 'planned' ? 'text-indigo-600 bg-indigo-50 border-indigo-100/50' : 'text-orange-600 bg-orange-50 border-orange-100/50'}`}>
                                                {mockOrigin.label}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-transparent flex-shrink-0 mt-0.5 select-none">
                                        <ChevronRight size={16} />
                                    </div>
                                </div>

                                {/* Destination Clickable Row */}
                                <div 
                                    className="flex items-start justify-between cursor-pointer group mt-4"
                                    onClick={() => setView('map-search')}
                                >
                                    <div className="flex items-start gap-4 text-gray-800 font-bold text-[14px]">
                                        <div className="mt-0.5 text-gray-400 group-hover:text-indigo-500 transition-colors relative z-10 bg-white">
                                            <MapPin size={18} />
                                        </div>
                                        {destination ? (
                                            <div>
                                                <span className="block text-gray-900">{destination.name}</span>
                                                <span className="block text-[11px] text-gray-400 font-normal mt-1">{destination.address}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 mt-0.5 group-hover:text-indigo-500 transition-colors">添加目的地...</span>
                                        )}
                                    </div>
                                    <div className="text-gray-300 flex-shrink-0 mt-0.5">
                                        <ChevronRight size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Commute ETA UI Block (Only if destination exists) */}
                            {destination && (
                                <div className="mt-4 relative">
                                    <div className="pt-2 flex items-start flex-col gap-3">
                                        {commuteStatus.statusType === 'safe' && (
                                            <div className="w-full bg-emerald-50 rounded-xl p-4 flex justify-between items-center border border-emerald-100/80 shadow-sm">
                                                <div>
                                                    <p className="text-[12px] font-bold text-emerald-800 flex items-center gap-1.5"><Car size={14}/> ETA {commuteStatus.etaMins}m + {commuteStatus.bufferMins}m Buffer</p>
                                                    <p className="text-[11px] text-emerald-600/90 mt-1 font-medium">按当前路况，您可准时抵达</p>
                                                </div>
                                                <div className="bg-white px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm text-center">
                                                    <p className="text-[9px] font-bold text-emerald-500 mb-0.5">剩余时间</p>
                                                    <p className="text-[16px] font-black text-emerald-700 font-mono leading-none">充足</p>
                                                </div>
                                            </div>
                                        )}

                                        {commuteStatus.statusType === 'risk' && timePhase === 'near' && (
                                            <div className="w-full bg-orange-50 rounded-xl p-4 border border-orange-200/80 shadow-sm">
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <AlertTriangle size={15} className="text-orange-500" />
                                                    <p className="text-[13px] font-bold text-orange-800">按实时路况可能迟到</p>
                                                </div>
                                                <p className="text-[11px] text-orange-700/80 leading-relaxed mb-4 font-medium">
                                                    通勤约 {commuteStatus.etaMins} 分钟。若现在出发，抵达时将超过预定开始时间。
                                                </p>
                                                <div className="flex gap-2.5">
                                                    <button className="flex-1 py-2.5 bg-orange-100/80 rounded-lg text-[12px] font-bold text-orange-800 hover:bg-orange-200 transition-colors">调整时间</button>
                                                    <button className="flex-1 py-2.5 bg-white rounded-lg text-[12px] font-bold text-orange-600 shadow-sm border border-orange-200/50 hover:bg-orange-50 transition-colors">立即导航</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Bottom Floating Bar */}
                        {view === 'detail' && (
                            <div className="absolute bottom-6 inset-x-6 z-10">
                                <button className="w-full bg-white py-3.5 rounded-[24px] shadow-sm border border-gray-100 flex items-center justify-center gap-2 text-gray-500 font-bold text-[13px] hover:scale-[1.02] active:scale-95 transition-transform">
                                    <Mic size={16} />
                                    <span>按住说话</span>
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};


