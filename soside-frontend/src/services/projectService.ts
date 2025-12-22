import api from '../lib/api-client';

export interface Project {
    id: string;
    title: string;
    description: string;
    category: string;
    techStack: string[];
    imageUrl: string;
    clientName?: string;
    status: string;
    location?: {
        lat: number;
        lng: number;
        city: string;
    };
}

export const projectService = {
    getAll: async (): Promise<Project[]> => {
        const response = await api.get('/projects');
        return response.data;
    },

    getById: async (id: string): Promise<Project> => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },

    getByCategory: async (category: string): Promise<Project[]> => {
        const response = await api.get(`/projects?category=${category}`);
        return response.data;
    },

    create: async (project: Omit<Project, 'id'>): Promise<Project> => {
        const response = await api.post('/projects', project);
        return response.data;
    },

    update: async (id: string, project: Partial<Project>): Promise<Project> => {
        const response = await api.patch(`/projects/${id}`, project);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/projects/${id}`);
    }
};
