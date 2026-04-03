import React from 'react';
import { FiveElementsDemoShell } from '../components/FiveElementsDemoShell';

const myProfileData = {
    name: '董江涵',
    enName: 'Jianghan',
    headline: '在做一个面向商务人士的 AI 秘书产品。',
    intersections: {
        common: '如果你也在北京做 AI 产品，或者关注商务效率工具，我们大概率有得聊。',
        topics: ['AI 产品设计', '商务人群需求', '效率工具赛道'],
    },
    baseInfo: {
        position: '产品负责人',
        company: 'Moly',
        address: '北京 · 朝阳',
        industry: '智能助理 / AI 产品',
        notes: '致力于创造最懂你的 AI 日程与人脉管家，通过极简对话释放创造力。',
    }
};

const DigitalCard08Demo = () => {
    return (
        <FiveElementsDemoShell 
            profileData={myProfileData} 
            title="数字名片 (Moly 0.8)" 
            backUrl="/" 
            backText="返回演示中心" 
        />
    );
};

export default DigitalCard08Demo;
