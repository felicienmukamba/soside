import api from '../lib/api-client';

export interface BlogPost {
    id: string;
    title: string;
    summary: string;
    content: string;
    category: string;
    authorId: string;
    authorName: string;
    publishedAt: string;
    coverImage?: string;
}

export const blogService = {
    getPosts: async (): Promise<BlogPost[]> => {
        const response = await api.get('/blog');
        return response.data;
    },

    getPostBySlug: async (slug: string): Promise<BlogPost> => {
        const response = await api.get(`/blog/${slug}`);
        return response.data;
    }
};
