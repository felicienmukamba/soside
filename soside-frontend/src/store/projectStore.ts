import { create } from 'zustand';
import api from '../lib/api-client';
import { Project } from '../services/projectService';

interface ProjectState {
    projects: Project[];
    loading: boolean;
    error: string | null;
    fetchProjects: () => Promise<void>;
    getProjectById: (id: string) => Project | undefined;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: [],
    loading: false,
    error: null,
    fetchProjects: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/projects');
            set({ projects: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
    getProjectById: (id) => {
        return get().projects.find((p) => p.id === id);
    },
}));
