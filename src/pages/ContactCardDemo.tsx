import React from 'react';
import { FiveElementsDemoShell } from '../components/FiveElementsDemoShell';

const alexProfileData = {
    name: 'Chen',
    enName: 'Alex',
    headline: '专注于推动企业级 AI 转型。寻找有潜力的初创团队进行深度合作。',
    intersections: {
        common: '基于你们的背景，Vertex Solutions 可能对 Moly 当前的效率工具矩阵感兴趣。建议围绕"Agent 办公流集成"探讨。',
        topics: ['AI 战略规划', 'B端 SaaS 落地', 'Agent 办公流集成'],
    },
    baseInfo: {
        position: 'AI 战略总监',
        company: 'Vertex Solutions',
        address: '上海 · 浦东',
        industry: '风险投资 / 企业服务 / AI',
        notes: '重点关注多模态大模型在 B 端场景的落地应用，特别是效率工具和智能客服方向。',
    }
};

const ContactCardDemo = () => {
    return (
        <FiveElementsDemoShell 
            profileData={alexProfileData} 
            title="联系人名片 (Alex Chen)" 
            backUrl="/contacts" 
            backText="返回联系人" 
        />
    );
};

export default ContactCardDemo;
