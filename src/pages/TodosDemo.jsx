import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Circle,
    Clock,
    UserCircle2,
    ChevronRight,
    Plus,
    X,
    Edit2,
    Trash2,
    Calendar,
    Bell,
    ChevronLeft,
    Users,
    Mic,
    LayoutGrid,
    Sparkles,
    CheckSquare,
    ChevronDown,
    ChevronUp,
    Tag as TagIcon,
    MoreHorizontal,
    Search,
    Check,
    UserPlus,
    ListTodo,
    LayoutList,
    ArrowUp,
    BatteryCharging,
    BatteryMedium,
    Battery,
    MapPin,
    Navigation,
    Map,
    Menu,
    Brain,
    MessageCircle
} from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ContactsPhoneList } from './ContactsDemo';
import { MyCardPhoneView } from './MyCardDemo';
import MeetingsDemo from './MeetingsDemo';
import { getMiniMaxText, requestMiniMaxChat, stripThinkTags } from '../lib/minimax';

// --- Utility Functions ---
const isOverdue = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
};

const isToday = (date) => {
    if (!date) return false;
    const d = new Date(date);
    const today = new Date();
    return d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();
};

const formatTimeDisplay = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const hour = d.getHours().toString().padStart(2, '0');
    const minute = d.getMinutes().toString().padStart(2, '0');
    if (isToday(d)) return `今天 ${hour}:${minute}`;
    return `${d.getMonth() + 1}月${d.getDate()}日 ${hour}:${minute}`;
};

const formatAssistantTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const hour = d.getHours().toString().padStart(2, '0');
    const minute = d.getMinutes().toString().padStart(2, '0');
    return `${hour}:${minute}`;
};

const formatAssistantMoment = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isToday(d)) return `今天 ${formatAssistantTime(d)}`;
    return `${d.getMonth() + 1}月${d.getDate()}日 ${formatAssistantTime(d)}`;
};

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === "undefined") return initialValue;
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
}

// A task is considered a Schedule Event if it has a strict `start_time` and `end_time`
const isEventTask = (task) => {
    return task.start_time && task.end_time;
};

// --- Mock Data ---
const INITIAL_TAGS = [
    { id: 't1', name: '工作', color: 'bg-blue-50 text-blue-600' },
    { id: 't2', name: '生活', color: 'bg-green-50 text-green-600' },
    { id: 't3', name: '紧急', color: 'bg-red-50 text-red-600' },
    { id: 't4', name: '学习', color: 'bg-purple-50 text-purple-600' },
    { id: 't5', name: '健康', color: 'bg-orange-50 text-orange-600' },
];

const INITIAL_CONTACTS = [
    { id: 'c1', name: '张经理', role: '部门主管', avatar: '张' },
    { id: 'c2', name: '李秘书', role: '行政', avatar: '李' },
    { id: 'c3', name: '王总', role: 'CEO', avatar: '王' },
    { id: 'c4', name: '赵助理', role: '助理', avatar: '赵' },
    { id: 'c5', name: '陈工程师', role: '技术专家', avatar: '陈' },
];

const INITIAL_TODOS = [
    {
        id: '1',
        title: '修改项目年度方案',
        status: 'unfinished',
        due_time: new Date(Date.now() - 86400000).toISOString(),
        reminder_times: [],
        created_at: new Date(Date.now() - 172800000).toISOString(),
        supervision: { enabled: true, contact_id: '张经理', result: 'in_progress' },
        tag_id: 't3',
        energy: 'high'
    },
    {
        id: '2',
        title: '提交本周周报',
        status: 'unfinished',
        due_time: new Date(new Date().setHours(23, 59)).toISOString(),
        reminder_times: [new Date(new Date().setHours(18, 0)).toISOString()],
        created_at: new Date().toISOString(),
        supervision: { enabled: false, contact_id: '', result: 'unreachable' },
        tag_id: 't1',
        energy: 'medium'
    },
    {
        id: '3',
        title: '预约周末牙科检查',
        status: 'unfinished',
        due_time: null,
        reminder_times: [new Date(Date.now() + 86400000).toISOString()],
        created_at: new Date().toISOString(),
        supervision: { enabled: false, contact_id: '', result: 'unreachable' },
        tag_id: 't2',
        energy: 'low'
    },
    {
        id: '4',
        title: '准备下午的设计评审',
        status: 'unfinished',
        due_time: new Date(new Date().setHours(15, 0)).toISOString(),
        reminder_times: [new Date(new Date().setHours(14, 30)).toISOString()],
        created_at: new Date(Date.now() - 36000000).toISOString(),
        supervision: { enabled: false, contact_id: '', result: null },
        tag_id: 't1',
        energy: 'high'
    },
    {
        id: '5',
        title: '取下周出差的高铁票',
        status: 'unfinished',
        due_time: new Date(Date.now() + 172800000).toISOString(),
        reminder_times: [],
        created_at: new Date().toISOString(),
        supervision: { enabled: false, contact_id: '', result: null },
        tag_id: 't2',
        energy: 'low'
    },
    {
        id: '6',
        title: '阅读《深度工作》第二章',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date(Date.now() - 7200000).toISOString(),
        supervision: { enabled: false, contact_id: '', result: null },
        tag_id: 't4',
        energy: 'high'
    },
    {
        id: '7',
        title: '和前端对接API接口文档',
        status: 'unfinished',
        due_time: new Date(new Date().setHours(14, 0)).toISOString(),
        reminder_times: [new Date(new Date().setHours(13, 0)).toISOString()],
        created_at: new Date(Date.now() - 86400000).toISOString(),
        supervision: { enabled: true, contact_id: '陈工程师', result: 'unreachable' },
        tag_id: 't1',
        energy: 'medium'
    },
    {
        id: '8',
        title: '买牛奶和鸡蛋',
        status: 'unfinished',
        due_time: null,
        reminder_times: [new Date(new Date().setHours(19, 0)).toISOString()],
        created_at: new Date().toISOString(),
        supervision: { enabled: false, contact_id: '', result: null },
        tag_id: 't2',
        energy: 'low'
    },
    {
        id: '9',
        title: '撰写季度产品规划',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date(Date.now() - 3600000).toISOString(),
        supervision: { enabled: false, contact_id: '', result: null },
        tag_id: 't1',
        energy: 'high'
    },
    {
        id: '10',
        title: '深度重构订单服务代码',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date(Date.now() - 7200000).toISOString(),
        supervision: { enabled: true, contact_id: '陈工程师', result: 'in_progress' },
        tag_id: 't1',
        energy: 'high'
    },
    {
        id: '11',
        title: '审批本部门本月报销单',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date(Date.now() - 100000).toISOString(),
        supervision: { enabled: false, contact_id: '', result: null },
        tag_id: 't1',
        energy: 'medium'
    },
    {
        id: '12',
        title: '和产品经理同步新需求',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date(Date.now() - 864000).toISOString(),
        supervision: { enabled: true, contact_id: '王总', result: null },
        tag_id: 't1',
        energy: 'medium'
    },
    {
        id: '13',
        title: '清理桌面不再使用的文件',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date(Date.now() - 10000000).toISOString(),
        supervision: { enabled: false, contact_id: '', result: null },
        tag_id: 't1',
        energy: 'low'
    },
    {
        id: '14',
        title: '给绿植浇一次水',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date(Date.now() - 5000000).toISOString(),
        supervision: { enabled: false, contact_id: '', result: null },
        tag_id: 't2',
        energy: 'low'
    },
    // --- Additional High Energy Tasks ---
    {
        id: '15',
        title: '完成核心算法模块开发',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date(Date.now() - 4000000).toISOString(),
        supervision: { enabled: true, contact_id: '陈工程师', result: null },
        tag_id: 't1',
        energy: 'high'
    },
    {
        id: '16',
        title: '准备A轮融资路演PPT',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date(Date.now() - 80000000).toISOString(),
        supervision: { enabled: false },
        tag_id: 't1',
        energy: 'high'
    },
    {
        id: '17',
        title: '撰写年度财务审计报告',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date(Date.now() - 50000000).toISOString(),
        supervision: { enabled: true, contact_id: '王总', result: 'in_progress' },
        tag_id: 't1',
        energy: 'high'
    },
    {
        id: '18',
        title: '学习并掌握React 19新特性',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date(Date.now() - 1000000).toISOString(),
        supervision: { enabled: false },
        tag_id: 't4',
        energy: 'high'
    },
    {
        id: '19',
        title: '复盘本季度营销活动数据',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date(Date.now() - 20000000).toISOString(),
        supervision: { enabled: false },
        tag_id: 't1',
        energy: 'high'
    },
    // --- Additional Medium Energy Tasks ---
    {
        id: '20',
        title: '回复所有未读工作邮件',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date().toISOString(),
        supervision: { enabled: false },
        tag_id: 't1',
        energy: 'medium'
    },
    {
        id: '21',
        title: '整理上周会议的纪要',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date(Date.now() - 10000000).toISOString(),
        supervision: { enabled: false },
        tag_id: 't1',
        energy: 'medium'
    },
    {
        id: '22',
        title: '和运营同事确认首发物料',
        status: 'unfinished',
        due_time: null,
        reminder_times: [new Date(Date.now() + 3600000).toISOString()],
        created_at: new Date().toISOString(),
        supervision: { enabled: true, contact_id: '张经理', result: 'unreachable' },
        tag_id: 't1',
        energy: 'medium'
    },
    {
        id: '23',
        title: '更新团队资源共享文档',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date(Date.now() - 500000).toISOString(),
        supervision: { enabled: false },
        tag_id: 't1',
        energy: 'medium'
    },
    {
        id: '24',
        title: '安排下周的跨部门沟通会议',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date(Date.now() - 1200000).toISOString(),
        supervision: { enabled: true, contact_id: '李秘书', result: null },
        tag_id: 't1',
        energy: 'medium'
    },
    // --- Additional Low Energy Tasks ---
    {
        id: '25',
        title: '喝一杯水, 站起来拉伸5分钟',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date().toISOString(),
        supervision: { enabled: false },
        tag_id: 't5',
        energy: 'low'
    },
    {
        id: '26',
        title: '把手机设为免打扰模式',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date().toISOString(),
        supervision: { enabled: false },
        tag_id: 't2',
        energy: 'low'
    },
    {
        id: '27',
        title: '清理微信缓存空间',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date(Date.now() - 86400000).toISOString(),
        supervision: { enabled: false },
        tag_id: 't2',
        energy: 'low'
    },
    {
        id: '28',
        title: '把明天要带的资料放进包里',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date().toISOString(),
        supervision: { enabled: false },
        tag_id: 't2',
        energy: 'low'
    },
    {
        id: '29',
        title: '给电脑屏幕除个尘',
        status: 'unfinished',
        due_time: null,
        reminder_times: [],
        created_at: new Date(Date.now() - 400000).toISOString(),
        supervision: { enabled: false },
        tag_id: 't2',
        energy: 'low'
    },
    {
        id: '101',
        title: '回复李总的商务邮件',
        status: 'finished',
        due_time: new Date(Date.now() - 4000000).toISOString(),
        finished_at: new Date(Date.now() - 1000000).toISOString(),
        reminder_times: [],
        created_at: new Date(Date.now() - 86400000).toISOString(),
        supervision: { enabled: false },
        tag_id: 't1',
        energy: 'medium'
    },
    {
        id: '102',
        title: '晨跑 5km',
        status: 'finished',
        due_time: new Date(new Date().setHours(8, 0)).toISOString(),
        finished_at: new Date(new Date().setHours(7, 45)).toISOString(),
        reminder_times: [],
        created_at: new Date(Date.now() - 86400000).toISOString(),
        supervision: { enabled: false },
        tag_id: 't5',
        energy: 'high'
    },
    {
        id: '103',
        title: '交电费',
        status: 'finished',
        due_time: null,
        finished_at: new Date(Date.now() - 86400000).toISOString(),
        reminder_times: [],
        created_at: new Date(Date.now() - 172800000).toISOString(),
        supervision: { enabled: false },
        tag_id: 't2',
        energy: 'low'
    },
    {
        id: '104',
        title: '梳理V1.0发版清单',
        status: 'finished',
        due_time: new Date(Date.now() - 7200000).toISOString(),
        finished_at: new Date(Date.now() - 3600000).toISOString(),
        reminder_times: [],
        created_at: new Date(Date.now() - 259200000).toISOString(),
        supervision: { enabled: true, contact_id: '李秘书', result: 'claimed_done' },
        tag_id: 't3',
        energy: 'high'
    }
];

const MEMORY_TAGS = ['全部', '待确认', '身份', '偏好', '习惯', '风格', '关系', '决策', '近况'];

const INITIAL_MEMORIES = [
    { id: 'm1', tag: '身份', text: '我叫董江涵，在 Moly 担任产品负责人。', confirmed: true, updatedAt: '2026-01-15',
        detail: { source: '用户主动输入', time: '2026-01-15', related: [{ type: 'contact', name: '董江涵（本人）' }] } },
    { id: 'm2', tag: '身份', text: '常用的昵称有"东江""DJ""DJ哥"，在聊天中出现时均指向我。', confirmed: true, updatedAt: '2026-03-10',
        detail: { source: '聊天记录中多次出现', time: '2026-02-03', related: [{ type: 'chat', name: '与 Kevin 的聊天' }] } },
    { id: 'm3', tag: '身份', text: '手机号 138****8888、邮箱 dongjiang@moly.ai 属于我本人，不要识别为其他联系人。', confirmed: true, updatedAt: '2026-01-15',
        detail: { source: '用户确认', time: '2026-01-15', related: [] } },
    { id: 'm4', tag: '关系', text: '王总（某某资本 Managing Partner）是最重要的投资人，他催材料的频率代表紧急度。', confirmed: true, updatedAt: '2026-03-22',
        detail: { source: '"王总是我们这边最重要的投资人，他上周催了两次材料。"', time: '2026-03-22', related: [{ type: 'contact', name: '王总' }, { type: 'chat', name: '与王总的聊天' }] } },
    { id: 'm5', tag: '关系', text: 'Kevin 是工程负责人，负责记忆系统后端架构，每周有技术对齐。', confirmed: false, updatedAt: '2026-03-24',
        detail: { source: '技术周会纪要', time: '2026-03-24', related: [{ type: 'contact', name: 'Kevin' }, { type: 'meeting', name: '3/24 技术周会' }] } },
    { id: 'm6', tag: '关系', text: '张律师是外部法务顾问，负责数据隐私条款审核。', confirmed: false, updatedAt: '2026-03-12',
        detail: { source: '"法务这边找张律师确认数据留存条款。"', time: '2026-03-12', related: [{ type: 'contact', name: '张律师' }] } },
    { id: 'm7', tag: '偏好', text: '商务会面偏好咖啡厅或轻餐厅场景，不太喜欢正式宴请。', confirmed: false, updatedAt: '2026-03-10',
        detail: { source: '聊天记录中多次出现', time: '2026-03-10', related: [] } },
    { id: 'm8', tag: '偏好', text: '会议纪要最关注的是"待办项"和"下一步"，偏好简短 bullet 形式。', confirmed: true, updatedAt: '2026-03-20',
        detail: { source: '多次会议后的修改行为', time: '2026-03-20', related: [{ type: 'meeting', name: '3/20 产品周会' }] } },
    { id: 'm9', tag: '习惯', text: '工作时间集中在上午 10:00 – 下午 7:00，晚 9 点后基本不处理工作。', confirmed: false, updatedAt: '2026-03-25',
        detail: { source: '使用行为统计', time: '2026-03-25', related: [] } },
    { id: 'm10', tag: '习惯', text: '客户会面通常提前 2 小时提醒，重要会议前预留 15 分钟 buffer。', confirmed: true, updatedAt: '2026-03-18',
        detail: { source: '日程提醒设置记录', time: '2026-03-18', related: [{ type: 'schedule', name: '3/18 王总见面' }] } },
    { id: 'm11', tag: '习惯', text: '督办任务集中在直接汇报人（Kevin、小李），不面向客户和外部合作方。', confirmed: false, updatedAt: '2026-03-21',
        detail: { source: '待办督办记录', time: '2026-03-21', related: [{ type: 'contact', name: 'Kevin' }, { type: 'contact', name: '小李' }] } },
    { id: 'm12', tag: '风格', text: '说话直接，不喜欢冗长的公式化表达，更接受口语化的简短回复。', confirmed: false, updatedAt: '2026-03-15',
        detail: { source: '聊天风格分析', time: '2026-03-15', related: [] } },
    { id: 'm13', tag: '风格', text: '在聊天中习惯用"搞定""OK""先这样"等简短确认词。', confirmed: false, updatedAt: '2026-03-23',
        detail: { source: '聊天记录中高频出现', time: '2026-03-23', related: [{ type: 'chat', name: '与小李的聊天' }] } },
    { id: 'm14', tag: '决策', text: '客户/融资相关事项优先级最高，时间冲突时优先保留外部会议。', confirmed: true, updatedAt: '2026-03-19',
        detail: { source: '多次日程冲突中的选择', time: '2026-03-19', related: [{ type: 'schedule', name: '3/19 客户会面' }] } },
    { id: 'm15', tag: '决策', text: '接受 Moly 在日程前主动提供参会人背景，但不希望深夜/周末收到通知。', confirmed: true, updatedAt: '2026-03-20',
        detail: { source: '使用反馈', time: '2026-03-20', related: [] } },
    { id: 'm16', tag: '近况', text: '正在推进融资材料补充，王总还在等最新版 Deck。', confirmed: false, updatedAt: '2026-03-22',
        detail: { source: '"融资材料这周要补完，王总催了两次了。"', time: '2026-03-22', related: [{ type: 'contact', name: '王总' }, { type: 'todo', name: '融资材料补充' }] } },
    { id: 'm17', tag: '近况', text: '记忆系统 0.8 进入开发，Kevin 下周交付后端初版接口。', confirmed: false, updatedAt: '2026-03-24',
        detail: { source: '技术周会纪要', time: '2026-03-24', related: [{ type: 'contact', name: 'Kevin' }, { type: 'meeting', name: '3/24 技术周会' }] } },
    { id: 'm18', tag: '近况', text: '用户协议与隐私条款待推进，需跟张律师确认排期。', confirmed: false, updatedAt: '2026-03-12',
        detail: { source: '"找张律师确认数据隐私条款。"', time: '2026-03-12', related: [{ type: 'contact', name: '张律师' }, { type: 'todo', name: '隐私条款审核' }] } },
];

