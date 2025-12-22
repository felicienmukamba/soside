import api from '../lib/api-client';

export interface JobOffer {
    id: string;
    title: string;
    description: string;
    location: string;
    type: 'Full-time' | 'Contract' | 'Remote';
    category: string;
}

export const recruitmentService = {
    getJobs: async (): Promise<JobOffer[]> => {
        const response = await api.get('/recruitment/jobs');
        return response.data;
    },

    apply: async (jobId: string, data: any): Promise<void> => {
        await api.post(`/recruitment/jobs/${jobId}/apply`, data);
    }
};
