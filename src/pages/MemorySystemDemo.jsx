import React, { useState } from 'react';
import {
  User, Users, Briefcase, ChevronDown, ChevronRight, MessageSquare,
  FileText, Brain, CheckCircle, Clock, Tag, Zap, ArrowLeft,
  Building2, Phone, Mail, Star, TrendingUp, Calendar, Hash,
  MoreHorizontal, Sparkles, Link2
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Data ────────────────────────────────────────────────────────────────────

const identityMemory = {
  name: '韩冬江',
  nicknames: ['东江', 'DJ'],
  company: 'Moly',
  title: '产品负责人',
  phone: '138 **** 8888',
  email: 'dongjiang@moly.ai',
  wechat: 'djhan_moly',
  industry: '智能助理 / AI 产品',
  selfRef: ['我', 'DJ哥', '东江'],
  lastUpdated: '2026-03-25 · 来自聊天',
  confidence: 98,
};

const relationshipMemories = [
  {
    id: 'r1',
    name: '王总',
    company: '某某资本',
    title: 'Managing Partner',
    relation: '重点投资人',
    importance: 5,
    recentTopic: '融资材料补充 & 合作推进',
    interactionFreq: '高频',
    lastContact: '3天前',
    source: {
      type: 'chat',
      text: '"王总是我们这边最重要的投资人，他上周催了两次材料。"',
      date: '2026-03-22',
    },
    tags: ['融资', '优先跟进'],
  },
  {
    id: 'r2',
    name: 'Kevin',
    company: 'Moly',
    title: '工程负责人',
    relation: '内部核心协作',
    importance: 4,
    recentTopic: '记忆系统后端架构设计',
    interactionFreq: '高频',
    lastContact: '昨天',
    source: {
      type: 'meeting',
      text: '技术周会记录：Kevin 负责记忆系统数据层，下周交付初版接口。',
      date: '2026-03-24',
    },
    tags: ['工程', '技术协作'],
  },
  {
    id: 'r3',
    name: '张律师',
    company: '某某律所',
    title: '合伙人律师',
    relation: '法务顾问',
    importance: 3,
    recentTopic: '用户协议 & 数据隐私条款',
    interactionFreq: '低频',
    lastContact: '2周前',
    source: {
      type: 'chat',
      text: '"法务这边找张律师确认一下数据留存条款，他之前帮我们审过合同。"',
      date: '2026-03-12',
    },
    tags: ['法务'],
  },
  {
    id: 'r4',
    name: '小李',
    company: 'Moly',
    title: '产品设计',
    relation: '直属团队',
    importance: 3,
    recentTopic: '记忆系统 UI 原型',
    interactionFreq: '高频',
    lastContact: '今天',
    source: {
      type: 'chat',
      text: '"让小李先把记忆这个 tab 的原型做出来，下周演示用。"',
      date: '2026-03-26',
    },
    tags: ['设计', '内部'],
  },
];

const workstreamMemories = [
  {
    id: 'w1',
    title: '融资材料补充',
    stage: '进行中',
    stageColor: 'bg-amber-100 text-amber-700',
    relatedPeople: ['王总'],
    recentActivity: '王总上周两次提到补材料，本周内需完成',
    nextAction: '将最新版 Deck 发给王总',
    sources: [
      { type: 'chat', text: '"融资材料这周要补完，王总催了两次了。"', date: '2026-03-22' },
      { type: 'meeting', text: '投资人沟通会议：需补充市场规模数据及竞品对比。', date: '2026-03-20' },
    ],
    tags: ['融资', '紧急'],
  },
  {
    id: 'w2',
    title: '记忆系统 0.8 设计与开发',
    stage: '进行中',
    stageColor: 'bg-blue-100 text-blue-700',
    relatedPeople: ['Kevin', '小李'],
    recentActivity: '产品定义已完成，工程和设计并行推进',
    nextAction: 'Kevin 下周交付后端初版接口',
    sources: [
      { type: 'meeting', text: '技术周会：记忆系统功能拆解完成，Kevin 负责数据层。', date: '2026-03-24' },
      { type: 'chat', text: '"记忆系统先覆盖日程、待办、联系人三个场景。"', date: '2026-03-26' },
    ],
    tags: ['产品', '工程', '设计'],
  },
  {
    id: 'w3',
    title: '用户协议 & 隐私条款更新',
    stage: '待推进',
    stageColor: 'bg-slate-100 text-slate-600',
    relatedPeople: ['张律师'],
    recentActivity: '已提出需求，等待张律师排期',
    nextAction: '跟张律师确认排期',
    sources: [
      { type: 'chat', text: '"法务这边找张律师确认数据隐私条款，他帮我们审过合同的。"', date: '2026-03-12' },
    ],
    tags: ['法务', '合规'],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ImportanceDots({ value }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${i <= value ? 'bg-violet-500' : 'bg-slate-200'}`}
        />
      ))}
    </div>
  );
}

function SourceBadge({ source }) {
  const isChat = source.type === 'chat';
  return (
    <div className={`flex items-start gap-2 p-3 rounded-xl mt-3 ${isChat ? 'bg-blue-50' : 'bg-purple-50'}`}>
      {isChat
        ? <MessageSquare size={14} className="text-blue-400 mt-0.5 shrink-0" />
        : <FileText size={14} className="text-purple-400 mt-0.5 shrink-0" />}
      <div className="min-w-0">
        <div className={`text-[10px] font-semibold mb-0.5 ${isChat ? 'text-blue-500' : 'text-purple-500'}`}>
          {isChat ? '聊天记录' : '会议记录'} · {source.date}
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{source.text}</p>
      </div>
    </div>
  );
}

function ExpandableCard({ children, className = '' }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all ${className}`}
    >
      {React.Children.map(children, (child, i) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { open, setOpen, index: i })
          : child
      )}
    </div>
  );
}

