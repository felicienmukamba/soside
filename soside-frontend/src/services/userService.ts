import api from '../lib/api-client';

export interface User {
    id: string;
    email: string;
    role: 'admin' | 'student' | 'developer' | 'recruiter';
    isVerified: boolean;
    profile?: {
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    };
}

export const userService = {
    getAll: async (): Promise<User[]> => {
        const response = await api.get('/users');
        return response.data;
    },

    updateRole: async (id: string, role: string): Promise<User> => {
        const response = await api.patch(`/users/${id}/role`, { role });
        return response.data;
    },

    deleteUser: async (id: string): Promise<void> => {
        await api.delete(`/users/${id}`);
    }
};
