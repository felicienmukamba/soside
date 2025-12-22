import { create } from 'zustand';
import { learningService, Course } from '../services/learningService';

interface LearningState {
    courses: Course[];
    activeCourse: Course | null;
    loading: boolean;
    error: string | null;
    fetchCourses: () => Promise<void>;
    fetchCourseDetails: (id: string) => Promise<void>;
}

export const useLearningStore = create<LearningState>((set) => ({
    courses: [],
    activeCourse: null,
    loading: false,
    error: null,
    fetchCourses: async () => {
        set({ loading: true, error: null });
        try {
            const courses = await learningService.getAllCourses();
            set({ courses, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
    fetchCourseDetails: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const activeCourse = await learningService.getCourseDetails(id);
            set({ activeCourse, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));
