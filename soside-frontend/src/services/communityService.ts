import api from '../lib/api-client';

export interface Chapter {
    id: string;
    name: string;
    city: string;
    description: string;
    memberCount: number;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    type: 'virtual' | 'presentiel';
    chapterId: string;
}

export const communityService = {
    getChapters: async (): Promise<Chapter[]> => {
        const response = await api.get('/community/chapters');
        return response.data;
    },

    getEvents: async (): Promise<Event[]> => {
        const response = await api.get('/community/events');
        return response.data;
    },

    joinChapter: async (id: string): Promise<void> => {
        await api.post(`/community/chapters/${id}/join`);
    }
};
