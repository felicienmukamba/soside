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

    createChapter: async (chapter: Omit<Chapter, 'id' | 'memberCount'>): Promise<Chapter> => {
        const response = await api.post('/community/chapters', chapter);
        return response.data;
    },

    updateChapter: async (id: string, chapter: Partial<Chapter>): Promise<Chapter> => {
        const response = await api.patch(`/community/chapters/${id}`, chapter);
        return response.data;
    },

    deleteChapter: async (id: string): Promise<void> => {
        await api.delete(`/community/chapters/${id}`);
    },

    getEventsByChapter: async (chapterId: string): Promise<Event[]> => {
        const response = await api.get(`/community/chapters/${chapterId}/events`);
        return response.data;
    },

    createEvent: async (event: Omit<Event, 'id'>): Promise<Event> => {
        const response = await api.post('/community/events', event);
        return response.data;
    },

    updateEvent: async (id: string, event: Partial<Event>): Promise<Event> => {
        const response = await api.patch(`/community/events/${id}`, event);
        return response.data;
    },

    deleteEvent: async (id: string): Promise<void> => {
        await api.delete(`/community/events/${id}`);
    },

    joinChapter: async (id: string): Promise<void> => {
        await api.post(`/community/chapters/${id}/join`);
    }
};
