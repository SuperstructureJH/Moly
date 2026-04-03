import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TodosDemo from './src/pages/TodosDemo';
import SchedulesDemo from './src/pages/SchedulesDemo';
import Playground from './src/pages/Playground';
import ContactsDemo from './src/pages/ContactsDemo';
import MyCardDemo from './src/pages/MyCardDemo';
import ContactCardDemo from './src/pages/ContactCardDemo';
import SupervisionDemo from './src/pages/SupervisionDemo';
import DigitalCard07Demo from './src/pages/DigitalCard07Demo';
import DigitalCard08Demo from './src/pages/DigitalCard08Demo';
import MemorySystemDemo from './src/pages/MemorySystemDemo';
import { CheckSquare, Calendar, ArrowRight, Palette, Users, Bell, CreditCard, Map } from 'lucide-react';

function Home() {
    const demos = [
        {
            id: 'workspace',
            title: 'Moly 工作台 (Moly 0.8)',
            description: '主工作台入口：日程/待办、联系人、会议记录、记忆四个 tab，联系人里已串入“我的数字名片”完整链路。',
            icon: <CheckSquare className="text-blue-500" size={24} />,
            path: '/todos',
            color: 'bg-blue-50 border-blue-100',
        },
        {
            id: 'schedules',
            title: '日程原型 (Moly 0.6) 全新版',
            description: '基于 iOS 沙盒重构，深度集成带有通勤算量与ETA分析预警的地图选点面板。',
            icon: <Calendar className="text-purple-500" size={24} />,
            path: '/schedules',
            color: 'bg-purple-50 border-purple-100',
        },
        {
            id: 'playground',
            title: 'UI Playground',
            description: '所有UI组件（按钮、标签、导航栏等）汇总，方便按序号沟通参考。',
            icon: <Palette className="text-rose-500" size={24} />,
            path: '/playground',
            color: 'bg-rose-50 border-rose-100',
        },
        {
            id: 'contacts',
            title: '联系人与名片 (独立预览)',
            description: '独立查看联系人与“我的数字名片”原型，适合单独演示这条链路。',
            icon: <Users className="text-teal-500" size={24} />,
            path: '/contacts',
            color: 'bg-teal-50 border-teal-100',
        },
        {
            id: 'supervision',
            title: '督办流程演示',
            description: '双手机视角演示：督办消息送达被督办人 → 点击反馈 → 结果实时回传给督办发起人。',
            icon: <Bell className="text-orange-500" size={24} />,
            path: '/supervision-demo',
            color: 'bg-orange-50 border-orange-100',
        },
        {
            id: 'digital-card-07',
            title: '数字名片 (Moly 0.7)',
            description: '极致聚合的第一期对外数字名片，突出“我在做什么”与“你可以来找我聊”。',
            icon: <CreditCard className="text-emerald-500" size={24} />,
            path: '/digital-card-07',
            color: 'bg-emerald-50 border-emerald-100',
        },
        {
            id: 'digital-card-08',
            title: '五行数字名片 (Moly 0.8)',
            description: '基于五行（金木水火土）的强分子化设计尝试，一套数据适应5种截然不同的人格风格。',
            icon: <CreditCard className="text-blue-500" size={24} />,
            path: '/digital-card-08',
            color: 'bg-blue-50 border-blue-100',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-20 px-4 font-sans">
            <div className="max-w-6xl w-full">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 text-center">
                    Moly 原型演示中心
                </h1>
                <p className="text-slate-500 text-center mb-12">
                    所有正在开发或已完成的概念原型演示集合。选择一个查看交互效果。
                </p>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {demos.slice().reverse().map((demo) => (
                        <Link
                            key={demo.id}
                            to={demo.path}
                            className={`group flex flex-col bg-white rounded-3xl p-6 shadow-sm border ${demo.color} hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden`}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                                {demo.icon}
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">{demo.title}</h2>
                            <p className="text-sm text-slate-500 flex-1 leading-relaxed">
                                {demo.description}
                            </p>

                            <div className="mt-6 flex items-center text-sm font-bold text-slate-700 opacity-60 group-hover:opacity-100 transition-opacity">
                                查看演示 <ArrowRight size={16} className="ml-1 tracking-normal group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/todos" element={<TodosDemo />} />
                <Route path="/schedules" element={<SchedulesDemo />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="/contacts" element={<ContactsDemo />} />
                <Route path="/my-card" element={<MyCardDemo />} />
                <Route path="/contact-card" element={<ContactCardDemo />} />
                <Route path="/supervision-demo" element={<SupervisionDemo />} />
                <Route path="/digital-card-07" element={<DigitalCard07Demo />} />
                <Route path="/digital-card-08" element={<DigitalCard08Demo />} />
                <Route path="/memory-system" element={<MemorySystemDemo />} />
            </Routes>
        </BrowserRouter>
    );
}
