import api from '../lib/api-client';

export interface AILog {
    id: string;
    prompt: string;
    response: string;
    createdAt: string;
}

export const aiService = {
    getLogs: async (): Promise<AILog[]> => {
        const response = await api.get('/ai/logs');
        return response.data;
    },

    sendPrompt: async (prompt: string): Promise<any> => {
        const response = await api.post('/ai/prompt', { prompt });
        return response.data;
    },

    triggerWorkflow: async (workflowId: string, input: any): Promise<any> => {
        const response = await api.post('/ai/workflow/automate', { workflowId, input });
        return response.data;
    }
};
