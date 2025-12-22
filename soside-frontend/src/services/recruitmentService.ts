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

    createJob: async (job: Omit<JobOffer, 'id'>): Promise<JobOffer> => {
        const response = await api.post('/recruitment/jobs', job);
        return response.data;
    },

    updateJob: async (id: string, job: Partial<JobOffer>): Promise<JobOffer> => {
        const response = await api.patch(`/recruitment/jobs/${id}`, job);
        return response.data;
    },

    deleteJob: async (id: string): Promise<void> => {
        await api.delete(`/recruitment/jobs/${id}`);
    },

    apply: async (jobId: string, data: any): Promise<void> => {
        await api.post(`/recruitment/jobs/${jobId}/apply`, data);
    }
};
