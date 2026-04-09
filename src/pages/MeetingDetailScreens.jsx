import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, MoreHorizontal, Send, CornerDownRight } from 'lucide-react';

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

export function MeetingDetailScreen({ meeting, onBack, onUpdate, onDelete, playingId, setPlayingId }) {
    const [showMenu, setShowMenu] = useState(false);
    const [viewFrame, setViewFrame] = useState('main'); // main, chat, transcript
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [noteContent, setNoteContent] = useState(meeting.note || '- 详情页要精简，只留摘要+笔记+结论\n- 转录移到菜单里\n- 导航栏复用！不同页面变形\n- Chat 单独页面，不要半屏\n- 音频播放放转录全文页面里');
    const [todos, setTodos] = useState([
        {id:1, title:'完成详情页和 Chat 页面设计稿更新', owner:'说话人 2', color:'bg-[#4CD9AC]', time:'截止 4月10日', done:false},
        {id:2, title:'底部导航栏变形动效方案输出', owner:'说话人 3', color:'bg-[#5B9EF4]', time:'未指定截止时间', done:false},
        {id:3, title:'对接腾讯会议 API 调用量确认', owner:'说话人 1', color:'bg-[#F5A623]', time:'截止 4月9日', done:false}
    ]);
    const [chatConclusions, setChatConclusions] = useState(meeting.chatHistory && meeting.chatHistory.length > 0 ? meeting.chatHistory : [
         {q:'这次会议对模板管理的核心决策是什么？', a:'决定将预设模板从 6 个精简为 3 个（通用会议、头脑风暴、产品评审），同时 0.8 版本直接支持用户创建自定义模板，支持语音输入提示词并自动润色。', attachedAt:'14:52 附加'}
    ]);

    const isPlaying = playingId === meeting.id;

    const toggleTodo = (id) => setTodos(todos.map(t => t.id === id ? {...t, done: !t.done} : t));

    if (viewFrame === 'chat') {
        return <ChatScreen meeting={meeting} onBack={() => setViewFrame('main')} onAttach={(item) => setChatConclusions([...chatConclusions, item])} />;
    }
    if (viewFrame === 'transcript') {
        return <TranscriptScreen meeting={meeting} onBack={() => setViewFrame('main')} isPlaying={isPlaying} onTogglePlay={() => setPlayingId(isPlaying ? null : meeting.id)} />;
    }

    return (
        <div className="flex flex-col h-full bg-[#f0f0f0] w-full isolate absolute inset-0 z-10">
            {/* 导航栏 */}
            <div className="h-[44px] px-4 flex items-center justify-between bg-white shrink-0 relative pt-[36px] pb-[10px] box-content">
                <button onClick={onBack} className="text-[34px] text-[#1a1a1a] font-light leading-none w-10 flex items-center mt-[-4px]">‹</button>
                <div className="relative h-full flex items-center">
                    <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-[3px] p-2 pr-0 opacity-80 mt-1">
                        <span className="w-1 h-1 bg-[#1a1a1a] rounded-full"></span>
                        <span className="w-1 h-1 bg-[#1a1a1a] rounded-full"></span>
                        <span className="w-1 h-1 bg-[#1a1a1a] rounded-full"></span>
                    </button>
                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowMenu(false)} />
                            <div className="absolute right-0 top-10 w-[200px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-[0.5px] border-black/5 py-1 z-50 overflow-hidden text-left">
                                <button onClick={() => { setViewFrame('transcript'); setShowMenu(false); }} className="w-full text-left px-4 py-[13px] text-[15px] text-[#1a1a1a] cursor-pointer hover:bg-[#f5f5f5] active:bg-[#f5f5f5] border-b-[0.5px] border-[#e5e5e5] font-medium">查看转录全文</button>
                                <button className="w-full text-left px-4 py-[13px] text-[15px] text-[#1a1a1a] cursor-pointer hover:bg-[#f5f5f5] active:bg-[#f5f5f5] border-b-[0.5px] border-[#e5e5e5] font-medium">切换模板重新生成</button>
                                <button onClick={() => { onDelete(); setShowMenu(false); }} className="w-full text-left px-4 py-[13px] text-[15px] text-[#FF3B30] cursor-pointer hover:bg-[#f5f5f5] active:bg-[#f5f5f5] font-medium">删除会议记录</button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 页头 */}
            <div className="px-5 pb-[14px] bg-white shrink-0 border-b-[0.5px] border-[#ececec]">
                <div className="text-[20px] font-semibold text-[#1a1a1a] leading-[1.3] mb-[5px]">{meeting.title || '会议记录'}</div>
                <div className="text-[13px] text-[#999] flex gap-1.5 items-center">
                    <span>{meeting.time ? formatMeetingDate(meeting.time) : '4月7日 14:00'}</span>
                    <span className="text-[#d0d0d0]">·</span>
                    <span>{formatDuration(meeting.duration)}</span>
                    <span className="text-[#d0d0d0]">·</span>
                    <span className="bg-[#f0f0f0] px-2 py-[2px] rounded-[4px] text-[12px] text-[#666]">产品评审</span>
                </div>
            </div>

            {/* 滚动内容 */}
            <div className="flex-1 overflow-y-auto touch-pan-y relative z-10 w-full mb-0">
                <div className="bg-white mt-[8px] py-4 px-5">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[16px] font-semibold text-[#1a1a1a]">智能总结</span>
                        <span className="text-[12px] text-[#999] cursor-pointer">v2 ▾</span>
                    </div>
                    {meeting.summary && meeting.summary.length > 0 ? (
                        meeting.summary.map((sec, idx) => (
                            <div key={idx} className="mb-[16px] last:mb-0">
                                <div className="text-[14px] font-semibold text-[#1a1a1a] mb-2 pb-1">{sec.section}</div>
                                <ul className="list-none p-0 m-0">
                                    {sec.items.map((item, i) => (
                                        <li key={i} className="text-[14px] text-[#444] leading-[1.65] py-[2px] pr-0 pl-[14px] relative before:content-[''] before:absolute before:left-[2px] before:top-[11px] before:w-[4px] before:h-[4px] before:rounded-full before:bg-[#ccc]">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <>
                            <div className="mb-[16px]">
                                <div className="text-[14px] font-semibold text-[#1a1a1a] mb-2 pb-1">评审对象</div>
                                <ul className="list-none p-0 m-0">
                                    <li className="text-[14px] text-[#444] leading-[1.65] py-[2px] pr-0 pl-[14px] relative before:content-[''] before:absolute before:left-[2px] before:top-[11px] before:w-[4px] before:h-[4px] before:rounded-full before:bg-[#ccc]">Moly 0.8 会议记录模块升级方案，包含录音+笔记、AI Chat、模板管理三大功能</li>
                                </ul>
                            </div>
                            <div className="mb-[16px]">
                                <div className="text-[14px] font-semibold text-[#1a1a1a] mb-2 pb-1">方案要点</div>
                                <ul className="list-none p-0 m-0">
                                    <li className="text-[14px] text-[#444] leading-[1.65] py-[2px] pr-0 pl-[14px] relative before:content-[''] before:absolute before:left-[2px] before:top-[11px] before:w-[4px] before:h-[4px] before:rounded-full before:bg-[#ccc]">录音中提供轻量笔记区，录后批量转录 + AI 总结</li>
                                    <li className="text-[14px] text-[#444] leading-[1.65] py-[2px] pr-0 pl-[14px] relative before:content-[''] before:absolute before:left-[2px] before:top-[11px] before:w-[4px] before:h-[4px] before:rounded-full before:bg-[#ccc]">3 个预设模板 + 自定义模板，支持语音输入提示词</li>
                                    <li className="text-[14px] text-[#444] leading-[1.65] py-[2px] pr-0 pl-[14px] relative before:content-[''] before:absolute before:left-[2px] before:top-[11px] before:w-[4px] before:h-[4px] before:rounded-full before:bg-[#ccc]">会后 AI Chat 支持多轮问答，结论可附加到记录</li>
                                </ul>
                            </div>
                            <div className="mb-[16px] last:mb-0">
                                <div className="text-[14px] font-semibold text-[#1a1a1a] mb-2 pb-1">决策结论</div>
                                <ul className="list-none p-0 m-0">
                                    <li className="text-[14px] text-[#444] leading-[1.65] py-[2px] pr-0 pl-[14px] relative before:content-[''] before:absolute before:left-[2px] before:top-[11px] before:w-[4px] before:h-[4px] before:rounded-full before:bg-[#ccc]">详情页只保留智能总结、笔记、Chat 结论三个区块</li>
                                    <li className="text-[14px] text-[#444] leading-[1.65] py-[2px] pr-0 pl-[14px] relative before:content-[''] before:absolute before:left-[2px] before:top-[11px] before:w-[4px] before:h-[4px] before:rounded-full before:bg-[#ccc]">Chat 采用独立全屏页面，不用半屏面板</li>
                                    <li className="text-[14px] text-[#444] leading-[1.65] py-[2px] pr-0 pl-[14px] relative before:content-[''] before:absolute before:left-[2px] before:top-[11px] before:w-[4px] before:h-[4px] before:rounded-full before:bg-[#ccc]">预设模板从 6 个精简为 3 个，同时支持自定义模板</li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>

                <div className="bg-white mt-[8px] py-4 px-5">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[16px] font-semibold text-[#1a1a1a]">Action Items</span>
                        <span className="text-[12px] text-[#999]">{todos.length} 项</span>
                    </div>
                    <div className="flex flex-col">
                        {todos.map(t => (
                            <div key={t.id} onClick={() => toggleTodo(t.id)} className="flex items-center py-3 border-b-[0.5px] border-[#f0f0f0] last:border-none cursor-pointer">
                                <span className={`w-2 h-2 rounded-full shrink-0 mr-2.5 ${t.color}`}></span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[12px] text-[#999] mb-[2px]">{t.time}</div>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`text-[15px] font-medium whitespace-nowrap overflow-hidden text-ellipsis ${t.done ? 'text-[#bbb] line-through' : 'text-[#1a1a1a]'}`}>{t.title}</span>
                                        <span className="text-[12px] text-[#bbb] shrink-0">{t.owner}</span>
                                    </div>
                                </div>
                                <div className={`w-[22px] h-[22px] rounded-full border-[1.5px] shrink-0 ml-3 flex items-center justify-center transition-all ${t.done ? 'bg-[#4CD9AC] border-[#4CD9AC]' : 'border-[#d0d0d0]'}`}>
                                    {t.done && <div className="w-[6px] h-[10px] border-r-2 border-b-2 border-white rotate-45 -mt-[2px]"></div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white mt-[8px] py-4 px-5">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[16px] font-semibold text-[#1a1a1a]">我的笔记</span>
                        <span className="text-[14px] text-[#007AFF] cursor-pointer" onClick={() => {
                            if (isEditingNotes) { onUpdate({note: noteContent}); }
                            setIsEditingNotes(!isEditingNotes);
                        }}>{isEditingNotes ? '完成' : '编辑'}</span>
                    </div>
                    <textarea 
                        className="w-full text-[14px] text-[#444] leading-[1.7] p-3.5 bg-[#fafafa] rounded-[10px] border border-[#f0f0f0] outline-none resize-none whitespace-pre-wrap block font-sans" 
                        rows={6}
                        value={noteContent}
                        onChange={e => setNoteContent(e.target.value)}
                        readOnly={!isEditingNotes}
                    />
                </div>

                <div className="bg-white mt-[8px] py-4 px-5">
                    <div className="flex justify-between items-center mb-[8px]">
                        <span className="text-[16px] font-semibold text-[#1a1a1a]">Chat 结论</span>
                    </div>
                    {chatConclusions.length > 0 ? (
                        chatConclusions.map((item, idx) => (
                            <div key={idx} className="bg-[#fafafa] rounded-[10px] p-[14px] mb-[8px] last:mb-0">
                                <div className="text-[13px] text-[#999] mb-[6px] flex items-start gap-[6px]">
                                    <span className="bg-[#eee] text-[#888] text-[11px] font-semibold px-[5px] py-[1px] rounded-[3px] shrink-0">Q</span>
                                    <span className="mt-[1px]">{item.q}</span>
                                </div>
                                <div className="text-[14px] text-[#333] leading-[1.6] mb-[8px]">{item.a}</div>
                                <div className="flex justify-between items-center text-[12px]">
                                    <span className="text-[#ccc]">{item.attachedAt}</span>
                                    <span className="text-[#FF3B30] opacity-60 cursor-pointer" onClick={() => setChatConclusions(chatConclusions.filter((_, i) => i !== idx))}>删除</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-[14px] text-[#ccc]">暂无 Chat 结论</div>
                    )}
                </div>
                <div className="h-[16px]"></div>
            </div>

            <div className="shrink-0 pt-[8px] px-3 pb-[16px] bg-white border-t-[0.5px] border-[#ececec]">
                <div className="flex items-center justify-center bg-[#f2f2f7] rounded-[22px] py-[12px] px-[20px] cursor-pointer active:bg-[#e8e8ed] transition-colors" onClick={() => setViewFrame('chat')}>
                    <span className="text-[15px] text-[#999]">基于这次会议提问...</span>
                </div>
            </div>
        </div>
    );
}

function TranscriptScreen({ meeting, onBack, isPlaying, onTogglePlay }) {
    return (
        <div className="flex flex-col h-full bg-white relative isolate overflow-hidden w-full z-50 absolute inset-0">
            <div className="h-[44px] px-4 flex items-center justify-between bg-white shrink-0 relative pt-[36px] pb-[10px] box-content border-b-[0.5px] border-[#ececec]">
                <button onClick={onBack} className="text-[34px] text-[#1a1a1a] font-light leading-none w-10 flex items-center mt-[-4px]">‹</button>
                <div className="text-[16px] font-semibold text-[#1a1a1a]">转录全文</div>
                <div className="w-10"></div>
            </div>
            <div className="px-4 py-[10px] bg-[#fafafa] border-b-[0.5px] border-[#e5e5e5] flex items-center gap-[8px] shrink-0">
                <button onClick={onTogglePlay} className="w-[30px] h-[30px] rounded-full bg-[#1a1a1a] flex items-center justify-center shrink-0 active:opacity-70">
                    {isPlaying ? <Pause size={14} fill="currentColor" color="white" /> : <Play size={14} fill="currentColor" color="white" className="ml-[2px]"/>}
                </button>
                <button className="text-[11px] font-semibold text-[#999] px-1 active:text-[#333]">1.0x</button>
                <div className="flex-1 relative py-2 cursor-pointer flex items-center shrink-0 min-w-0 pr-2">
                    <div className="w-full h-[3px] bg-[#e5e5ea] rounded-[1.5px]">
                        <div className="h-[3px] bg-[#1a1a1a] rounded-[1.5px] w-[35%] transition-all"></div>
                    </div>
                    <div className="w-[10px] h-[10px] bg-[#1a1a1a] rounded-full absolute left-[35%] -translate-x-[5px]"></div>
                </div>
                <div className="text-[11px] text-[#999] w-[70px] text-center font-mono">14:15 - {formatDuration(meeting.duration)}</div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-3">
                {meeting.transcript && meeting.transcript.length > 0 ? meeting.transcript.map((line, i) => (
                    <div key={i} className="py-[10px] border-b-[0.5px] border-[#f0f0f0] last:border-none">
                        <div className="flex items-center gap-2 mb-[2px]">
                            <span className="text-[12px] font-medium text-[#333]">{line.speaker}</span>
                            <span className="text-[11px] text-[#ccc] font-normal">{line.time}</span>
                        </div>
                        <div className="text-[14px] text-[#555] leading-[1.6]">{line.text}</div>
                    </div>
                )) : (
                    <div className="text-center text-[#ccc] text-[14px] py-10">暂无转录内容</div>
                )}
            </div>
        </div>
    );
}

function ChatScreen({ meeting, onBack, onAttach }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userText = input.trim();
        setInput('');
        setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userText }]);
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { 
                id: Date.now()+1, 
                role: 'ai', 
                text: `关于"${userText}"，本次会议讨论提到：决定将预设模板从 6 个精简为 3 个。`,
                originalQ: userText,
                attached: false
            }]);
        }, 1500);
    };

    const attachToRecord = (msgId) => {
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, attached: true } : m));
        const msg = messages.find(m => m.id === msgId);
        if (msg) onAttach({ q: msg.originalQ, a: msg.text, attachedAt: new Date().toLocaleTimeString('zh-CN', {hour12:false, hour:'2-digit', minute:'2-digit'}) });
    };

    return (
        <div className="flex flex-col h-full bg-[#f5f5f5] w-full isolate z-[100] absolute inset-0">
            <div className="h-[44px] px-4 flex items-center justify-between bg-white shrink-0 pt-[36px] pb-[10px] box-content border-b-[0.5px] border-[#e5e5e5] relative">
                <button onClick={onBack} className="text-[34px] text-[#1a1a1a] font-light leading-none w-10 flex items-center mt-[-4px]">‹</button>
                <div className="absolute left-14 right-14 top-[36px] text-center text-[16px] font-semibold text-[#1a1a1a] truncate z-0">{meeting.title || 'AI 产品路线图讨论'}</div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-[16px] flex flex-col relative z-10 touch-pan-y">
                <div className="flex flex-col gap-2 mt-[40px] mb-2">
                    <div className="bg-white border border-[#e5e5e5] rounded-[16px] px-[14px] py-[10px] text-[14px] text-[#333] self-start cursor-pointer active:scale-95 transition-transform" onClick={()=>setInput("总结这次会议的核心")}>总结这次会议的核心</div>
                    <div className="bg-white border border-[#e5e5e5] rounded-[16px] px-[14px] py-[10px] text-[14px] text-[#333] self-start cursor-pointer active:scale-95 transition-transform" onClick={()=>setInput("提取 Action Items")}>提取 Action Items</div>
                </div>

                {messages.map(m => (
                    <div key={m.id} className={`mb-[12px] flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-[14px] py-[10px] text-[15px] leading-[1.5] ${m.role === 'user' ? 'bg-[#1a1a1a] text-white rounded-[18px] rounded-br-[4px]' : 'bg-white text-[#333] rounded-[18px] rounded-bl-[4px] shadow-[0_1px_3px_rgba(0,0,0,0.05)]'}`}>
                            {m.text}
                            {m.role === 'ai' && (
                                <div className="flex justify-end gap-2 mt-[8px]">
                                    <button 
                                        onClick={() => !m.attached && attachToRecord(m.id)}
                                        className={`flex items-center gap-1 px-[10px] py-[4px] rounded-full text-[12px] bg-transparent transition-colors ${m.attached ? 'text-[#4CD9AC]' : 'text-[#999] active:bg-[#f0f0f0]'}`}
                                    >
                                        <CornerDownRight size={12} /> {m.attached ? '已附加' : '附加到记录'}
                                    </button>
                                    <button 
                                        onClick={() => {}}
                                        className="flex items-center gap-1 px-[10px] py-[4px] rounded-full text-[12px] text-[#007AFF] bg-transparent active:bg-[#f0f0f0] transition-colors font-medium"
                                    >
                                        生成模板
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start mb-[12px]">
                        <div className="bg-white px-[14px] py-[14px] rounded-[18px] rounded-bl-[4px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-[#ccc] rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-[#ccc] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                            <span className="w-1.5 h-1.5 bg-[#ccc] rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                        </div>
                    </div>
                )}
            </div>

            <div className="px-4 pt-[10px] pb-[16px] bg-white flex items-end gap-[10px] shrink-0 border-t-[0.5px] border-[#ececec]">
                <textarea 
                    value={input}
                    onChange={e=>setInput(e.target.value)}
                    placeholder="输入你的问题..."
                    className="flex-1 bg-[#f5f5f5] rounded-[20px] px-[16px] py-[10px] text-[15px] text-[#333] placeholder-[#999] outline-none resize-none max-h-[100px] leading-[1.4] m-0 border border-[#e5e5e5]"
                    rows={1}
                />
                <button 
                    onClick={handleSend}
                    className={`w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0 transition-all ${input.trim() ? 'bg-[#4CD9AC] opacity-100' : 'bg-[#e5e5e5] opacity-50'}`}
                >
                    <Send size={15} fill={input.trim() ? "white" : "#999"} className={input.trim() ? "text-white ml-0.5" : "text-[#999] ml-0.5"} />
                </button>
            </div>
        </div>
    );
}

