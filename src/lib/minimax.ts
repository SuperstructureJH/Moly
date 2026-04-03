export type MiniMaxMessage = {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content?: string;
    tool_call_id?: string;
    tool_calls?: unknown[];
};

export type MiniMaxChatPayload = {
    model?: string;
    messages: MiniMaxMessage[];
    tools?: unknown[];
    tool_choice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
    temperature?: number;
};

const DEFAULT_MINIMAX_MODEL = 'MiniMax-M2.5-highspeed';

export const stripThinkTags = (content = '') =>
    content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

export const getMiniMaxMessage = (payload: any) => payload?.choices?.[0]?.message || null;

export const getMiniMaxText = (payload: any) => stripThinkTags(getMiniMaxMessage(payload)?.content || '');

export const requestMiniMaxChat = async (payload: MiniMaxChatPayload) => {
    const response = await fetch('/api/minimax/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...payload,
            model: payload.model || DEFAULT_MINIMAX_MODEL,
            temperature: payload.temperature ?? 0.4,
        }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = data?.error?.message || data?.error || 'MiniMax request failed.';
        throw new Error(message);
    }

    return data;
};

export const parseJsonFromText = <T,>(rawText: string): T | null => {
    const text = rawText.trim();
    if (!text) return null;

    const candidates = [
        text,
        text.match(/```json\s*([\s\S]*?)```/i)?.[1]?.trim(),
        text.match(/```\s*([\s\S]*?)```/i)?.[1]?.trim(),
    ].filter(Boolean) as string[];

    const firstArrayIndex = text.indexOf('[');
    const lastArrayIndex = text.lastIndexOf(']');
    if (firstArrayIndex !== -1 && lastArrayIndex > firstArrayIndex) {
        candidates.push(text.slice(firstArrayIndex, lastArrayIndex + 1));
    }

    const firstObjectIndex = text.indexOf('{');
    const lastObjectIndex = text.lastIndexOf('}');
    if (firstObjectIndex !== -1 && lastObjectIndex > firstObjectIndex) {
        candidates.push(text.slice(firstObjectIndex, lastObjectIndex + 1));
    }

    for (const candidate of candidates) {
        try {
            return JSON.parse(candidate) as T;
        } catch {
            continue;
        }
    }

    return null;
};
