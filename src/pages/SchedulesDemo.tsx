import { useState, useMemo } from 'react';
import {
    Menu, CheckCircle2, Circle, Clock, Plus, Settings, Search, Bell, Compass, MessageSquare, ChevronRight, X, Check, MapPin, LocateFixed, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScheduleDetailModal, { type CoreTask } from '../components/ScheduleDetailModal';

const SchedulesDemo = () => {
    const [selectedDate] = useState('28');
    const [selectedTask, setSelectedTask] = useState<CoreTask | null>(null);
    const [timePhase, setTimePhase] = useState<'planned' | 'near'>('planned');
    
    // Sidebar & Setting states
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMapSettingOpen, setIsMapSettingOpen] = useState(false);
    const [defaultOriginName, setDefaultOriginName] = useState('百度科技园');

    // --- 核心数据 ---
    const [tasks, setTasks] = useState<CoreTask[]>([
        { id: 101, date: '27', time: '09:00', endTime: '10:00', title: '晨会', type: 'event', color: 'bg-gray-800', priority: 2, goal: '工作', energy: 'high', context: 'work', impact: 85 },
        { id: 102, date: '27', time: '14:00', endTime: '15:30', title: '客户需求对齐', type: 'event', color: 'bg-blue-600', priority: 3, goal: '工作', energy: 'high', context: 'work', impact: 90 },

        { id: 1, date: '28', time: '10:00', title: '整理账单', type: 'task', completed: true, priority: 2, goal: '财务', energy: 'low', context: 'home', impact: 30 },
        { id: 11, date: '28', time: '11:00', endTime: '12:00', title: '架构评审会', type: 'event', color: 'bg-indigo-600', priority: 3, goal: '工作', energy: 'high', context: 'work', impact: 85 },
        { id: 12, date: '28', time: '13:00', title: '取回干洗的衣服', type: 'task', completed: false, priority: 1, goal: '生活', energy: 'low', context: 'on-the-go', impact: 10 },
        { id: 13, date: '28', time: '14:30', endTime: '15:30', title: '冥想与复盘', type: 'event', color: 'bg-emerald-500', priority: 2, goal: '健康', energy: 'medium', context: 'home', impact: 60 },
        { id: 2, date: '28', time: '16:00', endTime: '17:30', title: '客户拜访·Alpha', type: 'event', color: 'bg-blue-600', priority: 2, goal: '工作', energy: 'high', context: 'on-the-go', impact: 95 },
        { id: 3, date: '28', time: '17:30', endTime: '18:15', title: '洗车', type: 'event', color: 'bg-sky-500', priority: 1, goal: '生活', energy: 'low', context: 'on-the-go', impact: 20 },
        { id: 10, date: '28', time: '18:00', endTime: '19:00', title: '产品例会', type: 'event', color: 'bg-indigo-600', priority: 3, goal: '工作', energy: 'high', context: 'work', impact: 80 },
        { id: 14, date: '28', time: '19:30', title: '回复团队周报', type: 'task', completed: false, priority: 2, goal: '工作', energy: 'low', context: 'home', impact: 40 },
        { id: 4, date: '28', time: '20:00', endTime: '21:00', title: '买花', description: '需提前预约', type: 'event', color: 'bg-rose-500', priority: 1, goal: '社交', energy: 'low', context: 'on-the-go', impact: 50 },
        { id: 15, date: '28', time: '21:30', endTime: '22:30', title: '阅读《Naval宝典》', type: 'event', color: 'bg-amber-500', priority: 2, goal: '自我提升', energy: 'medium', context: 'home', impact: 70 },
        { id: 5, date: '28', time: '23:00', title: '还清信用卡', type: 'task', completed: false, priority: 3, goal: '财务', energy: 'medium', context: 'home', impact: 100 },
    ]);

    const toggleTask = (id: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const currentDayTasks = useMemo(() => {
        return tasks.filter(item => item.date === selectedDate).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    }, [selectedDate, tasks]);

    const [viewMode, setViewMode] = useState<'events' | 'tasks'>('events');

    // --- 真机渲染包裹器 ---
    return (
        <div className="flex-1 min-h-screen bg-[#DEDDE3] flex items-center justify-center p-8 font-sans">
            
            <div className="text-gray-500 absolute top-10 flex flex-col items-center">
                <p className="text-sm font-bold tracking-widest uppercase mb-1">Moly Schedule 0.6 prototype</p>
                <p className="text-xs">点击日程列表中的「事件」，进入详情操作地图选点</p>
            </div>

            {/* Simulation Controls Sidebar */}
            <div className="absolute left-8 top-1/3 bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-white/40 flex flex-col gap-5 w-72 z-50">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Clock size={16} className="text-indigo-500" />
                    <h3 className="text-[13px] font-black text-gray-800 tracking-wider">系统时间相态模拟</h3>
                </div>
                <div className="space-y-3">
                    <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-2xl border-2 transition-all ${timePhase === 'planned' ? 'border-indigo-500 bg-indigo-50/50' : 'border-transparent hover:bg-gray-50'}`}>
                        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                            <input type="radio" className="peer sr-only" checked={timePhase === 'planned'} onChange={() => setTimePhase('planned')} />
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 peer-checked:border-indigo-500 flex items-center justify-center">
                                <div className={`w-2 h-2 rounded-full bg-indigo-500 transition-transform ${timePhase === 'planned' ? 'scale-100' : 'scale-0'}`}></div>
                            </div>
                        </div>
                        <div>
                            <p className={`text-[13px] font-bold ${timePhase === 'planned' ? 'text-indigo-900' : 'text-gray-700'}`}>规划阶段 (&gt; 2h)</p>
                            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">日程起点使用：<br/>前序日程目的地</p>
                        </div>
                    </label>

                    <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-2xl border-2 transition-all ${timePhase === 'near' ? 'border-orange-500 bg-orange-50/50' : 'border-transparent hover:bg-gray-50'}`}>
                        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                            <input type="radio" className="peer sr-only" checked={timePhase === 'near'} onChange={() => setTimePhase('near')} />
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 peer-checked:border-orange-500 flex items-center justify-center">
                                <div className={`w-2 h-2 rounded-full bg-orange-500 transition-transform ${timePhase === 'near' ? 'scale-100' : 'scale-0'}`}></div>
                            </div>
                        </div>
                        <div>
                            <p className={`text-[13px] font-bold ${timePhase === 'near' ? 'text-orange-900' : 'text-gray-700'}`}>临近阶段 (&lt; 2h)</p>
                            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">日程起点使用：<br/>当前位置 (实时定位)</p>
                        </div>
                    </label>
                </div>
            </div>

            {/* iOS Device Frame Container */}
            <div className="w-[393px] h-[852px] bg-[#F4F4F5] rounded-[55px] shadow-[0_30px_80px_rgba(0,0,0,0.15)] relative overflow-hidden flex flex-col border-[12px] border-black isolate">
                
                {/* iPhone Dynamic Island / Notch */}
                <div className="absolute top-0 inset-x-0 h-7 bg-black z-50 rounded-b-3xl w-[120px] mx-auto flex items-center justify-end px-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-900/60 shadow-[0_0_4px_#34d399] animate-pulse"></div>
                </div>

                {/* Status Bar */}
                <div className="h-12 w-full pt-4 px-6 flex items-center justify-between text-[12px] font-bold text-gray-900 z-40 bg-white/80 backdrop-blur-md">
                    <span className="mt-1 ml-2">9:41</span>
                    <div className="flex items-center gap-1.5 mt-1 mr-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
                        <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20 18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16zm-5-8h2v4h-2v-4z"></path></svg>
                    </div>
                </div>

                <header className="px-6 pt-2 pb-4 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-end justify-between shadow-sm">
                    <div>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1.5 ml-0.5">Today, 28th</p>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-none">日  程</h1>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 shadow-sm border border-gray-100/80"><Search size={16} strokeWidth={2.5}/></button>
                        <button className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20"><Plus size={20} strokeWidth={2.5}/></button>
                        <button 
                            onClick={() => setIsSidebarOpen(true)} 
                            className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-800 shadow-sm border border-gray-100/80 transition-colors hover:bg-gray-100 active:scale-95"
                        >
                            <Menu size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                </header>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto no-scrollbar bg-[#F4F4F5] pb-24 px-5 pt-4">
                    
                    {/* Segmented Control */}
                    <div className="flex bg-gray-200/60 p-1 rounded-2xl shadow-inner w-full mb-6 relative">
                        <div className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-spring ${viewMode === 'tasks' ? 'translate-x-[96%]' : 'translate-x-0'}`}></div>
                        <button onClick={() => setViewMode('events')} className={`flex-1 py-1.5 rounded-xl text-[13px] font-bold z-10 transition-colors ${viewMode === 'events' ? 'text-black' : 'text-gray-500'}`}>时间流 (Events)</button>
                        <button onClick={() => setViewMode('tasks')} className={`flex-1 py-1.5 rounded-xl text-[13px] font-bold z-10 transition-colors ${viewMode === 'tasks' ? 'text-black' : 'text-gray-500'}`}>库 (Tasks)</button>
                    </div>

                    {/* Task List */}
                    <div className="space-y-4 relative">
                        <div className="absolute left-[18px] top-6 bottom-6 w-[2px] bg-gray-200 z-0"></div>

                        {currentDayTasks
                            .filter(tk => viewMode === 'events' ? tk.type === 'event' : tk.type === 'task')
                            .map(tk => (
                                <motion.div 
                                    whileTap={{ scale: 0.98 }}
                                    key={tk.id} 
                                    onClick={() => tk.type === 'task' ? toggleTask(tk.id) : setSelectedTask(tk)} 
                                    className={`relative z-10 cursor-pointer p-4 rounded-3xl border transition-all flex items-start gap-4 
                                        ${tk.completed ? 'opacity-40 grayscale bg-gray-50' : 'bg-white border-white hover:border-indigo-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'}`}
                                >
                                    <div className="mt-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                                        {tk.type === 'task' ? (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleTask(tk.id); }}
                                                className="hover:scale-110 transition-transform"
                                            >
                                                {tk.completed ? <CheckCircle2 size={20} className="text-green-500" /> : <Circle size={20} className="text-gray-200" />}
                                            </button>
                                        ) : (
                                            <div className={`w-3 h-3 rounded-full ${tk.color}`}></div>
                                        )}
                                    </div>

                                    <div className="flex-1 pt-0.5">
                                        <p className={`font-bold text-[15px] ${tk.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{tk.title}</p>
                                        <span className="text-[11px] font-mono text-gray-500 font-bold mt-1.5 block tracking-tight">
                                            {tk.time} {tk.endTime ? `- ${tk.endTime}` : ''}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                </div>

                {/* Bottom Main Navigation (Fake) */}
                <div className="absolute bottom-0 inset-x-0 h-20 bg-white/90 backdrop-blur-md border-t border-gray-100 flex justify-between px-8 pt-3 pb-8 z-40">
                    <button className="flex flex-col items-center gap-1 text-black"><CheckCircle2 size={20} strokeWidth={2.5}/></button>
                    <button className="flex flex-col items-center gap-1 text-gray-400"><Compass size={20} strokeWidth={2.5}/></button>
                    <button className="flex flex-col items-center gap-1 text-gray-400"><MessageSquare size={20} strokeWidth={2.5}/></button>
                    <button className="flex flex-col items-center gap-1 text-gray-400"><Settings size={20} strokeWidth={2.5}/></button>
                </div>

                {/* Hardware indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full z-50"></div>

                {/* Overlaid Modal Flow Inside the App Container */}
                <ScheduleDetailModal 
                    isOpen={!!selectedTask} 
                    onClose={() => setSelectedTask(null)} 
                    task={selectedTask} 
                    timePhase={timePhase}
                />

                {/* Left Drawer (Calendar Management Sidebar) */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div className="absolute inset-0 z-[100] flex">
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setIsSidebarOpen(false)}
                                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                            />
                            <motion.div
                                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="absolute right-0 w-[300px] h-full bg-[#f2f2f7] flex flex-col shadow-2xl"
                            >
                                {/* Title */}
                                <div className="pt-[72px] px-5 pb-4">
                                    <h2 className="text-[22px] font-bold text-black tracking-tight">日历管理</h2>
                                </div>

                                {/* Calendar list - iOS grouped style */}
                                <div className="flex-1 overflow-y-auto">
                                    <div className="bg-white mx-0 border-y border-gray-200/70">
                                        {/* Feishu header row */}
                                        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
                                            <div className="w-[28px] h-[28px] bg-[#337CF5] rounded-[7px] flex items-center justify-center text-white shrink-0">
                                                <span className="text-[13px] font-black">飞</span>
                                            </div>
                                            <span className="font-semibold text-[16px] text-gray-900">飞书</span>
                                        </div>
                                        {/* Calendar rows with hairline dividers */}
                                        {[
                                            { name: '董江涵' },
                                            { name: '18600241181djh@gmail.com' },
                                            { name: '家庭' },
                                        ].map((item, i, arr) => (
                                            <div key={item.name} className={`flex items-center gap-4 px-5 py-3.5 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                                <div className="w-5 h-5 rounded-[5px] bg-[#337CF5] flex items-center justify-center text-white shrink-0">
                                                    <Check size={11} strokeWidth={3.5} />
                                                </div>
                                                <span className="text-[15px] text-gray-800 truncate">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom setting rows - iOS style */}
                                <div className="pb-16 pt-2 space-y-2">
                                    <div 
                                        onClick={() => { setIsSidebarOpen(false); setIsMapSettingOpen(true); }}
                                        className="bg-white border-y border-gray-200/70 flex items-center justify-between px-5 py-4 cursor-pointer active:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-[16px] text-gray-900">日程默认出发地点</span>
                                        <ChevronRight size={17} className="text-gray-400" />
                                    </div>
                                    <div className="bg-white border-y border-gray-200/70 flex items-center justify-between px-5 py-4 cursor-pointer active:bg-gray-50 transition-colors">
                                        <span className="text-[16px] text-gray-900">设置</span>
                                        <ChevronRight size={17} className="text-gray-400" />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Map Settings Screen */}
                <AnimatePresence>
                    {isMapSettingOpen && (
                        <motion.div 
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute inset-0 bg-[#efede8] z-[120] flex flex-col overflow-hidden"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }}
                        >
                            {/* Blur overlay for the map */}
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>

                            {/* Header */}
                            <div className="relative pt-[50px] pb-4 px-2 bg-white/95 backdrop-blur-md shadow-sm z-20 flex items-center gap-2">
                                <button onClick={() => setIsMapSettingOpen(false)} className="w-[44px] h-[44px] flex items-center justify-center rounded-full text-gray-900 active:bg-gray-100 transition-colors">
                                    <ChevronLeft size={24} strokeWidth={2.5}/>
                                </button>
                                <div>
                                    <h2 className="text-[16px] font-black text-gray-900 leading-tight">用户默认出发地点</h2>
                                    <p className="text-[11px] font-medium text-gray-500 mt-0.5">无前序日程时，将以此处计算通勤时间</p>
                                </div>
                            </div>
                            
                            {/* Search Input Floating */}
                            <div className="relative px-4 py-4 z-20">
                                <div className="bg-white rounded-2xl p-0.5 shadow-lg border border-gray-100/50 flex items-center">
                                    <div className="pl-4 pr-2 text-gray-400"><Search size={18} strokeWidth={2.5}/></div>
                                    <input type="text" placeholder="搜索地点..." defaultValue={defaultOriginName} className="w-full bg-transparent py-3.5 pr-4 text-[15px] font-bold text-gray-900 outline-none placeholder:text-gray-400" />
                                </div>
                            </div>

                            {/* Map Center elements */}
                            <div className="absolute inset-x-0 bottom-[40vh] flex flex-col items-center pointer-events-none transform translate-y-8 animate-[bounce_2s_infinite] z-20">
                                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg border-2 border-white relative z-10">
                                    <span className="w-3 h-3 rounded-full bg-white shadow-inner"></span>
                                </div>
                            </div>

                            {/* Bottom Card */}
                            <div className="absolute bottom-8 inset-x-4 z-20">
                                <div className="bg-white rounded-[28px] p-5 shadow-2xl shadow-indigo-500/10 border border-gray-100">
                                    <div className="flex justify-between items-start mb-6 px-1">
                                        <div>
                                            <h3 className="text-[20px] font-black text-gray-900 tracking-tight">{defaultOriginName}</h3>
                                            <p className="text-[12px] font-bold text-gray-500 mt-1">北京市海淀区西北旺东路10号院</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setIsMapSettingOpen(false);
                                            // In a real app we would save this to the user context
                                        }}
                                        className="w-full bg-black text-white py-4 rounded-[16px] text-[15px] font-bold shadow-md hover:bg-gray-800 active:scale-[0.98] transition-all"
                                    >
                                        设为默认出发点
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SchedulesDemo;