// ─── Identity Tab ─────────────────────────────────────────────────────────────

function IdentityTab() {
  const m = identityMemory;
  return (
    <div className="space-y-4">
      {/* Confidence banner */}
      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
        <CheckCircle size={16} className="text-emerald-500 shrink-0" />
        <span className="text-sm text-emerald-700 font-medium">身份识别置信度 {m.confidence}%</span>
        <span className="ml-auto text-xs text-emerald-500">{m.lastUpdated}</span>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        {/* Avatar row */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
            {m.name[0]}
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">{m.name}</div>
            <div className="text-sm text-slate-500">{m.title} · {m.company}</div>
            <div className="flex gap-1 mt-1">
              {m.nicknames.map(n => (
                <span key={n} className="text-[11px] bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full font-medium">
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Fields */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <Building2 size={14} />, label: '公司', value: m.company },
            { icon: <Tag size={14} />, label: '行业', value: m.industry },
            { icon: <Phone size={14} />, label: '手机', value: m.phone },
            { icon: <Mail size={14} />, label: '邮箱', value: m.email },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                {icon}
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium">{label}</div>
                <div className="text-sm text-slate-800 font-medium">{value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-px bg-slate-100" />

        {/* Self-reference anchors */}
        <div>
          <div className="text-[11px] text-slate-400 font-semibold mb-2 uppercase tracking-wide">识别为"我"的表达</div>
          <div className="flex flex-wrap gap-1.5">
            {m.selfRef.map(r => (
              <span key={r} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2 px-4 py-3 bg-slate-50 rounded-xl">
        <Brain size={14} className="text-slate-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-500 leading-relaxed">
          身份记忆帮助系统避免将你识别为联系人，并理解"我老板""我客户"等关系表述。
        </p>
      </div>
    </div>
  );
}

// ─── Relationship Tab ─────────────────────────────────────────────────────────

function RelationCard({ person }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-violet-600 font-bold text-sm shrink-0">
          {person.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-slate-900 text-sm">{person.name}</span>
            <ImportanceDots value={person.importance} />
            <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium
              ${person.interactionFreq === '高频' ? 'bg-violet-50 text-violet-600' :
                person.interactionFreq === '低频' ? 'bg-slate-100 text-slate-500' :
                'bg-blue-50 text-blue-600'}`}
            >
              {person.interactionFreq}
            </span>
          </div>
          <div className="text-xs text-slate-500">{person.title} · {person.company}</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{person.relation}</span>
            <Clock size={10} className="ml-1 text-slate-300" />
            <span>{person.lastContact}</span>
          </div>
        </div>
        <ChevronDown size={16} className={`text-slate-300 mt-1 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-50">
          <div className="pt-3">
            <div className="text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wide">近期沟通主题</div>
            <p className="text-sm text-slate-700">{person.recentTopic}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {person.tags.map(t => (
              <span key={t} className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wide">来源</div>
            <SourceBadge source={person.source} />
          </div>
        </div>
      )}
    </div>
  );
}

function RelationshipTab() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-slate-500">{relationshipMemories.length} 条关系记忆</span>
        <span className="text-xs text-slate-400">按重要程度排列</span>
      </div>
      {relationshipMemories.map(p => <RelationCard key={p.id} person={p} />)}
    </div>
  );
}

// ─── Workstream Tab ───────────────────────────────────────────────────────────

function WorkstreamCard({ ws }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0">
            <Briefcase size={16} className="text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-slate-900 text-sm">{ws.title}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ws.stageColor}`}>
                {ws.stage}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{ws.recentActivity}</p>
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {ws.relatedPeople.map(p => (
                <span key={p} className="text-[11px] bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full">
                  {p}
                </span>
              ))}
              {ws.tags.map(t => (
                <span key={t} className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <ChevronDown size={16} className={`text-slate-300 mt-1 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-50">
          <div className="pt-3 flex items-start gap-2 bg-amber-50 rounded-xl p-3">
            <Zap size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] text-amber-600 font-semibold mb-0.5">下一步</div>
              <p className="text-sm text-slate-700">{ws.nextAction}</p>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wide">来源（{ws.sources.length}条）</div>
            <div className="space-y-2">
              {ws.sources.map((s, i) => <SourceBadge key={i} source={s} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WorkstreamTab() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-slate-500">{workstreamMemories.length} 条事项记忆</span>
        <span className="text-xs text-slate-400">按活跃度排列</span>
      </div>
      {workstreamMemories.map(ws => <WorkstreamCard key={ws.id} ws={ws} />)}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'identity', label: '身份', icon: <User size={14} /> },
  { id: 'relationship', label: '关系', icon: <Users size={14} /> },
  { id: 'workstream', label: '事项', icon: <Briefcase size={14} /> },
];

export default function MemorySystemDemo() {
  const [activeTab, setActiveTab] = useState('identity');

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
            <ArrowLeft size={18} className="text-slate-500" />
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-sm">
              <Brain size={14} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-base">记忆系统</span>
            <span className="text-[10px] bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-semibold">0.8</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <Sparkles size={11} />
            <span>实时更新中</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-lg mx-auto px-4 pb-0 flex gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-violet-500 text-violet-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary strip */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex gap-2 mb-4">
          {[
            { label: '身份', value: '1', color: 'from-violet-400 to-indigo-400' },
            { label: '关系', value: `${relationshipMemories.length}`, color: 'from-pink-400 to-rose-400' },
            { label: '事项', value: `${workstreamMemories.length}`, color: 'from-amber-400 to-orange-400' },
          ].map(stat => (
            <div key={stat.label} className="flex-1 rounded-2xl bg-white border border-slate-100 shadow-sm p-3 text-center">
              <div className={`text-xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{stat.label}记忆</div>
            </div>
          ))}
        </div>

        {/* Source summary */}
        <div className="flex items-center gap-3 mb-5 text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <MessageSquare size={11} className="text-blue-400" />
            <span>聊天记录</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText size={11} className="text-purple-400" />
            <span>会议记录</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={11} className="text-teal-400" />
            <span>日程 & 待办</span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Link2 size={11} />
            <span>6 条来源已关联</span>
          </div>
        </div>

        {/* Tab content */}
        <div className="pb-10">
          {activeTab === 'identity' && <IdentityTab />}
          {activeTab === 'relationship' && <RelationshipTab />}
          {activeTab === 'workstream' && <WorkstreamTab />}
        </div>
      </div>
    </div>
  );
}
