import api from '../lib/api-client';

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    level: string;
    category: string;
    modules?: Module[];
}

export interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

export interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'article' | 'quiz';
    contentUrl?: string;
    duration?: string;
}

export const learningService = {
    getAllCourses: async (): Promise<Course[]> => {
        const response = await api.get('/learning/courses');
        return response.data;
    },

    getCourseDetails: async (id: string): Promise<Course> => {
        const response = await api.get(`/learning/courses/${id}`);
        return response.data;
    },

    getEnrollments: async (): Promise<any[]> => {
        const response = await api.get('/learning/enrollments');
        return response.data;
    }
};