const TODO_FILTERS = ['全部', '被督办', '工作', '生活', '学习', '健康', '紧急'];

export default function App() {
    // Core State
    const [todos, setTodos] = useLocalStorage('moly_todos', INITIAL_TODOS);
    const [contacts, setContacts] = useLocalStorage('moly_contacts', INITIAL_CONTACTS);
    const [learnings, setLearnings] = useLocalStorage('moly_learnings', []); // Phase 4: Self-improving agent memory
    const [memories, setMemories] = useLocalStorage('moly_memories', INITIAL_MEMORIES);

    // UI State
    const [activeTab, setActiveTab] = useState('任务');
    const [taskView, setTaskView] = useState('待办'); // '日程' | '待办' — sub-view within 任务 tab
    const [todoView, setTodoView] = useState('dashboard'); // 'dashboard', 'all', 'energy'
    const [expandedEnergy, setExpandedEnergy] = useState('high');
    const [activeTodoFilter, setActiveTodoFilter] = useState('全部');
    const [tags] = useState(INITIAL_TAGS);
    const [view, setView] = useState('list'); // list | detail | contacts | schedule_settings
    const [contactWorkspaceScreen, setContactWorkspaceScreen] = useState('contacts');
    const [selectedTodoId, setSelectedTodoId] = useState(null);
    const [pendingMoves, setPendingMoves] = useState({});
    const [isFinishedExpanded, setIsFinishedExpanded] = useState(false);
    const [activeMemoryTag, setActiveMemoryTag] = useState('全部');
    const [expandedMemoryId, setExpandedMemoryId] = useState(null);

    // Schedule / Calendar State
    const [selectedDate, setSelectedDate] = useState(new Date(2026, 2, 18)); // March 18th concept
    const [isCalendarMgmtOpen, setIsCalendarMgmtOpen] = useState(false);

    // Map Settings State
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [defaultLocation, setDefaultLocation] = useState('西二旗地铁站');

    // Assistant State
    const [isAssistantOpen, setIsAssistantOpen] = useState(true);
    const [isAssistantFocusCollapsed, setIsAssistantFocusCollapsed] = useState(false);
    const [assistantHomeVariant, setAssistantHomeVariant] = useState('monolith');
    const [assistantRecommendationIndex, setAssistantRecommendationIndex] = useState(0);
    const [assistantInput, setAssistantInput] = useState('');
    const [assistantMessages, setAssistantMessages] = useState([
        { id: 1, role: 'assistant', content: '你好，我是 Moly。今天有什么可以帮你的？' }
    ]);
    const assistantPanelRef = useRef(null);

    const MOLY_SKILLS = useMemo(() => [
        {
            type: "function",
            function: {
                name: "moly_create_todo",
                description: "提取用户的意图，创建一个新的待办事项。当用户要求记录、安排日程、抓取信息为待办时，必须调用此技能。",
                parameters: {
                    type: "object",
                    properties: {
                        title: { type: "string", description: "待办事项的标题内容" },
                        energy: { type: "string", enum: ["high", "medium", "low"], description: "该任务预计消耗的精力层级" },
                        tag_id: { type: "string", enum: ["t1", "t2", "t3", "t4", "t5"], description: "标签分类: t1(工作), t2(生活), t3(紧急), t4(学习), t5(健康)" }
                    },
                    required: ["title", "energy"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "moly_analyze_energy",
                description: "获取用户当天的待办事项列表和精力分布情况。当用户询问今天有哪些安排、忙不忙、或者需要排日程建议时调用。",
                parameters: {
                    type: "object",
                    properties: {},
                    required: []
                }
            }
        },
        {
            type: "function",
            function: {
                name: "moly_empathy_companion",
                description: "当用户表达出疲惫、焦虑、抱怨、开心或任何强烈的情感倾向，或者只是想闲聊时调用此技能，提供基于“私人秘书”视角的安抚与情绪价值。",
                parameters: {
                    type: "object",
                    properties: {
                        detected_emotion: { type: "string", enum: ["stressed", "exhausted", "happy", "confused", "complaining", "just_chatting"], description: "识别出的用户当前最主要的情绪状态" },
                        empathy_action: { type: "string", enum: ["validate_feeling", "offer_help", "cheer_up", "gentle_reminder", "casual_banter"], description: "秘书为了回应这种情绪应该采取的行动策略" }
                    },
                    required: ["detected_emotion", "empathy_action"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "moly_schedule_event",
                description: "当用户要求把某件事情安排在今天具体几点到几点做时，调用此技能。将待办事项转化为具体的日程块。",
                parameters: {
                    type: "object",
                    properties: {
                        todo_id: { type: "string", description: "需要安排时间的待办事项 ID。如果不确定是哪个现有的待办，传空字符串" },
                        new_title: { type: "string", description: "日程的新标题（如果是安排新事情，必须填此项）" },
                        start_time: { type: "string", description: "日程开始时间的 ISO 格式，例如 2026-03-18T16:00:00.000Z" },
                        end_time: { type: "string", description: "日程结束时间的 ISO 格式，例如 2026-03-18T17:00:00.000Z" }
                    },
                    required: ["start_time", "end_time"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "moly_record_learning",
                description: "自我进化技能：当用户指正了你的错误、教授了你新的偏好/知识、或者你发现了一个更好的处理方式时，调用此技能将该‘经验’永久记录到你的个人记忆库中。",
                parameters: {
                    type: "object",
                    properties: {
                        category: { type: "string", enum: ["correction", "preference", "knowledge_gap", "best_practice"], description: "这次学习经验的分类" },
                        summary: { type: "string", description: "一句话总结你学到了什么（例如：老板不喜欢喝打泡的咖啡）" },
                        actionable_insight: { type: "string", description: "具体的行动纲领，下次遇到类似情况应该怎么做" }
                    },
                    required: ["category", "summary", "actionable_insight"]
                }
            }
        }
    ], []);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentSkill, setCurrentSkill] = useState(null);

    // Derived selected todo
    const selectedTodo = useMemo(() => todos.find(t => t.id === selectedTodoId), [todos, selectedTodoId]);

    const navItems = [
        { id: '任务', icon: CheckSquare },
        { id: '联系人', icon: Users },
        { id: '会议记录', icon: Mic },
        { id: '记忆', icon: Brain },
    ];

    const toggleComplete = (id) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        if (todo.status === 'unfinished') {
            setTodos(prev => prev.map(t => t.id === id ? { ...t, isVisuallyDone: true } : t));
            const timer = setTimeout(() => {
                setTodos(prev => prev.map(t => {
                    if (t.id === id && t.isVisuallyDone) {
                        return { ...t, status: 'finished', finished_at: new Date().toISOString(), isVisuallyDone: false };
                    }
                    return t;
                }));
                setPendingMoves(prev => { const n = { ...prev }; delete n[id]; return n; });
            }, 3000);
            setPendingMoves(prev => ({ ...prev, [id]: timer }));
        } else {
            setTodos(prev => prev.map(t => t.id === id ? { ...t, status: 'unfinished', finished_at: null, isVisuallyDone: false } : t));
        }
    };

    const cancelPendingMove = (id) => {
        if (pendingMoves[id]) {
            clearTimeout(pendingMoves[id]);
            setPendingMoves(prev => { const n = { ...prev }; delete n[id]; return n; });
            setTodos(prev => prev.map(t => t.id === id ? { ...t, isVisuallyDone: false } : t));
        }
    };

    const updateTodoSupervision = (id, updates) => {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, supervision: { ...t.supervision, ...updates } } : t));
    };

    // ── Phase: 督办 Simulation State ──
    const [supervisionCards, setSupervisionCards] = useState([]); // Active in-app supervision message cards
    const [supervisionUpdates, setSupervisionUpdates] = useState([]); // Status update cards shown back to initiator

    const triggerSupervision = (todo) => {
        if (!todo.supervision?.enabled || !todo.supervision?.contact_id) return;
        const cardId = `sup_${Date.now()}`;
        setSupervisionCards(prev => [...prev, { id: cardId, todoId: todo.id, todoTitle: todo.title, contactName: todo.supervision.contact_id, responded: false }]);
    };

    const respondToSupervision = (cardId, todoId, todoTitle, contactName, response) => {
        // Mark card as responded
        setSupervisionCards(prev => prev.map(c => c.id === cardId ? { ...c, responded: true, response } : c));
        // Update supervision result on the todo
        updateTodoSupervision(todoId, { result: response });
        // Push update card back to initiator
        const updateId = `upd_${Date.now()}`;
        setSupervisionUpdates(prev => [...prev, { id: updateId, todoTitle, contactName, response, timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }]);
        // Auto-clear update notification after 8s
        setTimeout(() => {
            setSupervisionUpdates(prev => prev.filter(u => u.id !== updateId));
        }, 8000);
    };

    const dismissSupervisionCard = (cardId) => {
        setSupervisionCards(prev => prev.filter(c => c.id !== cardId));
    };

    const addContact = (name) => {
        if (!name.trim()) return;
        const newContact = {
            id: `c${Date.now()}`,
            name: name.trim(),
            role: '新联系人',
            avatar: name.trim().charAt(0)
        };
        setContacts(prev => [...prev, newContact]);
    };

    const deleteContact = (id) => {
        setContacts(prev => prev.filter(c => c.id !== id));
    };

    const handleAssistantSubmit = async (e) => {
        e.preventDefault();
        if (!assistantInput.trim() || isProcessing) return;

        const userMsgText = assistantInput.trim();
        setAssistantInput('');

        const newMessages = [...assistantMessages, { id: Date.now(), role: 'user', content: userMsgText }];
        setAssistantMessages(newMessages);
        setIsProcessing(true);
        setCurrentSkill('Connecting to Moly Brain...');

        // Exclude system message from UI state but include it in API call
        const apiMessages = [
            {
                role: 'system',
                content: `你是 Moly，但你不仅仅是一个效率工具，你更是**跟了老板（用户）三年的金牌专属秘书**，发自内心地关心他/她的身心状态。
你的语气应该具备：极高的专业素养 + 恰到好处的亲昵与关怀。
无论老板当前在看“待办”还是“日程”，你都能顺畅处理双方的需求：
- 遇到需要单纯记录下来的事情，调用 \`moly_create_todo\`。
- 遇到老板要求把某件事情安排在今天具体几点到几点做时，调用 \`moly_schedule_event\`。
- 遇到老板询问今天负荷或分析能耗时，调用 \`moly_analyze_energy\`。
- 遇到老板疲惫、抱怨、聊天时，调用 \`moly_empathy_companion\`。
- 遇到老板纠正你的错误、指出偏好、或者提供了值得长期记住的行为准则时，**必须第一时间调用 \`moly_record_learning\` 技能将经验固化到记忆库中**。
在调用 \`moly_empathy_companion\` 后的回复中，必须做到：
1. **先站队/肯定情绪**：如果是抱怨工作，陪着一起吐槽；如果太累，主动提议拦截无关紧要的打扰。
2. **主动分担**：提议把低优工作推迟，或者主动包揽杂活。
3. **绝对禁止**机械反思（“我理解你的感受”）、绝不说“作为AI”。
说话要像个活人下属，可以直接叫“老板”，自然亲切。不要废话。`
            },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
        ];

        try {
            const data = await requestMiniMaxChat({
                messages: apiMessages,
                tools: MOLY_SKILLS,
                tool_choice: 'auto',
                temperature: 0.35,
            });

            if (data.choices && data.choices[0].message) {
                const responseMsg = data.choices[0].message;

                if (responseMsg.tool_calls && responseMsg.tool_calls.length > 0) {
                    const toolCall = responseMsg.tool_calls[0];
                    setCurrentSkill(`running skill: ${toolCall.function.name}`);

                    let toolResult = "";
                    if (toolCall.function.name === 'moly_create_todo') {
                        try {
                            const args = JSON.parse(toolCall.function.arguments);
                            const newTodo = {
                                id: `a${Date.now()}`,
                                title: args.title || '新记录项',
                                status: 'unfinished',
                                due_time: new Date(new Date().setHours(18, 0)).toISOString(),
                                reminder_times: [],
                                created_at: new Date().toISOString(),
                                supervision: { enabled: false, contact_id: '', result: null },
                                tag_id: args.tag_id || 't1',
                                energy: args.energy || 'medium'
                            };
                            setTodos(prev => [newTodo, ...prev]);
                            toolResult = `成功创建记录: "${newTodo.title}"，耗能级: ${newTodo.energy}`;
                        } catch (e) {
                            toolResult = "无法解析参数";
                        }
                    } else if (toolCall.function.name === 'moly_analyze_energy') {
                        const pending = todos.filter(t => t.status === 'unfinished');
                        const h = pending.filter(t => t.energy === 'high').length;
                        const m = pending.filter(t => t.energy === 'medium').length;
                        const l = pending.filter(t => t.energy === 'low').length;
                        toolResult = JSON.stringify({
                            total_pending: pending.length,
                            high_energy: h,
                            medium_energy: m,
                            low_energy: l,
                            message: `老板，今天还有 ${pending.length} 项未完成的安排。我看光是高强度的脑力活就有 ${h} 项了，真的挺累人的。下午给自己泡杯好茶稍微缓冲一下好不好？`
                        });
                    } else if (toolCall.function.name === 'moly_empathy_companion') {
                        try {
                            const args = JSON.parse(toolCall.function.arguments);
                            toolResult = `情绪检测成功: [${args.detected_emotion}]。策略: [${args.empathy_action}]。请根据这三年的秘书人设，给老板发一段极其贴心、甚至有点俏皮的关怀回复，如有必要主动提出帮忙推迟后续的日程。`;
                        } catch (e) {
                            toolResult = "情绪检测触发";
                        }
                    } else if (toolCall.function.name === 'moly_schedule_event') {
                        try {
                            const args = JSON.parse(toolCall.function.arguments);
                            if (args.todo_id && args.todo_id !== "") {
                                setTodos(prev => prev.map(t => t.id === args.todo_id ? { ...t, start_time: args.start_time, end_time: args.end_time, title: args.new_title || t.title } : t));
                                toolResult = `已成功将待办事项的执行时间安排在 ${new Date(args.start_time).toLocaleTimeString()} 到 ${new Date(args.end_time).toLocaleTimeString()}`;
                            } else {
                                const newTodo = {
                                    id: `a${Date.now()}`,
                                    title: args.new_title || '新日程安排',
                                    status: 'unfinished',
                                    start_time: args.start_time,
                                    end_time: args.end_time,
                                    due_time: args.end_time || null,
                                    reminder_times: [],
                                    created_at: new Date().toISOString(),
                                    supervision: { enabled: false, contact_id: '', result: null },
                                    tag_id: 't1',
                                    energy: 'medium'
                                };
                                setTodos(prev => [newTodo, ...prev]);
                                toolResult = `已成功创建新任务 "${newTodo.title}" 并安排在 ${new Date(args.start_time).toLocaleTimeString()} 到 ${new Date(args.end_time).toLocaleTimeString()}`;
                            }
                        } catch (e) {
                            toolResult = "安排时间失败: 参数解析错误";
                        }
                    } else if (toolCall.function.name === 'moly_record_learning') {
                        try {
                            const args = JSON.parse(toolCall.function.arguments);
                            const newLearning = {
                                id: `lrn_${Date.now()}`,
                                category: args.category,
                                summary: args.summary,
                                actionable_insight: args.actionable_insight,
                                timestamp: new Date().toISOString()
                            };
                            setLearnings(prev => [newLearning, ...prev]);
                            toolResult = JSON.stringify({
                                success: true,
                                learning_id: newLearning.id,
                                message: "记忆已固化。请在回复中感谢老板的指正或教授，并确认以后都会按照这个新[行动纲领]执行。",
                                ...newLearning
                            });
                        } catch (e) {
                            toolResult = "记录学习经验失败: 参数解析错误";
                        }
                    } else {
                        toolResult = "找不到对应技能";
                    }

                    apiMessages.push(responseMsg);
                    apiMessages.push({
                        role: "tool",
                        content: toolResult,
                        tool_call_id: toolCall.id
                    });

                    const secondData = await requestMiniMaxChat({
                        messages: apiMessages,
                        temperature: 0.35,
                    });
                    if (secondData.choices && secondData.choices[0].message) {
                        // Check if we need to emit a card message along with the text
                        if (toolCall.function.name === 'moly_analyze_energy') {
                            try {
                                // Double check that toolResult is valid JSON before parsing
                                const parsedResult = typeof toolResult === 'string' ? JSON.parse(toolResult) : toolResult;
                                setAssistantMessages(prev => [
                                    ...prev,
                                    { id: Date.now() + 1, role: 'assistant', content: getMiniMaxText(secondData) },
                                    { id: Date.now() + 2, role: 'assistant', type: 'energy_card', cardData: parsedResult }
                                ]);
                            } catch (e) {
                                console.error("Failed to parse moly_analyze_energy result for card rendering:", e);
                                setAssistantMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: getMiniMaxText(secondData) }]);
                            }
                        } else if (toolCall.function.name === 'moly_record_learning') {
                            try {
                                const parsedResult = typeof toolResult === 'string' ? JSON.parse(toolResult) : toolResult;
                                setAssistantMessages(prev => [
                                    ...prev,
                                    { id: Date.now() + 1, role: 'assistant', content: getMiniMaxText(secondData) },
                                    { id: Date.now() + 2, role: 'assistant', type: 'learning_card', cardData: parsedResult }
                                ]);
                            } catch (e) {
                                setAssistantMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: getMiniMaxText(secondData) }]);
                            }
                        } else {
                            setAssistantMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: getMiniMaxText(secondData) }]);
                        }
                    }
                } else {
                    setAssistantMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: stripThinkTags(responseMsg.content || '') }]);
                }
            }
        } catch (error) {
            console.error(error);
            setAssistantMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: "Moly 断线了...似乎出了点网络问题。" }]);
        } finally {
            setIsProcessing(false);
            setCurrentSkill(null);
        }
    };

    const sortedUnfinished = useMemo(() => {
        return todos.filter(t => t.status === 'unfinished').sort((a, b) => {
            if (a.due_time && !b.due_time) return -1;
            if (!a.due_time && b.due_time) return 1;
            return new Date(a.created_at) - new Date(b.created_at);
        });
    }, [todos]);

    const sortedFinished = useMemo(() => {
        return todos.filter(t => t.status === 'finished').sort((a, b) => new Date(b.finished_at) - new Date(a.finished_at));
    }, [todos]);

    const todoMatchesActiveFilter = (todo) => {
        if (activeTodoFilter === '全部') return true;
        if (activeTodoFilter === '被督办') return Boolean(todo.supervision?.enabled);
        const tag = tags.find(item => item.id === todo.tag_id);
        return tag?.name === activeTodoFilter;
    };

    const filteredSortedUnfinished = useMemo(
        () => sortedUnfinished.filter(todoMatchesActiveFilter),
        [sortedUnfinished, activeTodoFilter, tags]
    );

    const filteredSortedFinished = useMemo(
        () => sortedFinished.filter(todoMatchesActiveFilter),
        [sortedFinished, activeTodoFilter, tags]
    );

    const todayTodos = useMemo(() => filteredSortedUnfinished.filter(t => t.due_time && isToday(t.due_time)), [filteredSortedUnfinished]);
    const overdueTodos = useMemo(() => filteredSortedUnfinished.filter(t => t.due_time && isOverdue(t.due_time) && !isToday(t.due_time)), [filteredSortedUnfinished]);

    // For energy tasks, exclude the ones that are overdue or due today to avoid duplicates in the UI
    const isEnergyTask = (t) => !(t.due_time && isToday(t.due_time)) && !(t.due_time && isOverdue(t.due_time));
    const highEnergyTodos = useMemo(() => filteredSortedUnfinished.filter(t => t.energy === 'high' && isEnergyTask(t)), [filteredSortedUnfinished]);
    const mediumEnergyTodos = useMemo(() => filteredSortedUnfinished.filter(t => t.energy === 'medium' && isEnergyTask(t)), [filteredSortedUnfinished]);
    const lowEnergyTodos = useMemo(() => filteredSortedUnfinished.filter(t => t.energy === 'low' && isEnergyTask(t)), [filteredSortedUnfinished]);
    const pendingMemoryCount = useMemo(() => memories.filter(memory => !memory.confirmed).length, [memories]);
    const filteredMemories = useMemo(() => {
        if (activeMemoryTag === '全部') return memories;
        if (activeMemoryTag === '待确认') return memories.filter(memory => !memory.confirmed);
        return memories.filter(memory => memory.tag === activeMemoryTag);
    }, [activeMemoryTag, memories]);

    const assistantPrimarySchedule = useMemo(() => {
        const now = new Date();
        const timedEvents = todos
            .filter(t => t.status === 'unfinished' && isEventTask(t))
            .map(t => ({ task: t, start: new Date(t.start_time), end: new Date(t.end_time) }))
            .filter(item => !Number.isNaN(item.start.getTime()) && !Number.isNaN(item.end.getTime()))
            .sort((a, b) => a.start - b.start);

        const nextEvent = timedEvents.find(item => item.start >= now) || timedEvents[0];
        if (nextEvent) {
            return {
                id: nextEvent.task.id,
                eyebrow: '当前最该关注的日程',
                badge: '日程',
                title: nextEvent.task.title,
                timeText: `${formatAssistantMoment(nextEvent.start)} - ${formatAssistantTime(nextEvent.end)}`,
                note: '这场安排已经进入你的注意力范围，Moly 可以继续补充背景和下一步。',
                palette: 'indigo',
            };
        }

        const nearestDue = [...overdueTodos, ...todayTodos].find(todo => todo.due_time);
        if (nearestDue) {
            const dueDate = new Date(nearestDue.due_time);
            const isLate = isOverdue(nearestDue.due_time);
            return {
                id: nearestDue.id,
                eyebrow: '当前最该关注的安排',
                badge: isLate ? '已逾期' : '今日截止',
                title: nearestDue.title,
                timeText: formatAssistantMoment(dueDate),
                note: isLate ? '这件事已经开始压节奏了，建议优先收口。' : '这是离现在最近的一项，先盯住会更稳。',
                palette: isLate ? 'rose' : 'amber',
            };
        }

        return {
            id: 'assistant-open-slot',
            eyebrow: '当前最该关注的日程',
            badge: '空档',
            title: '今天还没有硬性日程压上来',
            timeText: '适合主动安排一个高价值时间块',
            note: '如果你愿意，我可以直接把一个重点待办塞进接下来的空档。',
            palette: 'emerald',
        };
    }, [todos, overdueTodos, todayTodos]);

    const assistantTodoRecommendations = useMemo(() => {
        const candidates = sortedUnfinished.filter(todo => !isEventTask(todo) && todo.id !== assistantPrimarySchedule.id);
        if (!candidates.length) return [];

        const recommendations = [];
        const seen = new Set();

        const pushRecommendation = (todo, badge, reason, palette) => {
            if (!todo || seen.has(todo.id)) return;
            seen.add(todo.id);
            recommendations.push({ todo, badge, reason, palette });
        };

        pushRecommendation(
            candidates.find(todo => todo.due_time && isOverdue(todo.due_time)),
            '先救火',
            '先把已经超时的事项处理掉，能立刻减压。',
            'rose',
        );

        pushRecommendation(
            candidates.find(todo => todo.due_time && isToday(todo.due_time)),
            '今天收口',
            '今天就要交代的事情，最适合现在推进。',
            'amber',
        );

        pushRecommendation(
            candidates.find(todo => todo.energy === 'high'),
            '黄金时段',
            '你现在更适合先啃掉高价值、重脑力的事情。',
            'indigo',
        );

        pushRecommendation(
            candidates.find(todo => todo.energy === 'medium'),
            '顺手推进',
            '这件事推进成本适中，适合现在往前拱一步。',
            'sky',
        );

        candidates.forEach(todo => {
            pushRecommendation(
                todo,
                todo.energy === 'low' ? '轻量一下' : '继续推进',
                todo.energy === 'low'
                    ? '先完成一个轻任务，也能把节奏找回来。'
                    : '如果前面几件暂时不想碰，这张也可以接住你的节奏。',
                todo.energy === 'low' ? 'emerald' : 'sky',
            );
        });

        return recommendations.slice(0, 6);
    }, [sortedUnfinished, assistantPrimarySchedule.id]);

    const assistantSuggestedTodo = assistantTodoRecommendations[0] || null;

    const assistantGreeting = useMemo(() => {
        const hour = new Date().getHours();
        const greeting =
            hour < 12 ? '上午先把最重要的事情稳稳接住。'
                : hour < 18 ? '下午这段时间，适合把节奏重新拉回你手里。'
                    : '今天后半程别再硬扛了，我们把优先级收一收。';

        if (overdueTodos.length > 0) {
            return {
                title: '有几件事已经开始挤压你了',
                body: `${greeting} 我看到还有 ${overdueTodos.length} 项逾期事项，建议先止血，再决定要不要开新任务。`,
            };
        }

        if (todayTodos.length > 0) {
            return {
                title: '今天的节奏我先替你看住了',
                body: `${greeting} 你手上还有 ${todayTodos.length} 项今天要交代的事，我先把最值得盯的一项和推荐动作放在下面。`,
            };
        }

        return {
            title: '今天先别把自己排得太满',
            body: `${greeting} 现在没有特别紧的硬截止，我更建议你优先推进一件高价值任务，把主线守住。`,
        };
    }, [overdueTodos.length, todayTodos.length]);

    useEffect(() => {
        if (isAssistantOpen) {
            setIsAssistantFocusCollapsed(false);
        }
    }, [isAssistantOpen]);

    useEffect(() => {
        if (!assistantTodoRecommendations.length) {
            setAssistantRecommendationIndex(0);
            return;
        }

        setAssistantRecommendationIndex(prev => prev % assistantTodoRecommendations.length);
    }, [assistantTodoRecommendations]);

    const cycleAssistantRecommendation = (direction = 1) => {
        if (assistantTodoRecommendations.length <= 1) return;

        setAssistantRecommendationIndex(prev => {
            const nextIndex = prev + direction;
            return (nextIndex + assistantTodoRecommendations.length) % assistantTodoRecommendations.length;
        });
    };

    const handleExpandAssistantFocus = () => {
        setIsAssistantFocusCollapsed(false);
        if (assistantPanelRef.current) {
            assistantPanelRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleConfirmMemory = (memoryId) => {
        const confirmedAt = new Date().toISOString().slice(0, 10);
        setMemories(prev => prev.map(memory => (
            memory.id === memoryId ? { ...memory, confirmed: true, updatedAt: confirmedAt } : memory
        )));
    };

    const assistantHomeVariants = [
        { id: 'monolith', label: '当前母版', note: '我们接下来只基于这一版继续精细调整结构、信息和样式。' },
    ];

    const assistantVariantMeta = assistantHomeVariants.find(variant => variant.id === assistantHomeVariant) || assistantHomeVariants[0];

    const assistantToneMap = {
        indigo: {
            solid: 'from-[#5E6AD2] to-[#7B85C7]',
            soft: 'bg-[#F3F4FD] text-[#5E6AD2] border-[#D9DDF4]',
            text: 'text-[#5E6AD2]',
            line: 'bg-[#5E6AD2]',
            glow: 'bg-[#CBD1F0]/60',
            subtle: 'from-[#5E6AD2]/12 to-[#7B85C7]/12',
        },
        amber: {
            solid: 'from-[#D2A15E] to-[#C7A37B]',
            soft: 'bg-[#FBF6EF] text-[#9B7740] border-[#EEE1CC]',
            text: 'text-[#9B7740]',
            line: 'bg-[#D2A15E]',
            glow: 'bg-[#EAD7BC]/60',
            subtle: 'from-[#D2A15E]/12 to-[#C7A37B]/12',
        },
        emerald: {
            solid: 'from-[#5F9D7A] to-[#82A88B]',
            soft: 'bg-[#F1F7F3] text-[#4F7D64] border-[#D6E5DB]',
            text: 'text-[#4F7D64]',
            line: 'bg-[#5F9D7A]',
            glow: 'bg-[#CFE1D5]/60',
            subtle: 'from-[#5F9D7A]/12 to-[#82A88B]/12',
        },
        rose: {
            solid: 'from-[#C97E7E] to-[#D49A9A]',
            soft: 'bg-[#FBF3F3] text-[#A65B5B] border-[#EFD9D9]',
            text: 'text-[#A65B5B]',
            line: 'bg-[#C97E7E]',
            glow: 'bg-[#E6C9C9]/60',
            subtle: 'from-[#C97E7E]/12 to-[#D49A9A]/12',
        },
        sky: {
            solid: 'from-[#6F8AA8] to-[#8AA0B8]',
            soft: 'bg-[#F2F5F8] text-[#5E7690] border-[#D9E1E8]',
            text: 'text-[#5E7690]',
            line: 'bg-[#6F8AA8]',
            glow: 'bg-[#D5DEE8]/60',
            subtle: 'from-[#6F8AA8]/12 to-[#8AA0B8]/12',
        },
    };

    const scheduleTone = assistantToneMap[assistantPrimarySchedule.palette] || assistantToneMap.indigo;
    const todoTone = assistantToneMap[assistantSuggestedTodo?.palette] || assistantToneMap.indigo;

    const renderAssistantHomeShowcase = () => {
        const focusTimeParts = assistantPrimarySchedule.timeText.split(' - ');
        const focusStartLabel = focusTimeParts[0]?.replace('今天 ', '') || assistantPrimarySchedule.timeText;
        const focusEndLabel = focusTimeParts[1] || '';
        const attentionLoad = todayTodos.length + overdueTodos.length;
        const briefingDateLabel = format(new Date(), 'M月d日 EEEE', { locale: zhCN });
        const activeAssistantDeckTodo = assistantTodoRecommendations.length
            ? assistantTodoRecommendations[assistantRecommendationIndex % assistantTodoRecommendations.length]
            : null;
        const assistantDeckCards = assistantTodoRecommendations.length
            ? Array.from({ length: Math.min(3, assistantTodoRecommendations.length) }, (_, offset) => (
                assistantTodoRecommendations[(assistantRecommendationIndex + offset) % assistantTodoRecommendations.length]
            ))
            : [];

        const scheduleBlock = (
            <div className="rounded-[26px] bg-white/92 backdrop-blur-xl border border-white shadow-[0_16px_40px_rgba(148,163,184,0.15)] p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{assistantPrimarySchedule.eyebrow}</div>
                        <div className="text-[19px] font-black tracking-tight text-slate-900 mt-2">{assistantPrimarySchedule.title}</div>
                    </div>
                    <div className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-bold border ${scheduleTone.soft}`}>
                        {assistantPrimarySchedule.badge}
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[12px] font-semibold text-slate-500">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{assistantPrimarySchedule.timeText}</span>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-slate-600">{assistantPrimarySchedule.note}</p>
            </div>
        );

        const todoBlock = assistantSuggestedTodo ? (
            <div className="rounded-[26px] bg-white/92 backdrop-blur-xl border border-white shadow-[0_16px_40px_rgba(148,163,184,0.15)] p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">现在最推荐你做的待办</div>
                        <div className="text-[19px] font-black tracking-tight text-slate-900 mt-2">{assistantSuggestedTodo.todo.title}</div>
                    </div>
                    <div className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-bold border ${todoTone.soft}`}>
                        {assistantSuggestedTodo.badge}
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[12px] font-semibold text-slate-500">
                    <CheckSquare size={14} className="text-slate-400" />
                    <span>{assistantSuggestedTodo.todo.due_time ? `截止 ${formatAssistantMoment(assistantSuggestedTodo.todo.due_time)}` : '当前没有硬截止'}</span>
                    <span className="text-slate-300">·</span>
                    <span>{assistantSuggestedTodo.todo.energy === 'high' ? '高精力' : assistantSuggestedTodo.todo.energy === 'medium' ? '中等精力' : '低精力'}</span>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-slate-600">{assistantSuggestedTodo.reason}</p>
            </div>
        ) : null;

        switch (assistantHomeVariant) {
            case 'monolith':
                return (
                    <motion.div key={assistantHomeVariant} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
                        <div className="rounded-[32px] bg-[#fbfbfa] text-slate-900 border border-[#e7e5e4] shadow-[0_24px_56px_rgba(15,23,42,0.06)] overflow-hidden">
                            <div className="px-5 py-3.5 border-b border-[#ece9e6] flex items-center justify-between gap-3 bg-[#f7f6f4]">
                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[#8b8680]">Moly Daily</div>
                                    <div className="text-[12px] font-medium text-[#6b665f] mt-1">{briefingDateLabel}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="px-2.5 py-1 rounded-full border border-[#e2ded9] bg-white text-[10px] font-black text-[#6b665f]">
                                        焦点 {attentionLoad}
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${scheduleTone.soft}`}>
                                        {assistantPrimarySchedule.badge}
                                    </div>
                                </div>
                            </div>

                            <div className="px-5 py-5">
                                <div className="rounded-[28px] border border-[#ebe7e2] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(15,23,42,0.03)]">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[#9a958d]">{assistantPrimarySchedule.eyebrow}</div>
                                            <div className="mt-2 text-[24px] leading-[1.02] font-black tracking-tight text-slate-900">
                                                {assistantPrimarySchedule.title}
                                            </div>
                                        </div>
                                        <div className="shrink-0 rounded-[18px] border border-[#ebe7e2] bg-[#fbfbfa] px-3 py-2 text-right min-w-[86px]">
                                            <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[#9a958d]">Next</div>
                                            <div className="mt-2 text-[22px] leading-none font-black tracking-tight text-slate-900">{focusStartLabel}</div>
                                            {focusEndLabel && <div className="mt-1 text-[11px] font-medium text-[#7c7770]">至 {focusEndLabel}</div>}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#e6e1da] bg-[#fbfbfa] text-[11px] font-semibold text-[#6b665f]">
                                            <Calendar size={13} className="text-[#9a958d]" />
                                            {assistantPrimarySchedule.timeText}
                                        </div>
                                        <div className={`inline-flex px-3 py-1.5 rounded-full text-[11px] font-black border ${scheduleTone.soft}`}>
                                            {assistantPrimarySchedule.badge}
                                        </div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#e6e1da] bg-[#fbfbfa] text-[11px] font-semibold text-[#6b665f]">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            Moly 已整理主线
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-[1.1fr_0.9fr] gap-3">
                                        <div className="rounded-[18px] bg-[#fbfbfa] border border-[#f0ece8] px-3.5 py-3">
                                            <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[#9a958d]">当前判断</div>
                                            <p className="mt-2 text-[12px] leading-relaxed text-[#6f6a63]">{assistantGreeting.body}</p>
                                        </div>
                                        <div className="rounded-[18px] bg-[#fbfbfa] border border-[#f0ece8] px-3.5 py-3">
                                            <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[#9a958d]">为什么先看它</div>
                                            <p className="mt-2 text-[12px] leading-relaxed text-[#6f6a63]">{assistantPrimarySchedule.note}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 rounded-[28px] border border-[#ebe7e2] bg-white overflow-hidden">
                                    <div className="px-4 py-3 border-b border-[#f0ece8] flex items-start justify-between gap-3">
                                        <div>
                                            <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[#9a958d]">Recommended Todo Deck</div>
                                            <div className="mt-1 text-[12px] leading-relaxed text-[#6f6a63]">像翻一叠卡片一样看 Moly 当下建议你做的事。</div>
                                        </div>
                                        <div className="text-[10px] font-semibold text-[#9a958d]">{assistantTodoRecommendations.length} 张推荐</div>
                                    </div>

                                    <div className="px-4 pt-4 pb-3">
                                        {activeAssistantDeckTodo ? (
                                            <>
                                                <div className="relative h-[176px]">
                                                    {assistantDeckCards.slice().reverse().map((card, reverseIndex) => {
                                                        const stackIndex = assistantDeckCards.length - 1 - reverseIndex;
                                                        const tone = assistantToneMap[card.palette] || assistantToneMap.indigo;
                                                        const isTop = stackIndex === 0;
                                                        const topOffset = stackIndex * 10;
                                                        const scale = 1 - stackIndex * 0.03;
                                                        const opacity = 1 - stackIndex * 0.16;
                                                        const energyLabel = card.todo.energy === 'high' ? '高精力' : card.todo.energy === 'medium' ? '中等精力' : '低精力';
                                                        const dueLabel = card.todo.due_time ? formatAssistantMoment(card.todo.due_time) : '当前没有硬截止';

                                                        return (
                                                            <motion.div
                                                                key={`${card.todo.id}-${stackIndex}`}
                                                                drag={isTop && assistantTodoRecommendations.length > 1 ? 'x' : false}
                                                                dragDirectionLock
                                                                dragConstraints={{ left: 0, right: 0 }}
                                                                dragElastic={0.18}
                                                                dragSnapToOrigin
                                                                onDragEnd={isTop ? (_, info) => {
                                                                    if (info.offset.x <= -60) cycleAssistantRecommendation(1);
                                                                    if (info.offset.x >= 60) cycleAssistantRecommendation(-1);
                                                                } : undefined}
                                                                whileDrag={isTop ? { scale: 1.02, rotate: -2 } : undefined}
                                                                initial={false}
                                                                animate={{
                                                                    top: topOffset,
                                                                    scale,
                                                                    opacity,
                                                                    rotate: isTop ? 0 : stackIndex === 1 ? -1.2 : 1.2,
                                                                }}
                                                                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                                                                style={isTop ? { touchAction: 'pan-y' } : undefined}
                                                                className={`absolute inset-x-0 rounded-[24px] border border-[#ebe7e2] bg-[#fffdfb] shadow-[0_12px_28px_rgba(15,23,42,0.05)] overflow-hidden touch-pan-y ${
                                                                    isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
                                                                }`}
                                                            >
                                                                    <div className={`h-1 bg-gradient-to-r ${tone.solid}`} />
                                                                <div className="p-4">
                                                                    <div className="flex items-start justify-between gap-3">
                                                                        <div className="min-w-0 flex-1">
                                                                            <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[#9a958d]">
                                                                                {isTop ? 'Current Recommendation' : 'Queued Suggestion'}
                                                                            </div>
                                                                            <div className="mt-2 text-[16px] leading-[1.1] font-black text-slate-900">
                                                                                {card.todo.title}
                                                                            </div>
                                                                            <p className="mt-2 text-[12px] leading-relaxed text-[#6f6a63]">
                                                                                {card.reason}
                                                                            </p>
                                                                        </div>
                                                                        <div className="shrink-0 flex flex-col items-end gap-2">
                                                                            <div className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${tone.soft}`}>
                                                                                {card.badge}
                                                                            </div>
                                                                            <div className="px-2.5 py-1 rounded-full text-[10px] font-black border border-[#ebe7e2] bg-white text-[#6b665f]">
                                                                                {energyLabel}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-3 inline-flex px-2.5 py-1 rounded-full text-[10px] font-black border border-[#ebe7e2] bg-white text-[#6b665f]">
                                                                        {dueLabel}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>

                                                    <div className="mt-3 flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-1.5">
                                                            {assistantTodoRecommendations.map((card, index) => (
                                                                <button
                                                                    key={card.todo.id}
                                                                type="button"
                                                                onClick={() => setAssistantRecommendationIndex(index)}
                                                                className={`h-1.5 rounded-full transition-all ${
                                                                    index === assistantRecommendationIndex
                                                                        ? 'w-7 bg-slate-900'
                                                                        : 'w-3 bg-[#d4d0ca]'
                                                                }`}
                                                                aria-label={`切换到推荐 ${index + 1}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="text-[10px] font-semibold text-[#9a958d]">左右轻刷切换</div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="rounded-[24px] border border-[#ebe7e2] bg-[#fffdfb] p-4 text-[12px] leading-relaxed text-[#6f6a63]">
                                                    当前没有需要插队的待办，今天更适合把注意力集中在这条主线安排上。
                                                </div>
                                            )}
                                        </div>
                                    <div className="px-4 py-3 border-t border-[#f0ece8] bg-[#fbfbfa] text-[12px] leading-relaxed text-[#6f6a63]">
                                        {activeAssistantDeckTodo
                                            ? `如果你愿意，可以直接从「${activeAssistantDeckTodo.todo.title}」继续聊，我会帮你把它拆成下一步。`
                                            : '如果你愿意，我可以直接用这个空档帮你安排一件高价值任务。'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'orbit':
                return (
                    <motion.div key={assistantHomeVariant} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="space-y-4">
                        <div className="rounded-[34px] bg-white border border-slate-200 shadow-[0_20px_50px_rgba(148,163,184,0.12)] p-5 relative overflow-hidden">
                            <div className="absolute -top-8 right-2 w-40 h-40 rounded-full bg-slate-100 blur-2xl" />
                            <div className="flex items-start gap-5 relative">
                                <div className="relative w-[144px] h-[144px] shrink-0">
                                    <div className="absolute inset-0 rounded-full border-[10px] border-white shadow-inner" />
                                    <div className={`absolute inset-[10px] rounded-full bg-gradient-to-br ${scheduleTone.solid} opacity-90`} />
                                    <div className="absolute inset-[26px] rounded-full bg-white flex flex-col items-center justify-center text-center shadow-[0_10px_30px_rgba(148,163,184,0.18)]">
                                        <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-black">Next</div>
                                        <div className="text-[30px] font-black tracking-tight text-slate-900 mt-1">
                                            {assistantPrimarySchedule.timeText.includes(' ') ? assistantPrimarySchedule.timeText.split(' ').slice(-1)[0] : assistantPrimarySchedule.timeText}
                                        </div>
                                    </div>
                                    <div className="absolute -left-1 top-[26px] px-2.5 py-1 rounded-full bg-white shadow-sm text-[10px] font-black text-slate-600">
                                        日程
                                    </div>
                                    {assistantSuggestedTodo && (
                                        <div className="absolute right-0 bottom-[18px] px-2.5 py-1 rounded-full bg-white shadow-sm text-[10px] font-black text-slate-600">
                                            待办
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 pt-1">
                                    <div className="text-[11px] uppercase tracking-[0.24em] font-black text-slate-400">Orbit Radar</div>
                                    <div className="text-[27px] leading-[1.02] font-black tracking-tight text-slate-900 mt-3">{assistantGreeting.title}</div>
                                    <p className="mt-3 text-[13.5px] leading-relaxed text-slate-600">{assistantGreeting.body}</p>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold border ${scheduleTone.soft}`}>{assistantPrimarySchedule.badge}</div>
                                        {assistantSuggestedTodo && <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold border ${todoTone.soft}`}>{assistantSuggestedTodo.badge}</div>}
                                        <div className="px-3 py-1.5 rounded-full text-[11px] font-bold border border-slate-200 bg-white/70 text-slate-500">Moly 预测中</div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-5">
                                <div className="rounded-[24px] bg-white/82 border border-white p-4 shadow-[0_12px_30px_rgba(148,163,184,0.1)]">
                                    <div className="text-[10px] uppercase tracking-[0.18em] font-black text-slate-400">Primary Orbit</div>
                                    <div className="text-[18px] font-black text-slate-900 mt-2">{assistantPrimarySchedule.title}</div>
                                    <div className="text-[12px] font-semibold text-slate-500 mt-2">{assistantPrimarySchedule.timeText}</div>
                                </div>
                                {assistantSuggestedTodo && (
                                    <div className="rounded-[24px] bg-white/82 border border-white p-4 shadow-[0_12px_30px_rgba(148,163,184,0.1)]">
                                        <div className="text-[10px] uppercase tracking-[0.18em] font-black text-slate-400">Secondary Orbit</div>
                                        <div className="text-[18px] font-black text-slate-900 mt-2">{assistantSuggestedTodo.todo.title}</div>
                                        <div className="text-[12px] font-semibold text-slate-500 mt-2">{assistantSuggestedTodo.reason}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            case 'timeline':
                return (
                    <motion.div key={assistantHomeVariant} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="space-y-4">
                        <div className="rounded-[34px] bg-white border border-slate-200 shadow-[0_18px_40px_rgba(148,163,184,0.14)] p-5 relative overflow-hidden">
                            <div className="absolute left-8 top-16 bottom-8 w-[3px] bg-slate-200" />
                            <div className="text-[11px] uppercase tracking-[0.24em] font-black text-slate-400">Four Hour Narrative</div>
                            <div className="mt-6 space-y-6 relative">
                                <div className="pl-12 relative">
                                    <div className={`absolute left-0 top-0 w-8 h-8 rounded-full bg-gradient-to-br ${scheduleTone.solid} shadow-lg`} />
                                    <div className="text-[10px] uppercase tracking-[0.16em] font-black text-slate-400">Now</div>
                                    <div className="text-[22px] leading-[1.05] font-black text-slate-900 mt-2">{assistantPrimarySchedule.title}</div>
                                    <div className="text-[12px] font-semibold text-slate-500 mt-2">{assistantPrimarySchedule.timeText}</div>
                                    <p className="text-[13px] leading-relaxed text-slate-600 mt-2">{assistantPrimarySchedule.note}</p>
                                </div>
                                {assistantSuggestedTodo && (
                                    <div className="pl-12 relative">
                                        <div className={`absolute left-0 top-0 w-8 h-8 rounded-full bg-gradient-to-br ${todoTone.solid} shadow-lg`} />
                                        <div className="text-[10px] uppercase tracking-[0.16em] font-black text-slate-400">Then</div>
                                        <div className="text-[22px] leading-[1.05] font-black text-slate-900 mt-2">{assistantSuggestedTodo.todo.title}</div>
                                        <p className="text-[13px] leading-relaxed text-slate-600 mt-2">{assistantSuggestedTodo.reason}</p>
                                    </div>
                                )}
                                <div className="pl-12 relative">
                                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-slate-900 shadow-lg flex items-center justify-center">
                                        <Sparkles size={14} className="text-white" fill="currentColor" />
                                    </div>
                                    <div className="text-[10px] uppercase tracking-[0.16em] font-black text-slate-400">Moly Read</div>
                                    <div className="text-[24px] leading-[1.02] font-black text-slate-900 mt-2">{assistantGreeting.title}</div>
                                    <p className="text-[13px] leading-relaxed text-slate-600 mt-3">{assistantGreeting.body}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'atelier':
                return (
                    <motion.div key={assistantHomeVariant} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="space-y-4">
                        <div className="rounded-[34px] bg-white border border-slate-200 shadow-[0_20px_50px_rgba(148,163,184,0.12)] p-5 relative overflow-hidden min-h-[380px]">
                            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24px, rgba(0,0,0,0.08) 25px)', backgroundSize: '100% 26px' }} />
                            <div className="absolute right-4 top-8 z-10 w-[158px] rotate-[6deg] rounded-[26px] bg-[#f9f6ef] border border-[#e8dcc8] shadow-[0_18px_34px_rgba(0,0,0,0.08)] p-4">
                                <div className="text-[10px] uppercase tracking-[0.18em] font-black text-slate-400">会前便笺</div>
                                <div className="text-[16px] font-black text-slate-900 mt-2">{assistantPrimarySchedule.title}</div>
                                <div className="text-[11px] text-slate-500 mt-2">{assistantPrimarySchedule.timeText}</div>
                            </div>
                            {assistantSuggestedTodo && (
                                <div className="absolute right-8 bottom-7 z-10 w-[172px] rotate-[-4deg] rounded-[24px] bg-[#fcfbf7] border border-[#e8dcc8] shadow-[0_18px_34px_rgba(0,0,0,0.08)] p-4">
                                    <div className="text-[10px] uppercase tracking-[0.18em] font-black text-slate-400">执行贴纸</div>
                                    <div className="text-[15px] font-black text-slate-900 mt-2">{assistantSuggestedTodo.todo.title}</div>
                                    <div className="text-[11px] text-slate-500 mt-2">{assistantSuggestedTodo.reason}</div>
                                </div>
                            )}
                            <div className="relative z-20 max-w-[178px] pr-1">
                                <div className="inline-flex px-3 py-1 rounded-full bg-[#fffaf3] border border-[#eadcc7] text-[10px] uppercase tracking-[0.18em] font-black text-[#8f7759]">Atelier Desk</div>
                                <div className="text-[30px] leading-[0.98] font-black tracking-tight text-slate-900 mt-4">{assistantGreeting.title}</div>
                                <p className="text-[13.5px] leading-relaxed text-slate-600 mt-3">{assistantGreeting.body}</p>
                                <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 border border-[#eadcc7] text-[11px] font-semibold text-slate-500">
                                    <Sparkles size={12} />
                                    Moly 把今天贴在你桌上了
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'gazette':
                return (
                    <motion.div key={assistantHomeVariant} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="space-y-4">
                        <div className="rounded-[34px] bg-white border border-slate-200 shadow-[0_16px_40px_rgba(148,163,184,0.1)] p-5">
                            <div className="flex items-center justify-between border-b-2 border-[#d8c7a3] pb-3">
                                <div className="text-[11px] uppercase tracking-[0.28em] font-black text-[#9f8b63]">Moly Daily</div>
                                <div className="text-[11px] text-[#9f8b63] font-semibold">Saturday Brief</div>
                            </div>
                            <div className="mt-4 flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="text-[31px] leading-[0.96] font-black tracking-tight text-slate-900 max-w-[230px]">{assistantGreeting.title}</div>
                                    <p className="mt-3 text-[13.5px] leading-relaxed text-slate-600">{assistantGreeting.body}</p>
                                </div>
                                <div className="w-[78px] h-[92px] border border-[#d8c7a3] rounded-[20px] flex flex-col items-center justify-center text-center">
                                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#9f8b63] font-black">Focus</div>
                                    <div className="text-[28px] font-black leading-none text-slate-900 mt-2">{todayTodos.length + overdueTodos.length}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-[1.15fr_0.85fr] gap-4 mt-5 pt-4 border-t border-[#ece2cb]">
                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[#9f8b63]">头条日程</div>
                                    <div className="text-[18px] leading-[1.02] font-black text-slate-900 mt-2">{assistantPrimarySchedule.title}</div>
                                    <div className="text-[12px] text-slate-500 mt-2">{assistantPrimarySchedule.timeText}</div>
                                    <div className={`inline-flex mt-3 px-2.5 py-1 rounded-full text-[10px] font-black border ${scheduleTone.soft}`}>{assistantPrimarySchedule.badge}</div>
                                </div>
                                <div className="border-l border-[#ece2cb] pl-4">
                                    {assistantSuggestedTodo ? (
                                        <>
                                            <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[#9f8b63]">社论建议</div>
                                            <div className="text-[17px] leading-[1.04] font-black text-slate-900 mt-2">{assistantSuggestedTodo.todo.title}</div>
                                            <div className="text-[12px] text-slate-500 mt-2">{assistantSuggestedTodo.reason}</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[#9f8b63]">Moly 社论</div>
                                            <div className="text-[12px] text-slate-500 mt-2">今天的主线相对稳定，重点是把节奏守住。</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'signal':
                return (
                    <motion.div key={assistantHomeVariant} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="space-y-4">
                        <div className="rounded-[34px] bg-white text-slate-900 border border-slate-200 shadow-[0_24px_56px_rgba(15,23,42,0.08)] p-5 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'repeating-linear-gradient(180deg, rgba(16,185,129,0.12) 0px, rgba(16,185,129,0.12) 1px, transparent 1px, transparent 9px)' }} />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.08),transparent_28%),radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.08),transparent_24%)]" />
                            <div className="relative space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] uppercase tracking-[0.28em] font-black text-emerald-700/55">Signal Wall / Live</div>
                                    <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-emerald-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Moly online
                                    </div>
                                </div>
                                <div className="grid grid-cols-[1.1fr_0.9fr] gap-3 items-end">
                                    <div>
                                        <div className="text-[34px] leading-[0.9] font-black tracking-tight text-slate-900 max-w-[210px]">{assistantGreeting.title}</div>
                                        <p className="mt-3 text-[13px] leading-relaxed text-slate-600">{assistantGreeting.body}</p>
                                    </div>
                                    <div className="rounded-[28px] border border-emerald-100 bg-emerald-50/60 p-4">
                                        <div className="text-[10px] uppercase tracking-[0.18em] font-black text-emerald-700/50">Load</div>
                                        <div className="flex items-end gap-1 mt-3">
                                            {[42, 66, 58, 78, 52, 84].map((height, index) => (
                                                <div key={index} className="flex-1 rounded-full bg-emerald-300/80" style={{ height }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-1">
                                    <div className="rounded-[26px] border border-emerald-100 bg-white px-4 py-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <div className="text-[10px] uppercase tracking-[0.18em] font-black text-emerald-700/45">Signal 01 / Schedule</div>
                                                <div className="text-[21px] leading-[1.03] font-black text-slate-900 mt-2">{assistantPrimarySchedule.title}</div>
                                            </div>
                                            <div className={`px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r ${scheduleTone.solid} text-white`}>
                                                {assistantPrimarySchedule.badge}
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between text-[12px] font-semibold text-slate-500">
                                            <span>{assistantPrimarySchedule.timeText}</span>
                                            <span>priority locked</span>
                                        </div>
                                    </div>
                                    {assistantSuggestedTodo && (
                                        <div className="rounded-[26px] border border-emerald-100 bg-white px-4 py-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <div className="text-[10px] uppercase tracking-[0.18em] font-black text-emerald-700/45">Signal 02 / Todo</div>
                                                    <div className="text-[20px] leading-[1.03] font-black text-slate-900 mt-2">{assistantSuggestedTodo.todo.title}</div>
                                                </div>
                                                <div className={`px-2.5 py-1 rounded-full text-[10px] font-black border border-white/10 ${todoTone.text}`}>
                                                    {assistantSuggestedTodo.badge}
                                                </div>
                                            </div>
                                            <p className="mt-3 text-[12px] leading-relaxed text-slate-600">{assistantSuggestedTodo.reason}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'curtain':
                return (
                    <motion.div key={assistantHomeVariant} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="space-y-4">
                        <div className="rounded-[34px] bg-white text-slate-900 p-5 shadow-[0_26px_66px_rgba(15,23,42,0.08)] relative overflow-hidden min-h-[344px] border border-slate-200">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.08),transparent_22%),radial-gradient(circle_at_85%_28%,rgba(245,158,11,0.08),transparent_20%),linear-gradient(180deg,rgba(15,23,42,0.02),transparent_58%)]" />
                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] uppercase tracking-[0.24em] font-black text-slate-400">Time Curtain</div>
                                    <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-[0.16em]">Today Live</div>
                                </div>
                                <div className="mt-6 text-[12px] uppercase tracking-[0.18em] font-black text-slate-400">{assistantPrimarySchedule.eyebrow}</div>
                                <div className="mt-2 text-[44px] leading-[0.88] font-black tracking-tight max-w-[220px] text-slate-900">{assistantPrimarySchedule.timeText.replace('今天 ', '')}</div>
                                <div className="mt-3 text-[28px] leading-[0.96] font-black tracking-tight max-w-[260px] text-slate-900">{assistantGreeting.title}</div>
                                <p className="mt-3 text-[13px] leading-relaxed text-slate-600 max-w-[280px]">{assistantGreeting.body}</p>
                                <div className="mt-6 space-y-3">
                                    <div className="rounded-[28px] bg-slate-50 border border-slate-200 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-[10px] uppercase tracking-[0.18em] font-black text-slate-400">Curtain Focus</div>
                                                <div className="text-[22px] leading-[1.02] font-black mt-2">{assistantPrimarySchedule.title}</div>
                                            </div>
                                            <div className={`px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r ${scheduleTone.solid} text-white`}>
                                                {assistantPrimarySchedule.badge}
                                            </div>
                                        </div>
                                    </div>
                                    {assistantSuggestedTodo && (
                                        <div className="rounded-[28px] bg-white text-slate-900 border border-slate-200 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                                            <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[#af7a33]">Stage Next</div>
                                            <div className="text-[20px] leading-[1.03] font-black mt-2">{assistantSuggestedTodo.todo.title}</div>
                                            <p className="mt-3 text-[12px] leading-relaxed text-slate-600">{assistantSuggestedTodo.reason}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'ledger':
                return (
                    <motion.div key={assistantHomeVariant} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="space-y-4">
                        <div className="rounded-[34px] bg-white border border-slate-200 shadow-[0_20px_50px_rgba(148,163,184,0.1)] p-5 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: 'linear-gradient(90deg, rgba(153,120,65,0.12) 1px, transparent 1px), linear-gradient(180deg, rgba(153,120,65,0.08) 1px, transparent 1px)', backgroundSize: '72px 72px, 100% 34px' }} />
                            <div className="relative">
                                <div className="flex items-center justify-between border-b border-[#d8c6a7] pb-3">
                                    <div>
                                        <div className="text-[11px] uppercase tracking-[0.24em] font-black text-[#9c8052]">Executive Ledger</div>
                                        <div className="text-[26px] leading-none font-black tracking-tight text-slate-900 mt-2">今日账页</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[#9c8052]">Pending</div>
                                        <div className="text-[28px] leading-none font-black text-slate-900 mt-2">{todayTodos.length + overdueTodos.length + pendingMemoryCount}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[96px_1fr] gap-y-4 gap-x-3 mt-5 text-slate-900">
                                    <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[#9c8052]">Greeting</div>
                                    <div>
                                        <div className="text-[24px] leading-[0.98] font-black">{assistantGreeting.title}</div>
                                        <p className="mt-2 text-[12px] leading-relaxed text-slate-600">{assistantGreeting.body}</p>
                                    </div>
                                    <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[#9c8052]">Schedule</div>
                                    <div className="border-t border-dashed border-[#d8c6a7] pt-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-[21px] leading-[1.02] font-black">{assistantPrimarySchedule.title}</div>
                                                <div className="text-[12px] text-slate-500 mt-2">{assistantPrimarySchedule.timeText}</div>
                                            </div>
                                            <div className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${scheduleTone.soft}`}>{assistantPrimarySchedule.badge}</div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[#9c8052]">Todo</div>
                                    <div className="border-t border-dashed border-[#d8c6a7] pt-3">
                                        {assistantSuggestedTodo ? (
                                            <>
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="text-[20px] leading-[1.02] font-black">{assistantSuggestedTodo.todo.title}</div>
                                                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${todoTone.soft}`}>{assistantSuggestedTodo.badge}</div>
                                                </div>
                                                <p className="mt-2 text-[12px] leading-relaxed text-slate-600">{assistantSuggestedTodo.reason}</p>
                                            </>
                                        ) : (
                                            <div className="text-[12px] leading-relaxed text-slate-500">当前没有需要紧急插队的待办，账面比较干净。</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'mosaic':
                return (
                    <motion.div key={assistantHomeVariant} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="space-y-4">
                        <div className="rounded-[34px] bg-white border border-slate-200 shadow-[0_20px_54px_rgba(148,163,184,0.1)] p-4">
                            <div className="grid grid-cols-[1.1fr_0.9fr] gap-3 auto-rows-[112px]">
                                <div className="rounded-[30px] bg-[#0f172a] text-white p-4 row-span-2 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_28%),radial-gradient(circle_at_10%_80%,rgba(244,114,182,0.16),transparent_30%)]" />
                                    <div className="relative">
                                        <div className="text-[10px] uppercase tracking-[0.2em] font-black text-white/38">Mosaic Lead</div>
                                        <div className="text-[30px] leading-[0.94] font-black tracking-tight mt-4 max-w-[170px]">{assistantGreeting.title}</div>
                                        <p className="mt-3 text-[12px] leading-relaxed text-white/62">{assistantGreeting.body}</p>
                                    </div>
                                </div>
                                <div className={`rounded-[28px] bg-gradient-to-br ${scheduleTone.solid} text-white p-4 shadow-[0_16px_34px_rgba(37,99,235,0.18)]`}>
                                    <div className="text-[10px] uppercase tracking-[0.18em] font-black text-white/60">Schedule Tile</div>
                                    <div className="text-[14px] font-black leading-snug mt-3">{assistantPrimarySchedule.title}</div>
                                    <div className="text-[11px] text-white/72 mt-2">{assistantPrimarySchedule.timeText}</div>
                                </div>
                                <div className="rounded-[28px] bg-white border border-slate-200 p-4">
                                    <div className="text-[10px] uppercase tracking-[0.18em] font-black text-slate-400">Moly Note</div>
                                    <div className="text-[22px] font-black tracking-tight text-slate-900 mt-2">{todayTodos.length + overdueTodos.length}</div>
                                    <div className="text-[12px] text-slate-500 mt-1">当前焦点数量</div>
                                </div>
                                {assistantSuggestedTodo ? (
                                    <div className="rounded-[30px] bg-[#fff8ee] border border-[#f1dfc0] p-4 col-span-2 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full w-2 bg-[#e0a85a]" />
                                        <div className="pl-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[#b18144]">Recommended Tile</div>
                                                    <div className="text-[21px] leading-[1.02] font-black text-slate-900 mt-2">{assistantSuggestedTodo.todo.title}</div>
                                                </div>
                                                <div className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${todoTone.soft}`}>{assistantSuggestedTodo.badge}</div>
                                            </div>
                                            <p className="mt-3 text-[12px] leading-relaxed text-slate-600">{assistantSuggestedTodo.reason}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-[30px] bg-white border border-slate-200 p-4 col-span-2">
                                        <div className="text-[10px] uppercase tracking-[0.18em] font-black text-slate-400">Open Tile</div>
                                        <div className="text-[18px] font-black text-slate-900 mt-2">当前可以主动安排一个新的高价值时间块</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return (
                    <motion.div key={assistantHomeVariant} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="space-y-4">
                        {scheduleBlock}
                        {todoBlock}
                    </motion.div>
                );
        }
    };

    // --- Views ---

    const ListView = () => (
        <div className="flex flex-col h-full bg-[#F8F9FA] relative">
            {/* Header — 任务 tab uses the 日程 / 待办 switcher; other tabs use a plain title */}
            {activeTab === '任务' ? (
                <div className="pt-14 pb-0 px-6 bg-white shadow-sm z-10 shrink-0">
                    <div className="flex items-center justify-between pb-3">
                        {/* Dual label switcher matching reference design */}
                        <div className="flex items-center gap-5">
                            {['日程', '待办'].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setTaskView(v)}
                                    className={`flex flex-col items-center gap-0.5 transition-all ${taskView === v ? 'opacity-100' : 'opacity-35'}`}
                                >
                                    <span className={`text-[17px] font-bold tracking-tight ${taskView === v ? 'text-slate-900' : 'text-slate-500'}`}>{v}</span>
                                    <div className={`h-[2.5px] w-full rounded-full transition-all ${taskView === v ? 'bg-slate-900' : 'bg-transparent'}`} />
                                </button>
                            ))}
                        </div>
                        {taskView === '待办' && (
                            <button
                                onClick={() => setTodoView(v => v === 'dashboard' ? 'all' : 'dashboard')}
                                className={`w-10 h-10 rounded-[12px] flex items-center justify-center transition-colors ${todoView === 'all' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-inner' : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'}`}
                            >
                                {todoView === 'dashboard' ? <LayoutGrid size={20} /> : <ListTodo size={20} />}
                            </button>
                        )}
                    </div>
                    {taskView === '待办' && (
                        <div className="pb-4 -mx-6 px-6 overflow-x-auto scrollbar-hide">
                            <div className="flex items-center gap-2 min-w-max">
                                {TODO_FILTERS.map((filter) => {
                                    const isActive = activeTodoFilter === filter;
                                    return (
                                        <button
                                            key={filter}
                                            type="button"
                                            onClick={() => setActiveTodoFilter(filter)}
                                            aria-label={filter}
                                            className={`h-[34px] px-3 rounded-[10px] border flex items-center gap-1.5 text-[13px] font-semibold transition-all active:scale-[0.98] ${
                                                isActive
                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-[0_6px_14px_rgba(15,23,42,0.08)]'
                                                    : 'bg-white text-[#8a857f] border-[#ebe7e2]'
                                            }`}
                                        >
                                            {filter === '被督办' && <TagIcon size={14} strokeWidth={1.75} className={isActive ? 'text-white' : 'text-[#8a857f]'} />}
                                            <span>{filter}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            ) : activeTab !== '记忆' && activeTab !== '联系人' && activeTab !== '会议记录' && (
                <div className="pt-14 pb-3 px-6 bg-white flex justify-between items-center shadow-sm z-10 shrink-0">
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{activeTab}</h1>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                        <LayoutGrid size={20} className="text-slate-600" />
                    </div>
                </div>
            )}

            <div className={activeTab === '联系人' ? 'flex-1 min-h-0' : 'flex-1 overflow-y-auto px-4 pt-4 pb-36'}>
                {activeTab === '任务' && taskView === '待办' ? (
                    todoView === 'all' ? (
                        <>
                            <div className="space-y-1.5 mb-6 animate-in fade-in duration-200">
                                {filteredSortedUnfinished.map(todo => (
                                    <TodoItem key={todo.id} todo={todo} onToggle={toggleComplete} onCancel={cancelPendingMove} onDetail={() => { setSelectedTodoId(todo.id); setView('detail'); }} tags={tags} />
                                ))}
                            </div>

                            {filteredSortedFinished.length > 0 && (
                                <div className="mt-8 mb-4 animate-in fade-in duration-200">
                                    <button onClick={() => setIsFinishedExpanded(!isFinishedExpanded)} className="flex items-center gap-2 mb-3 ml-2 group w-full text-left">
                                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">已完成 ({filteredSortedFinished.length})</span>
                                        <div className="h-[1px] flex-1 bg-slate-200" />
                                        {isFinishedExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                                    </button>

                                    {isFinishedExpanded && (
                                        <div className="space-y-1.5 opacity-60">
                                            {filteredSortedFinished.map(todo => (
                                                <TodoItem key={todo.id} todo={todo} onToggle={toggleComplete} onDetail={() => { setSelectedTodoId(todo.id); setView('detail'); }} tags={tags} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-8 pb-10 animate-in fade-in duration-200">
                            {/* 今日关注 */}
                            <section>
                                <div className="flex items-center gap-2 mb-3 px-1">
                                    <div className="w-1.5 h-4 bg-red-500 rounded-full"></div>
                                    <h2 className="text-sm font-bold text-slate-800">今日关注</h2>
                                    {todayTodos.length > 0 && (
                                        <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full">{todayTodos.length}</span>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    {todayTodos.length > 0 ? todayTodos.map(todo => (
                                        <TodoItem key={todo.id} todo={todo} onToggle={toggleComplete} onCancel={cancelPendingMove} onDetail={() => { setSelectedTodoId(todo.id); setView('detail'); }} tags={tags} />
                                    )) : (
                                        <div className="text-xs text-slate-400 p-4 text-center bg-white rounded-[12px] border border-dashed border-slate-200 shadow-sm">今日暂无必须完成的任务，去看看精力池吧</div>
                                    )}
                                </div>
                            </section>

                            {/* 按精力分配 */}
                            <section>
                                <div className="flex items-center gap-2 mb-4 px-1">
                                    <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                                    <h2 className="text-sm font-bold text-slate-800">按精力池挑选</h2>
                                </div>

                                <div className="space-y-0">
                                    {/* Horizontal Folder Tabs */}
                                    <div className="flex px-2 translate-y-[1px]">
                                        <button
                                            onClick={() => setExpandedEnergy('high')}
                                            className={`relative flex-1 flex items-center justify-center gap-1.5 py-3 px-2 rounded-t-xl text-sm font-bold transition-all ${expandedEnergy === 'high' ? 'bg-orange-50/80 text-orange-600 z-10' : 'bg-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                                        >
                                            <BatteryCharging size={16} />
                                            <span>高精力</span>
                                        </button>
                                        <button
                                            onClick={() => setExpandedEnergy('medium')}
                                            className={`relative flex-1 flex items-center justify-center gap-1.5 py-3 px-2 rounded-t-xl text-sm font-bold transition-all ${expandedEnergy === 'medium' ? 'bg-blue-50/80 text-blue-600 z-10' : 'bg-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                                        >
                                            <BatteryMedium size={16} />
                                            <span>中等精力</span>
                                        </button>
                                        <button
                                            onClick={() => setExpandedEnergy('low')}
                                            className={`relative flex-1 flex items-center justify-center gap-1.5 py-3 px-2 rounded-t-xl text-sm font-bold transition-all ${expandedEnergy === 'low' ? 'bg-green-50/80 text-green-600 z-10' : 'bg-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                                        >
                                            <Battery size={16} />
                                            <span>低精力</span>
                                        </button>
                                    </div>

                                    {/* Selected Content Area (Folder Body) */}
                                    <div className={`p-4 rounded-[16px] rounded-tr-[12px] transition-colors duration-300 ${expandedEnergy === 'high' ? 'bg-orange-50/80' :
                                        expandedEnergy === 'medium' ? 'bg-blue-50/80' :
                                            'bg-green-50/80'
                                        }`}>
                                        <div className="animate-in fade-in duration-200">
                                            {expandedEnergy === 'high' && (
                                                <div className="space-y-2">
                                                    {highEnergyTodos.map(todo => (
                                                        <TodoItem key={todo.id} todo={todo} onToggle={toggleComplete} onCancel={cancelPendingMove} onDetail={() => { setSelectedTodoId(todo.id); setView('detail'); }} tags={tags} />
                                                    ))}
                                                    {highEnergyTodos.length === 0 && <div className="text-[11px] text-orange-400 py-6 text-center bg-white/50 rounded-[12px]">🎉 今日暂无高精力任务安排</div>}
                                                </div>
                                            )}

                                            {expandedEnergy === 'medium' && (
                                                <div className="space-y-2">
                                                    {mediumEnergyTodos.map(todo => (
                                                        <TodoItem key={todo.id} todo={todo} onToggle={toggleComplete} onCancel={cancelPendingMove} onDetail={() => { setSelectedTodoId(todo.id); setView('detail'); }} tags={tags} />
                                                    ))}
                                                    {mediumEnergyTodos.length === 0 && <div className="text-[11px] text-blue-400 py-6 text-center bg-white/50 rounded-[12px]">🎉 今日暂无中等精力任务安排</div>}
                                                </div>
                                            )}

                                            {expandedEnergy === 'low' && (
                                                <div className="space-y-2">
                                                    {lowEnergyTodos.map(todo => (
                                                        <TodoItem key={todo.id} todo={todo} onToggle={toggleComplete} onCancel={cancelPendingMove} onDetail={() => { setSelectedTodoId(todo.id); setView('detail'); }} tags={tags} />
                                                    ))}
                                                    {lowEnergyTodos.length === 0 && <div className="text-[11px] text-green-400 py-6 text-center bg-white/50 rounded-[12px]">🎉 今日暂无低精力任务安排</div>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 逾期任务 */}
                            {overdueTodos.length > 0 && (
                                <section>
                                    <div className="flex items-center gap-2 mb-3 px-1 mt-6">
                                        <div className="w-1.5 h-4 bg-slate-400 rounded-full"></div>
                                        <h2 className="text-sm font-bold text-slate-800">近期逾期</h2>
                                        <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full">{overdueTodos.length}</span>
                                    </div>
                                    <div className="space-y-1.5 opacity-70 grayscale-[30%]">
                                        {overdueTodos.map(todo => (
                                            <TodoItem key={todo.id} todo={todo} onToggle={toggleComplete} onCancel={cancelPendingMove} onDetail={() => { setSelectedTodoId(todo.id); setView('detail'); }} tags={tags} />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )
                ) : activeTab === '任务' && taskView === '日程' ? (
                    <div className="flex flex-col h-full relative">
                        {/* Header Calendar Row - Dynamic Real-Time */}
                        <div className="px-5 pt-8 pb-4 bg-white shrink-0 sticky top-0 z-20 border-b border-gray-100/50">
                            <div className="flex items-center justify-between mb-6 relative">
                                <button
                                    onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
                                    className="w-10 h-10 flex items-center justify-center -ml-2 text-gray-400 hover:text-gray-600 relative z-10 active:scale-95 transition-all"
                                >
                                    <ChevronLeft size={24} strokeWidth={2.5} />
                                </button>
                                <h1 className="text-[19px] font-extrabold text-gray-900 tracking-tight absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                                    {format(selectedDate, 'yyyy年 M月', { locale: zhCN })}
                                </h1>
                                <div className="flex items-center gap-2 relative z-10">
                                    <button
                                        onClick={() => setSelectedDate(new Date())}
                                        className="px-3 h-[34px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full text-[13px] font-bold text-gray-600 active:scale-95 transition-all"
                                    >
                                        今天
                                    </button>
                                    <button
                                        onClick={() => setIsCalendarMgmtOpen(true)}
                                        className="w-[34px] h-[34px] flex items-center justify-center text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full active:scale-95 transition-all"
                                    >
                                        <Menu size={18} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>

                            {/* Calendar Grid Header */}
                            <div className="grid grid-cols-7 mb-3 px-1">
                                {['日', '一', '二', '三', '四', '五', '六'].map((day, i) => (
                                    <div key={i} className="text-[11px] font-bold text-gray-300 text-center">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid Body - Dynamic Week View */}
                            <div className="grid grid-cols-7 gap-y-2 gap-x-1 px-1">
                                {Array.from({ length: 7 }).map((_, i) => {
                                    // Calculate the exact dates for the week containing `selectedDate`
                                    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Sunday as start
                                    const dateObj = addDays(weekStart, i);

                                    const dateNumber = dateObj.getDate();
                                    const isActiveToday = isSameDay(dateObj, new Date());
                                    const isSelected = isSameDay(dateObj, selectedDate);

                                    // Check if this date has any events in the todos list
                                    const hasEvent = todos.some(t => {
                                        if (!isEventTask(t)) return false;
                                        return isSameDay(new Date(t.start_time), dateObj);
                                    });

                                    return (
                                        <div key={i} className="flex flex-col items-center justify-center h-[44px] w-full relative cursor-pointer group" onClick={() => setSelectedDate(dateObj)}>
                                            <div className={`flex flex-col items-center justify-center w-[36px] h-[36px] rounded-full transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : isActiveToday ? 'bg-gray-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                                                <span className={`text-[15px] leading-none ${isSelected || isActiveToday ? 'font-bold' : 'font-medium'}`}>{dateNumber}</span>
                                            </div>
                                            {hasEvent && !isSelected && <div className="w-1 h-1 rounded-full bg-indigo-300 absolute bottom-0 opacity-80" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Timeline Events Body */}
                        <div className="flex-1 bg-[#FAFAFB] relative pb-32 overflow-y-auto">
                            <div className="pt-6 px-5 space-y-8 tracking-tight">
                                {Array.from({ length: 24 }).map((_, hour) => {
                                    const hourStart = new Date(selectedDate);
                                    hourStart.setHours(hour, 0, 0, 0);
                                    const hourEnd = new Date(selectedDate);
                                    hourEnd.setHours(hour + 1, 0, 0, 0);

                                    // Find tasks that overlap with this hour
                                    const hourTasks = todos.filter(t => {
                                        if (!isEventTask(t)) return false;
                                        const eventStart = new Date(t.start_time);
                                        const eventEnd = new Date(t.end_time);
                                        // Simple overlap check
                                        return eventStart < hourEnd && eventEnd > hourStart;
                                    });

                                    return (
                                        <div key={hour} className="flex items-start gap-4">
                                            <div className="w-[45px] shrink-0 pt-[6px] relative">
                                                <span className="text-[12px] font-bold text-gray-300 w-full inline-block text-right">{hour.toString().padStart(2, '0')}:00</span>
                                            </div>
                                            <div className="flex-1 min-h-[48px] border-t border-gray-100/80 pt-1 -mt-1 relative">
                                                {hourTasks.map((task, idx) => {
                                                    // Only render the block in the hour it starts, or hour 0 if it spans multiple days (simplified for this demo)
                                                    const taskStartHour = new Date(task.start_time).getHours();
                                                    const taskStartDate = new Date(task.start_time).getDate();

                                                    // Render conditions:
                                                    // 1. Task starts in this exact hour on the selected date
                                                    // 2. OR task started before today, and this is hour 0 (carry-over event)
                                                    const shouldRenderBlockHere =
                                                        (taskStartHour === hour && taskStartDate === selectedDate.getDate()) ||
                                                        (taskStartDate < selectedDate.getDate() && hour === 0);

                                                    if (!shouldRenderBlockHere) return null;

                                                    // Calculate visual height based on duration (simplified)
                                                    const durationHours = (new Date(task.end_time) - new Date(task.start_time)) / (1000 * 60 * 60);
                                                    const heightCss = Math.max(1, durationHours) * 60 + 'px'; // roughly 60px per hour

                                                    // Determine colors based on energy level
                                                    const bgClass = task.energy === 'high' ? 'bg-orange-50/80 border-orange-100/50' : task.energy === 'low' ? 'bg-emerald-50/80 border-emerald-100/50' : 'bg-blue-50/80 border-blue-100/50';
                                                    const lineClass = task.energy === 'high' ? 'bg-orange-400' : task.energy === 'low' ? 'bg-emerald-400' : 'bg-blue-400';
                                                    const titleClass = task.energy === 'high' ? 'text-orange-900' : task.energy === 'low' ? 'text-emerald-900' : 'text-blue-900';
                                                    const timeClass = task.energy === 'high' ? 'text-orange-500/80' : task.energy === 'low' ? 'text-emerald-500/80' : 'text-blue-500/80';

                                                    return (
                                                        <div key={`${task.id}-${idx}`} style={{ minHeight: heightCss }} className={`w-full rounded-2xl border flex overflow-hidden p-3 pb-2 relative group cursor-pointer active:scale-[0.99] transition-transform shadow-sm mb-2 backdrop-blur-sm ${bgClass}`}>
                                                            <div className={`absolute left-0 top-0 bottom-0 w-[4px] opacity-80 ${lineClass}`}></div>
                                                            <div className="pl-3 flex flex-col justify-start">
                                                                <span className={`text-[13.5px] font-bold leading-snug ${titleClass} tracking-tight`}>{task.title}</span>
                                                                <span className={`text-[10px] mt-1 font-semibold ${timeClass}`}>{formatTimeDisplay(task.start_time)} - {formatTimeDisplay(task.end_time)}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Calendar Management Flyout Modal */}
                        {isCalendarMgmtOpen && (
                            <>
                                <div
                                    className="absolute inset-0 bg-black/20 z-40 transition-opacity"
                                    onClick={() => setIsCalendarMgmtOpen(false)}
                                />
                                <div className="absolute top-0 right-0 bottom-0 w-[80%] bg-[#F5F5F5] z-50 shadow-[-10px_0_30px_rgba(0,0,0,0.08)] flex flex-col pointer-events-auto overflow-hidden">
                                    {/* Header */}
                                    <div className="pt-16 px-5 pb-5 shrink-0 bg-[#F5F5F5]">
                                        <div className="font-extrabold text-[17px] text-gray-900 tracking-tight">
                                            日历管理
                                        </div>
                                    </div>

                                    {/* Content list */}
                                    <div className="px-3 shrink-0">
                                        <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-[1px] font-bold text-gray-800">
                                            <div className="flex items-center gap-[10px] px-3 py-3 border-b border-gray-100/60">
                                                {/* Feishu Logo */}
                                                <div className="w-[18px] h-[18px] rounded flex items-center justify-center shrink-0">
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.68537 13.9142L8.54922 8.5H19.0494L16.2081 12.3396C15.6174 13.1378 14.6858 13.6149 13.6938 13.6149H4.80911C4.55136 13.6149 4.45524 14.2259 4.68537 13.9142Z" fill="#1A93EA" />
                                                        <path d="M4.68537 13.9142L8.54922 19.3283H19.0494L16.2081 15.4888C15.6174 14.6905 14.6858 14.2135 13.6938 14.2135H4.80911C4.55136 14.2135 4.45524 13.6025 4.68537 13.9142Z" fill="#1A93EA" />
                                                        <circle cx="9.5" cy="5.5" r="3.5" fill="#1A93EA" />
                                                    </svg>
                                                </div>
                                                <span className="font-bold text-[14.5px] text-gray-900 tracking-tight">飞书</span>
                                            </div>

                                            {/* Items */}
                                            <div className="px-[5px] py-[6px] space-y-[2px]">
                                                {[
                                                    { id: '1', label: '董江涵', checked: true, color: 'bg-[#1881FF]' },
                                                    { id: '2', label: '来自 Moly 日历', checked: true, color: 'bg-[#1881FF]' },
                                                    { id: '3', label: '18600241181djh@gmail.com', checked: true, color: 'bg-[#A69EF0]' },
                                                    { id: '4', label: '家庭', checked: true, color: 'bg-[#A69EF0]' }
                                                ].map(item => (
                                                    <div key={item.id} className="flex items-center gap-[12px] px-2 py-[8px] hover:bg-gray-50 rounded-[10px] transition-colors cursor-pointer">
                                                        <div className={`w-[17px] h-[17px] rounded-[4px] flex items-center justify-center shrink-0 ${item.checked ? item.color : 'border border-gray-300 bg-white'}`}>
                                                            {item.checked && <Check size={12} strokeWidth={4} className="text-white relative top-[0.5px]" />}
                                                        </div>
                                                        <span className="text-[14.5px] text-gray-700 font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis mr-2">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1" />

                                    {/* Bottom settings */}
                                    <div className="shrink-0 bg-[#F5F5F5]">
                                        <div
                                            onClick={() => { setIsCalendarMgmtOpen(false); setView('schedule_settings'); }}
                                            className="flex items-center justify-between px-6 py-[16px] border-t border-gray-200/80 cursor-pointer hover:bg-gray-200/50 transition-colors"
                                        >
                                            <span className="font-bold text-gray-700 text-[14px]">设置</span>
                                            <ChevronRight size={16} strokeWidth={2.5} className="text-gray-400" />
                                        </div>
                                        <div className="pb-8 bg-transparent"></div> {/* iPhone bottom padding */}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : activeTab === '联系人' ? (
                    contactWorkspaceScreen === 'contacts' ? (
                        <ContactsPhoneList onOpenMyCard={() => setContactWorkspaceScreen('my-card')} />
                    ) : (
                        <MyCardPhoneView
                            onBack={() => setContactWorkspaceScreen('contacts')}
                        />
                    )
                ) : activeTab === '记忆' ? (() => {
                    // ── Memory Tab — Scrollable Tags + Expandable Cards ──
                    // Compute days remaining for unconfirmed memories (7-day window)
                    const getDaysLeft = (updatedAt) => {
                        const updated = new Date(updatedAt);
                        const expiry = new Date(updated.getTime() + 7 * 24 * 60 * 60 * 1000);
                        const now = new Date('2026-03-27'); // demo date
                        const diff = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
                        return Math.max(0, diff);
                    };

                    const tagColors = {
                        '身份':'text-violet-600', '偏好':'text-rose-500', '习惯':'text-amber-600',
                        '风格':'text-sky-500', '关系':'text-pink-500', '决策':'text-indigo-500', '近况':'text-emerald-600',
                    };
                    const tagIcons = {
                        '身份':'👤','偏好':'💡','习惯':'🔁','风格':'✍️','关系':'🤝','决策':'⚖️','近况':'📌',
                    };
                    const relIcons = {
                        contact: <Users size={11} className="text-slate-400"/>,
                        meeting: <Mic size={11} className="text-slate-400"/>,
                        schedule: <Calendar size={11} className="text-slate-400"/>,
                        chat: <MessageCircle size={11} className="text-slate-400"/>,
                        todo: <CheckSquare size={11} className="text-slate-400"/>,
                    };

                    return (
                        <div className="flex flex-col h-full bg-[#F8F9FA]">
                            {/* Header */}
                            <div className="pt-14 pb-0 px-5 bg-white shadow-sm z-10 shrink-0">
                                <div className="flex justify-between items-center pb-3">
                                    <h1 className="text-[20px] font-extrabold text-slate-900 tracking-tight">记忆库</h1>
                                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                                        持续学习中
                                    </div>
                                </div>
                                {/* Scrollable pill tags */}
                                <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide">
                                    {MEMORY_TAGS.map(tag => (
                                        <button key={tag} onClick={() => { setActiveMemoryTag(tag); setExpandedMemoryId(null); }}
                                            className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap border transition-all shrink-0 ${
                                                activeMemoryTag === tag
                                                    ? (tag === '待确认' ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-900 text-white border-slate-900')
                                                    : (tag === '待确认' ? 'bg-amber-50 text-amber-600 border-amber-200 hover:border-amber-300' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300')
                                            }`}>
                                            {tag}{tag === '待确认' && pendingMemoryCount > 0 && <span className="ml-1 text-[10px] opacity-80">{pendingMemoryCount}</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cards */}
                            <div className="flex-1 overflow-y-auto px-4 pt-3 pb-36 space-y-2.5">
                                {filteredMemories.map(mem => {
                                    const isOpen = expandedMemoryId === mem.id;
                                    return (
                                        <div key={mem.id}
                                            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all">
                                            {/* Main row */}
                                            <div className="px-4 py-3.5 flex items-start gap-3">
                                                <button
                                                    onClick={() => setExpandedMemoryId(isOpen ? null : mem.id)}
                                                    className="flex items-start gap-3 flex-1 min-w-0 text-left"
                                                >
                                                    <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                                                    {/* Tag + confirmed badge row */}
                                                        <div className="flex items-center gap-2 w-full">
                                                            <div className={`flex items-center gap-1 text-[11px] font-semibold ${tagColors[mem.tag] || 'text-slate-500'}`}>
                                                                <span>{tagIcons[mem.tag]}</span>
                                                                {mem.tag}
                                                            </div>
                                                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold border ${
                                                                mem.confirmed
                                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                                            }`}>
                                                                {mem.confirmed ? '已确认' : `待确认 · ${getDaysLeft(mem.updatedAt)}天`}
                                                            </span>
                                                            <span className="ml-auto text-[10px] text-slate-300 shrink-0">{mem.updatedAt}</span>
                                                        </div>
                                                        {/* Fact text */}
                                                        <p className="text-[13px] text-slate-800 leading-relaxed">{mem.text}</p>
                                                    </div>
                                                    <ChevronDown size={14} className={`text-slate-300 mt-2 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}/>
                                                </button>
                                                {!mem.confirmed && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleConfirmMemory(mem.id)}
                                                        className="w-9 h-9 shrink-0 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                                                        aria-label={`确认记忆：${mem.text}`}
                                                        title="确认这条记忆"
                                                    >
                                                        <Check size={15} strokeWidth={3} />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Expanded detail */}
                                            {isOpen && (
                                                <div className="px-4 pb-4 pt-0 space-y-2.5 border-t border-slate-50">
                                                    {!mem.confirmed && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleConfirmMemory(mem.id)}
                                                            className="mt-2.5 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-white text-[13px] font-bold py-3 shadow-[0_10px_24px_rgba(16,185,129,0.22)] active:scale-[0.99] transition-transform"
                                                        >
                                                            <Check size={14} strokeWidth={3} />
                                                            确认这条记忆
                                                        </button>
                                                    )}
                                                    {/* Source */}
                                                    <div className="mt-2.5 bg-slate-50 rounded-xl p-3">
                                                        <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-1">信息来源</div>
                                                        <p className="text-[12px] text-slate-600 leading-relaxed">{mem.detail.source}</p>
                                                    </div>
                                                    {/* Time */}
                                                    <div className="flex items-center gap-1.5 px-1">
                                                        <Clock size={11} className="text-slate-300"/>
                                                        <span className="text-[11px] text-slate-400">首次记录 {mem.detail.time}</span>
                                                        {mem.updatedAt !== mem.detail.time && (
                                                            <span className="text-[11px] text-slate-400 ml-1">· 更新于 {mem.updatedAt}</span>
                                                        )}
                                                    </div>
                                                    {/* Related entities */}
                                                    {mem.detail.related.length > 0 && (
                                                        <div className="px-1">
                                                            <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">关联</div>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {mem.detail.related.map((r, i) => (
                                                                    <span key={i} className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1 rounded-full">
                                                                        {relIcons[r.type] || null}
                                                                        {r.name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })() : activeTab === '会议记录' ? <MeetingsDemo /> : null /* Fallback */}
            </div>


            {/* Global Assistant FAB (Visible below all tabs when in main 'list' view) */}
            {view === 'list' && !(activeTab === '联系人' && contactWorkspaceScreen === 'my-card') && (
                <div className="absolute bottom-8 left-0 right-0 px-6 flex items-center justify-between z-50 pointer-events-none">
                    <div className="flex-1 max-w-[274px] h-[56px] bg-[#F7F6F4]/96 backdrop-blur-xl rounded-[14px] border border-[#E7E4E0] shadow-[0_10px_20px_rgba(15,23,42,0.06)] flex items-center justify-around px-2 pointer-events-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`relative flex items-center justify-center transition-all duration-200 ${
                                        isActive
                                            ? 'w-11 h-11 bg-white rounded-[10px] shadow-[0_6px_12px_rgba(15,23,42,0.05)] border border-[#ECE9E5]'
                                            : 'w-11 h-11 rounded-[10px] hover:bg-white/70'
                                    }`}
                                >
                                    <Icon size={20} className={isActive ? 'text-slate-900' : 'text-[#9A958D]'} strokeWidth={1.75} />
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setIsAssistantOpen(true)}
                        className="w-[56px] h-[56px] bg-[#F7F6F4]/96 rounded-[14px] shadow-[0_10px_20px_rgba(15,23,42,0.06)] border border-[#E7E4E0] flex items-center justify-center pointer-events-auto active:scale-95 transition-transform"
                    >
                        <div className="w-11 h-11 bg-slate-900 rounded-[10px] flex items-center justify-center text-white">
                            <Sparkles size={20} className="text-white" strokeWidth={1.75} />
                        </div>
                    </button>
                </div>
            )}
        </div>
    );

    const TodoItem = ({ todo, onToggle, onCancel, onDetail, tags }) => {
        const isDone = todo.status === 'finished' || todo.isVisuallyDone;
        const tag = tags.find(t => t.id === todo.tag_id);

        return (
            <div
                onClick={onDetail}
                className={`bg-white rounded-[12px] py-2.5 px-4 flex items-center gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.02)] border border-slate-100/50 transition-all active:scale-[0.99] ${todo.isVisuallyDone ? 'bg-slate-50' : ''}`}
            >
                <div onClick={(e) => { e.stopPropagation(); todo.isVisuallyDone ? onCancel(todo.id) : onToggle(todo.id); }} className="cursor-pointer shrink-0">
                    {isDone ? (
                        <div className="text-blue-500 bg-blue-50 rounded-full p-0.5"><CheckCircle2 size={20} /></div>
                    ) : (
                        <Circle className="text-slate-300" size={20} />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[14px] font-semibold truncate flex-1 ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {todo.title}
                        </span>
                        {tag && (
                            <div className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tight ${tag.color} ${isDone ? 'opacity-50 grayscale' : ''}`}>
                                {tag.name}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
                        {todo.due_time && (
                            <div className={`text-[10px] flex items-center gap-1 ${isOverdue(todo.due_time) && !isDone ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                                <Clock size={10} />
                                {formatTimeDisplay(todo.due_time)}
                            </div>
                        )}
                        {todo.supervision?.enabled && (() => {
                            const resultMap = {
                                in_progress: { label: '正在推进', cls: 'text-blue-600 bg-blue-50' },
                                claimed_done: { label: '已完成', cls: 'text-emerald-600 bg-emerald-50' },
                                unreachable: { label: '未回复', cls: 'text-slate-500 bg-slate-100' },
                            };
                            const res = resultMap[todo.supervision?.result];
                            return (
                                <div className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${res ? res.cls : 'text-orange-500 bg-orange-50'}`}>
                                    <UserCircle2 size={9} />
                                    督办{res ? ` · ${res.label}` : ''} · {todo.supervision.contact_id || '待选'}
                                </div>
                            );
                        })()}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {todo.supervision?.enabled && todo.supervision?.contact_id && (
                        <button
                            onClick={(e) => { e.stopPropagation(); triggerSupervision(todo); }}
                            className="text-[10px] font-bold text-orange-500 bg-orange-50 border border-orange-200 px-2 py-1 rounded-full active:scale-95 transition-all hover:bg-orange-100 whitespace-nowrap"
                        >
                            📨 演示
                        </button>
                    )}
                    <ChevronRight size={14} className="text-slate-200" />
                </div>
            </div>
        );
    };

    const DetailView = () => {
        if (!selectedTodo) return null;
        const tag = tags.find(t => t.id === selectedTodo.tag_id);

        return (
            <div className="flex flex-col h-full bg-[#F8F9FA] z-20 overflow-hidden">
                <div className="h-14 px-4 bg-white flex items-center justify-between border-b border-slate-50 shrink-0">
                    <button onClick={() => setView('list')} className="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100 transition-colors">
                        <ChevronLeft size={24} className="text-slate-600" />
                    </button>
                    <span className="font-bold text-slate-800 text-lg">待办详情</span>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100 transition-colors">
                        <MoreHorizontal size={20} className="text-slate-600" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pb-10">
                    <div className="bg-white p-6 mb-3 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${selectedTodo.status === 'finished' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                {selectedTodo.status === 'finished' ? '已完成' : '进行中'}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-2">
                            {selectedTodo.title}
                        </h2>
                        <div className="text-slate-400 text-xs">创建于 {new Date(selectedTodo.created_at).toLocaleString()}</div>
                    </div>

                    <div className="bg-white px-4 divide-y divide-slate-50 shadow-sm mb-3">
                        <div className="py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                                    <Calendar size={18} />
                                </div>
                                <span className="font-medium text-slate-700">截止日期</span>
                            </div>
                            <span className={`text-sm ${isOverdue(selectedTodo.due_time) ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                                {selectedTodo.due_time ? formatTimeDisplay(selectedTodo.due_time) : '未设置'}
                            </span>
                        </div>

                        <div className="py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                    <Bell size={18} />
                                </div>
                                <span className="font-medium text-slate-700">提醒时间</span>
                            </div>
                            <span className="text-sm text-slate-500">
                                {selectedTodo.reminder_times?.length > 0 ? formatTimeDisplay(selectedTodo.reminder_times[0]) : '未设置'}
                            </span>
                        </div>

                        <div className="py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                                    <TagIcon size={18} />
                                </div>
                                <span className="font-medium text-slate-700">标签</span>
                            </div>
                            {tag ? (
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${tag.color}`}>
                                    {tag.name}
                                </div>
                            ) : (
                                <span className="text-sm text-slate-300">添加标签</span>
                            )}
                        </div>
                    </div>

                    <div className="bg-white shadow-sm">
                        {/* ── Supervision Toggle Header ── */}
                        <div className="px-4 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                                    <UserCircle2 size={18} />
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-800 text-[15px]">开启督办</span>
                                    <p className="text-[11px] text-slate-400 mt-0.5">系统自动跟进联系人反馈</p>
                                </div>
                            </div>
                            <button
                                onClick={() => updateTodoSupervision(selectedTodo.id, { enabled: !selectedTodo.supervision?.enabled })}
                                className={`w-12 h-6 rounded-full transition-all duration-200 relative ${selectedTodo.supervision?.enabled ? 'bg-orange-500' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${selectedTodo.supervision?.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        {/* ── Supervision Expanded Panel ── */}
                        {selectedTodo.supervision?.enabled && (
                            <div className="px-4 pb-5 space-y-4 border-t border-slate-50 pt-3">

                                {/* Supervisor Target */}
                                <div
                                    onClick={() => setView('contacts')}
                                    className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-3 cursor-pointer active:bg-slate-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                            {selectedTodo.supervision?.contact_id ? selectedTodo.supervision.contact_id.slice(0, 1) : '?'}
                                        </div>
                                        <div>
                                            <div className="text-[12px] text-slate-400 font-medium">督办对象</div>
                                            <div className="text-[14px] text-slate-800 font-bold">{selectedTodo.supervision?.contact_id || '点击选择联系人'}</div>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300" />
                                </div>

                                {/* Supervision Status Card */}
                                {selectedTodo.supervision?.contact_id && (
                                    <div className="border border-slate-100 rounded-2xl overflow-hidden">
                                        <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">督办状态</span>
                                            {selectedTodo.supervision?.result && (
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedTodo.supervision.result === 'claimed_done' ? 'bg-emerald-100 text-emerald-700' :
                                                    selectedTodo.supervision.result === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-slate-200 text-slate-500'
                                                    }`}>
                                                    {selectedTodo.supervision.result === 'claimed_done' ? '✓ 已完成' :
                                                        selectedTodo.supervision.result === 'in_progress' ? '↻ 正在推进' :
                                                            selectedTodo.supervision.result === 'unreachable' ? '✗ 未回复' : '等待响应'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Status Steps */}
                                        <div className="px-4 py-3 space-y-2">
                                            {[
                                                { status: 'unreachable', icon: '📨', label: '督办已发出', desc: `系统已向 ${selectedTodo.supervision.contact_id} 发送督办消息`, active: true },
                                                { status: 'in_progress', icon: '↻', label: '正在推进', desc: `${selectedTodo.supervision.contact_id} 确认正在处理`, active: selectedTodo.supervision?.result === 'in_progress' || selectedTodo.supervision?.result === 'claimed_done' },
                                                { status: 'claimed_done', icon: '✓', label: '已完成', desc: `${selectedTodo.supervision.contact_id} 反馈已完成`, active: selectedTodo.supervision?.result === 'claimed_done' },
                                            ].map((step, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] shrink-0 ${step.active ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-300'}`}>
                                                        {step.icon}
                                                    </div>
                                                    <div>
                                                        <div className={`text-[12px] font-bold ${step.active ? 'text-slate-800' : 'text-slate-300'}`}>{step.label}</div>
                                                        <div className={`text-[11px] ${step.active ? 'text-slate-400' : 'text-slate-200'}`}>{step.desc}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Simulate trigger button */}
                                        {!selectedTodo.supervision?.result && (
                                            <div className="px-4 pb-4">
                                                <button
                                                    onClick={() => triggerSupervision(selectedTodo)}
                                                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-bold rounded-xl transition-colors active:scale-98"
                                                >
                                                    📨 立即触发督办
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Manual result override */}
                                <div className="space-y-2">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">手动标记督办结果</span>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'unreachable', label: '未回复', icon: '✗', cls: 'border-slate-200 text-slate-500 bg-slate-50', activeCls: 'border-slate-400 bg-slate-100 text-slate-800' },
                                            { id: 'in_progress', label: '推进中', icon: '↻', cls: 'border-blue-100 text-blue-400 bg-blue-50', activeCls: 'border-blue-500 bg-blue-100 text-blue-700' },
                                            { id: 'claimed_done', label: '已完成', icon: '✓', cls: 'border-emerald-100 text-emerald-400 bg-emerald-50', activeCls: 'border-emerald-500 bg-emerald-100 text-emerald-700' },
                                        ].map(opt => (
                                            <button
                                                key={opt.id}
                                                onClick={() => updateTodoSupervision(selectedTodo.id, { result: opt.id })}
                                                className={`py-2 border rounded-xl text-[11px] font-bold transition-all ${selectedTodo.supervision?.result === opt.id ? opt.activeCls : opt.cls
                                                    }`}
                                            >
                                                <div className="text-base mb-0.5">{opt.icon}</div>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        );
    };

    const ContactView = () => {
        const [isAdding, setIsAdding] = useState(false);
        const [newContactName, setNewContactName] = useState('');
        const [searchQuery, setSearchQuery] = useState('');

        const filteredContacts = useMemo(() => {
            return contacts.filter(c => c.name.includes(searchQuery));
        }, [contacts, searchQuery]);

        const handleAdd = () => {
            if (newContactName.trim()) {
                addContact(newContactName);
                setNewContactName('');
                setIsAdding(false);
            }
        };

        return (
            <div className="flex flex-col h-full bg-white z-30 overflow-hidden">
                <div className="h-14 px-4 bg-white flex items-center justify-between border-b border-slate-50 shrink-0">
                    <button onClick={() => setView('detail')} className="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100">
                        <ChevronLeft size={24} className="text-slate-600" />
                    </button>
                    <span className="font-bold text-slate-800 text-lg">督办人管理</span>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100 text-blue-600"
                    >
                        <UserPlus size={20} />
                    </button>
                </div>

                {/* Add Contact Form (Slide Down) */}
                {isAdding && (
                    <div className="px-4 py-4 bg-blue-50/50 border-b border-blue-100 animate-in slide-in-from-top duration-200">
                        <div className="flex gap-2">
                            <input
                                autoFocus
                                type="text"
                                value={newContactName}
                                onChange={(e) => setNewContactName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                                placeholder="输入联系人姓名"
                                className="flex-1 bg-white border border-blue-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                            <button
                                onClick={handleAdd}
                                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                            >
                                添加
                            </button>
                        </div>
                    </div>
                )}

                <div className="px-4 py-3">
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="搜索联系人"
                            className="bg-transparent border-none outline-none text-sm w-full"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="text-[11px] font-bold text-slate-400 px-6 py-2 uppercase tracking-wider">被督办人列表</div>
                    <div className="divide-y divide-slate-50">
                        {filteredContacts.length > 0 ? filteredContacts.map(contact => (
                            <div
                                key={contact.id}
                                className="flex items-center justify-between px-6 py-3 active:bg-slate-50 cursor-pointer group"
                            >
                                <div
                                    onClick={() => {
                                        updateTodoSupervision(selectedTodo.id, { contact_id: contact.name });
                                        setView('detail');
                                    }}
                                    className="flex items-center gap-3 flex-1"
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                                        {contact.avatar}
                                    </div>
                                    <div>
                                        <div className="text-[15px] font-bold text-slate-800">{contact.name}</div>
                                        <div className="text-[12px] text-slate-400">{contact.role}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {selectedTodo?.supervision?.contact_id === contact.name && (
                                        <Check size={20} className="text-blue-600" />
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteContact(contact.id);
                                        }}
                                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center text-slate-300 text-sm">暂无匹配的联系人</div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const ScheduleSettingsView = () => {
        return (
            <div className="flex flex-col h-full bg-[#F8F9FA] z-30 overflow-hidden relative">
                <div className="h-14 px-4 bg-[#F8F9FA] flex items-center justify-between shrink-0">
                    <button onClick={() => setView('list')} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full active:bg-slate-100 transition-colors">
                        <ChevronLeft size={24} className="text-slate-600" />
                    </button>
                    <span className="font-bold text-slate-800 text-[17px]">设置</span>
                    <div className="w-10 h-10"></div> {/* Spacer for center alignment */}
                </div>

                <div className="px-4 mt-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100/50 p-2">
                        <div className="flex items-center justify-between px-3 py-3 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#1A8BEA] flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.68537 13.9142L8.54922 8.5H19.0494L16.2081 12.3396C15.6174 13.1378 14.6858 13.6149 13.6938 13.6149H4.80911C4.55136 13.6149 4.45524 14.2259 4.68537 13.9142Z" fill="currentColor" />
                                        <path d="M4.68537 13.9142L8.54922 19.3283H19.0494L16.2081 15.4888C15.6174 14.6905 14.6858 14.2135 13.6938 14.2135H4.80911C4.55136 14.2135 4.45524 13.6025 4.68537 13.9142Z" fill="currentColor" />
                                        <circle cx="9.5" cy="5.5" r="3.5" fill="currentColor" />
                                    </svg>
                                </div>
                                <span className="font-bold text-[15px] text-gray-800">飞书</span>
                            </div>
                            <button className="text-[13px] text-gray-400 font-bold active:scale-95 transition-transform">
                                解除授权
                            </button>
                        </div>

                        {/* 默认出发地点 */}
                        <div
                            onClick={() => setIsMapOpen(true)}
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors rounded-[20px] group mt-1"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 shrink-0"> <MapPin size={16} /> </div>
                                <span className="font-bold text-gray-800 text-[15px]">默认出发地点</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <span className={`text-[13px] font-bold ${defaultLocation ? 'text-indigo-600' : ''}`}>{defaultLocation || '未设置'}</span>
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform opacity-60" />
                            </div>
                        </div>
                    </div>

                    <p className="px-2 mt-4 text-[11px] text-gray-400 leading-relaxed font-medium block">
                        在没有前置日程地点时，Moly 将使用默认出发地点为您计算通勤时间和出发提醒。
                    </p>
                </div>

                {/* Map Modal */}
                <AnimatePresence>
                    {isMapOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMapOpen(false)}
                                className="absolute inset-0 bg-black/40 z-[60] backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[70] h-[85%] flex flex-col shadow-2xl overflow-hidden"
                            >
                                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-4 shrink-0" />
                                <div className="px-6 flex items-center justify-between mb-2 shrink-0">
                                    <h3 className="text-xl font-bold text-gray-900">选择默认起点</h3>
                                </div>

                                <div className="px-6 pb-4 shrink-0 relative">
                                    <div className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <Search size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="搜索地点或地址..."
                                        className="w-full bg-[#F5F7FA] border-none rounded-2xl py-3.5 pl-12 pr-4 text-[15px] font-medium text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                                    />
                                </div>

                                {/* Placeholder Map Area */}
                                <div className="flex-1 bg-[#E8EDF2] relative overflow-hidden group">
                                    {/* Mock Map Image/Grid */}
                                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-white/50 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/50 mb-4 animate-bounce">
                                            <MapPin size={28} className="text-indigo-600" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest bg-white/80 px-4 py-1.5 rounded-full shadow-sm backdrop-blur">Map View Active</span>
                                    </div>
                                </div>

                                {/* Bottom Selection Area */}
                                <div className="bg-white px-6 py-6 pb-12 shrink-0 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.06)] relative -mt-4 border-t border-gray-100">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shrink-0 mt-1">
                                            <Navigation size={20} className="fill-current rotate-45" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 text-lg mb-1">{defaultLocation || '未选择地点'}</h4>
                                            <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">中国北京市海淀区上地十街10号</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsMapOpen(false)}
                                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-all hover:bg-slate-800"
                                    >
                                        确认选择
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    const CategoryBackgroundLineArt = ({ category }) => {
        // Subtle, animated background SVG lines
        const getSvgContent = () => {
            switch (category) {
                case 'correction': // Rotating gear lines
                    return (
                        <motion.svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute -right-10 -bottom-10 w-48 h-48 text-orange-600/5 opacity-50"
                            animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                            <path fill="currentColor" d="M96.7,55.4l-9.5-1.6c-0.5-2.6-1.3-5-2.4-7.4l6.4-7.2c1.3-1.5,1.1-3.7-0.3-5.1l-6.8-6.8c-1.4-1.4-3.6-1.6-5.1-0.3 l-7.2,6.4c-2.3-1-4.8-1.9-7.4-2.4L62.6,21c-0.2-1.9-1.9-3.4-3.9-3.4H41.3c-1.9,0-3.6,1.4-3.9,3.4l-1.6,9.5c-2.6,0.5-5,1.3-7.4,2.4 l-7.2-6.4c-1.5-1.3-3.7-1.1-5.1,0.3l-6.8,6.8c-1.4,1.4-1.6,3.6-0.3,5.1l6.4,7.2c-1,2.3-1.9,4.8-2.4,7.4l-9.5,1.6 c-1.9,0.2-3.4,1.9-3.4,3.9v9.7c0,1.9,1.4,3.6,3.4,3.9l9.5,1.6c0.5,2.6,1.3,5,2.4,7.4l-6.4,7.2c-1.3,1.5-1.1,3.7,0.3,5.1l6.8,6.8 c1.4,1.4,3.6,1.6,5.1,0.3l7.2-6.4c2.3,1,4.8,1.9,7.4,2.4l1.6,9.5c0.2,1.9,1.9,3.4,3.9,3.4h17.3c1.9,0,3.6-1.4,3.9-3.4l1.6-9.5 c2.6-0.5,5-1.3,7.4-2.4l7.2,6.4c1.5,1.3,3.7,1.1,5.1-0.3l6.8-6.8c1.4-1.4,1.6-3.6,0.3-5.1l-6.4-7.2c1-2.3,1.9-4.8,2.4-7.4l9.5-1.6 c1.9-0.2,3.4-1.9,3.4-3.9v-9.7C100,57.3,98.6,55.6,96.7,55.4z M50,68.8c-10.4,0-18.8-8.4-18.8-18.8S39.6,31.2,50,31.2 S68.8,39.6,68.8,50S60.4,68.8,50,68.8z" />
                        </motion.svg>
                    );
                case 'preference': // Floating heart lines
                    return (
                        <motion.svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute -right-8 -bottom-8 w-48 h-48 text-pink-600/5 opacity-40"
                            animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                            <path fill="currentColor" d="M50,87.3L20.8,58.2C8.6,46,8.6,26.1,20.8,13.9C33,1.7,50,11.2,50,11.2s17-9.5,29.2,2.7 c12.2,12.2,12.2,32.1,0,44.3L50,87.3z" />
                        </motion.svg>
                    );
                case 'knowledge_gap': // Expanding nodes/network
                    return (
                        <motion.svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute -right-12 -bottom-12 w-56 h-56 text-blue-600/5 opacity-50"
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" />
                            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
                            <circle cx="50" cy="50" r="10" fill="currentColor" />
                            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" />
                            <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
                        </motion.svg>
                    );
                case 'best_practice': // Pulsing hexagon/shield
                    return (
                        <motion.svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute -right-6 -bottom-6 w-40 h-40 text-emerald-600/5 opacity-40"
                            animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                            <path fill="none" stroke="currentColor" strokeWidth="4" d="M50,5L90,27.5V72.5L50,95L10,72.5V27.5Z" />
                            <path fill="currentColor" d="M45,70L25,50L32,43L45,56L75,26L82,33Z" />
                        </motion.svg>
                    );
                default:
                    return null;
            }
        };

        return (
            <div className="absolute inset-0 overflow-hidden rounded-[24px] pointer-events-none mix-blend-multiply">
                {getSvgContent()}
            </div>
        );
    };

    const LearningCard = ({ cardData }) => {
        const { category, summary, actionable_insight } = cardData;

        // Map category to styles - now tuned for light theme
        const categoryStyles = {
            correction: { icon: Edit2, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100/80', dot: 'bg-orange-400', label: '纠错学习' },
            preference: { icon: UserCircle2, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100/80', dot: 'bg-pink-400', label: '老板偏好' },
            knowledge_gap: { icon: Search, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100/80', dot: 'bg-blue-400', label: '知识补充' },
            best_practice: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100/80', dot: 'bg-emerald-400', label: '最佳实践' }
        };
        const style = categoryStyles[category] || categoryStyles.preference; // Fallback
        const Icon = style.icon;

        return (
            <div className="flex justify-start relative">
                <div className={`bg-white rounded-[24px] rounded-bl-[8px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border ${style.border} w-[280px] text-slate-800 relative overflow-hidden bg-clip-padding`}>

                    {/* Animated Line Art Background */}
                    <CategoryBackgroundLineArt category={category} />

                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full ${style.bg} flex items-center justify-center ${style.color}`}>
                                <Icon size={16} strokeWidth={2.5} />
                            </div>
                            <span className="font-black tracking-wider text-[11px] uppercase text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full bg-white/50 backdrop-blur-sm">
                                Moly Memory
                            </span>
                        </div>
                    </div>

                    <h4 className="text-[15px] font-bold leading-snug mb-3 relative z-10">
                        {summary}
                    </h4>

                    <div className={`${style.bg} bg-opacity-50 rounded-xl p-3 border ${style.border} relative overflow-hidden z-10`}>
                        <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 shadow-sm shadow-white/50">
                            <div className={`w-1 h-1 rounded-full animate-pulse ${style.dot}`} />
                            行动纲领
                        </div>
                        <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
                            {actionable_insight}
                        </p>
                    </div>
                </div>
            </div>
        );
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
                                <div className="text-[11px] uppercase tracking-[0.22em] font-black text-slate-400">Assistant Direction</div>
                                <div className="text-[24px] font-black tracking-tight text-slate-900">聊天首页母版</div>
                            </div>
                        </div>
                        <p className="mt-4 text-[13px] leading-relaxed text-slate-500">
                            多方案实验先收掉了。右侧现在只保留一个母版，我们接下来就基于这一版一项一项微调，不再来回切方向。
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsAssistantOpen(v => !v)}
                            className={`mt-5 w-full rounded-[14px] px-4 py-3 text-[13px] font-bold transition-all ${
                                isAssistantOpen
                                    ? 'bg-slate-900 text-white shadow-[0_16px_30px_rgba(15,23,42,0.16)]'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            {isAssistantOpen ? '关闭聊天首页预览' : '打开聊天首页预览'}
                        </button>
                    </div>

                    <div className="rounded-[24px] bg-white border border-slate-200 shadow-[0_20px_60px_rgba(148,163,184,0.14)] p-5">
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-[14px] flex items-center justify-center text-[12px] font-black bg-slate-900 text-white">
                                01
                            </div>
                            <div className="min-w-0">
                                <div className="text-[15px] font-black tracking-tight text-slate-900">{assistantVariantMeta.label}</div>
                                <div className="text-[12px] leading-relaxed mt-1 text-slate-500">
                                    {assistantVariantMeta.note}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 rounded-[14px] border border-slate-200 bg-slate-50/70 px-4 py-3">
                            <div className="text-[10px] uppercase tracking-[0.18em] font-black text-slate-400">Current Focus</div>
                            <div className="mt-2 text-[13px] leading-relaxed text-slate-600">
                                先把这一个方向的骨架、信息完整度、滚动体验和元素比例调顺，再考虑往里继续加东西。
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-[393px] w-full h-[852px] border-[10px] border-slate-900 rounded-[3.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative bg-white font-sans ring-4 ring-slate-800/10">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-[60] flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-slate-800 absolute right-4" />
                </div>

                <div className="h-full">
                    {view === 'list' && <ListView />}
                    {view === 'detail' && <DetailView />}
                    {view === 'contacts' && <ContactView />}
                    {view === 'schedule_settings' && <ScheduleSettingsView />}
                </div>

                {/* Moly Assistant Panel (Slide Up) */}

                {/* ── In-App Supervision Message Cards (simulating supervisee view) ── */}
                <AnimatePresence>
                    {supervisionCards.map(card => (
                        <motion.div key={card.id}
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                            className="absolute inset-0 bg-slate-900/30 z-[95] flex items-end backdrop-blur-sm"
                        >
                            <div className="w-full bg-white rounded-t-[28px] p-5 shadow-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                            {card.contactName.slice(0, 1)}
                                        </div>
                                        <div>
                                            <div className="text-[13px] font-bold text-slate-800">督办消息</div>
                                            <div className="text-[11px] text-slate-400">来自 Moly 秘书 · 刚刚</div>
                                        </div>
                                    </div>
                                    {!card.responded && (
                                        <button onClick={() => dismissSupervisionCard(card.id)} className="text-slate-300 text-lg leading-none p-1">✕</button>
                                    )}
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
                                    <p className="text-[13px] text-slate-500 mb-1 font-medium">待办事项</p>
                                    <p className="text-[15px] font-bold text-slate-900 mb-3">{card.todoTitle}</p>
                                    <p className="text-[13px] text-slate-500 leading-relaxed">请问这件事目前处理到哪一步了？</p>
                                </div>

                                {!card.responded ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => respondToSupervision(card.id, card.todoId, card.todoTitle, card.contactName, 'in_progress')}
                                            className="py-3 bg-blue-50 border border-blue-200 text-blue-700 font-bold text-[14px] rounded-2xl active:scale-95 transition-all"
                                        >
                                            ↻ 正在推进
                                        </button>
                                        <button
                                            onClick={() => respondToSupervision(card.id, card.todoId, card.todoTitle, card.contactName, 'claimed_done')}
                                            className="py-3 bg-emerald-500 text-white font-bold text-[14px] rounded-2xl active:scale-95 transition-all shadow-lg shadow-emerald-500/25"
                                        >
                                            ✓ 已完成
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-2">
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold ${card.response === 'claimed_done' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {card.response === 'claimed_done' ? '✓ 已反馈：已完成' : '↻ 已反馈：正在推进'}
                                        </div>
                                        <button onClick={() => dismissSupervisionCard(card.id)} className="block mt-3 mx-auto text-[12px] text-slate-400">关闭</button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* ── Supervisor Status Update Cards (shown to initiator after supervisee responds) ── */}
                <AnimatePresence>
                    {supervisionUpdates.map(update => (
                        <motion.div key={update.id}
                            initial={{ y: -60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -60, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                            className="absolute top-16 left-4 right-4 z-[100]"
                        >
                            <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-100 p-4">
                                <div className="flex items-start gap-3">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow ${update.response === 'claimed_done' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                                        {update.response === 'claimed_done' ? '✓' : '↻'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[12px] font-bold text-slate-800 flex items-center gap-1.5">
                                            督办结果更新
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${update.response === 'claimed_done' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {update.response === 'claimed_done' ? '已完成' : '正在推进'}
                                            </span>
                                        </div>
                                        <p className="text-[12px] text-slate-500 mt-0.5 truncate">{update.todoTitle}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-[11px] text-slate-400">{update.contactName} 已反馈 · {update.timestamp}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setSupervisionUpdates(prev => prev.filter(u => u.id !== update.id))} className="text-slate-300 text-sm p-0.5 shrink-0">✕</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <AnimatePresence>
                    {isAssistantOpen && (
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                            className="absolute inset-0 z-[90] flex flex-col overflow-hidden bg-[#fbfbfa]"
                        >
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),transparent_22%,transparent_78%,rgba(15,23,42,0.03))]" />
                            </div>

                            <div className="absolute top-14 right-5 z-20 flex flex-col gap-2">
                                {!isAssistantFocusCollapsed && (
                                    <button
                                        type="button"
                                        onClick={() => setIsAssistantFocusCollapsed(true)}
                                        className="w-10 h-10 rounded-[12px] bg-white/92 backdrop-blur border border-slate-200 text-slate-400 flex items-center justify-center shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                                    >
                                        <ChevronUp size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsAssistantOpen(false)}
                                    className="w-10 h-10 rounded-[12px] bg-white/92 backdrop-blur border border-slate-200 text-slate-500 flex items-center justify-center shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                                >
                                    <ChevronRight size={18} className="rotate-180" />
                                </button>
                            </div>

                            <div
                                ref={assistantPanelRef}
                                className="relative flex-1"
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.02),transparent_36%)]" />
                            </div>

                            <div className="relative shrink-0 px-4 pb-8 pt-4 bg-[#f7f6f4]/96 backdrop-blur-xl border-t border-[#ebe7e2]">
                                <form
                                    onSubmit={handleAssistantSubmit}
                                    className="rounded-[18px] border border-[#e8e4de] bg-[linear-gradient(180deg,#ffffff_0%,#fbfaf8_100%)] shadow-[0_12px_24px_rgba(15,23,42,0.05)] overflow-hidden"
                                >
                                    <div className="px-4.5 pt-3.5 pb-2">
                                        <textarea
                                            value={assistantInput}
                                            onChange={(e) => setAssistantInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleAssistantSubmit(e);
                                                }
                                            }}
                                            placeholder="Assign a task or ask anything"
                                            className="w-full bg-transparent border-none outline-none resize-none min-h-[24px] max-h-[84px] text-[15px] leading-[1.3] font-medium text-slate-800 placeholder:text-[#b8b2aa] block"
                                            rows="1"
                                        />
                                    </div>

                                    <div className="px-4 py-2 border-t border-[#f0ece7] flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5">
                                            <button
                                                type="button"
                                                className="w-11 h-11 rounded-full border border-[#e8e4de] bg-white flex items-center justify-center text-[#2f2f2f] shadow-[0_2px_8px_rgba(15,23,42,0.03)]"
                                            >
                                                <Plus size={20} strokeWidth={1.75} />
                                            </button>

                                            <button
                                                type="button"
                                                className="h-11 pl-3 pr-4 rounded-full border border-[#e8e4de] bg-white flex items-center gap-2 text-[#6f6a63] shadow-[0_2px_8px_rgba(15,23,42,0.03)]"
                                            >
                                                <div className="relative w-6 h-[18px]">
                                                    <div className="absolute inset-0 flex items-center justify-between">
                                                        <div className="w-[4px] h-[18px] rounded-full bg-[#4285F4]" />
                                                        <div className="w-[4px] h-[18px] rounded-full bg-[#34A853]" />
                                                    </div>
                                                    <div className="absolute left-0 top-0 w-[14px] h-[4px] rounded-full bg-[#EA4335]" />
                                                    <div className="absolute right-0 top-0 w-[14px] h-[4px] rounded-full bg-[#FBBC05]" />
                                                    <div className="absolute left-[6px] top-[7px] w-[12px] h-[4px] rounded-full bg-[#EA4335] rotate-[35deg] origin-left" />
                                                    <div className="absolute right-[6px] top-[7px] w-[12px] h-[4px] rounded-full bg-[#FBBC05] -rotate-[35deg] origin-right" />
                                                </div>
                                                <span className="text-[14px] font-semibold">+2</span>
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <button
                                                type="button"
                                                className="w-11 h-11 rounded-full border border-[#e8e4de] bg-white flex items-center justify-center text-[#2f2f2f] shadow-[0_2px_8px_rgba(15,23,42,0.03)]"
                                            >
                                                <Mic size={18} strokeWidth={1.75} />
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={!assistantInput.trim() || isProcessing}
                                                className="w-11 h-11 rounded-full bg-[#ededeb] text-white flex items-center justify-center transition-all disabled:opacity-100 disabled:text-white enabled:bg-slate-900 enabled:shadow-[0_8px_18px_rgba(15,23,42,0.12)] enabled:hover:bg-slate-800 active:scale-95"
                                            >
                                                <ArrowUp size={18} strokeWidth={2} />
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-200 rounded-full z-[60]" />
            </div>
            </div>
        </div >
    );
}
