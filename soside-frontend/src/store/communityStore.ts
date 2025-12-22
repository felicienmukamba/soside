import { create } from 'zustand';
import { communityService, Chapter, Event } from '../services/communityService';

interface CommunityState {
    chapters: Chapter[];
    events: Event[];
    activeChapter: Chapter | null;
    loading: boolean;
    error: string | null;
    fetchChapters: () => Promise<void>;
    fetchEvents: () => Promise<void>;
    setActiveChapter: (chapter: Chapter) => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
    chapters: [],
    events: [],
    activeChapter: null,
    loading: false,
    error: null,
    fetchChapters: async () => {
        set({ loading: true, error: null });
        try {
            const chapters = await communityService.getChapters();
            set({ chapters, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
    fetchEvents: async () => {
        set({ loading: true, error: null });
        try {
            const events = await communityService.getEvents();
            set({ events, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
    setActiveChapter: (chapter) => set({ activeChapter: chapter }),
}));
