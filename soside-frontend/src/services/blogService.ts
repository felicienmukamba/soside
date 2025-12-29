import api from '../lib/api-client';

export interface BlogPost {
    id: string;
    title: string;
    summary: string;
    content: string;
    category: string;
    authorId: string;
    authorName?: string;
    author?: string;
    publishedAt: string;
    coverImage?: string;
    readTime?: number;
    tags?: string[];
}

export const blogService = {
    getPosts: async (): Promise<BlogPost[]> => {
        const response = await api.get('/blog');
        return response.data;
    },

    getPostsByCategory: async (category: string): Promise<BlogPost[]> => {
        const response = await api.get(`/blog/category/${category}`);
        return response.data;
    },

    createPost: async (post: Partial<BlogPost>): Promise<BlogPost> => {
        const response = await api.post('/blog', post);
        return response.data;
    },

    updatePost: async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
        const response = await api.patch(`/blog/${id}`, post);
        return response.data;
    },

    deletePost: async (id: string): Promise<void> => {
        await api.delete(`/blog/${id}`);
    },

    getPostBySlug: async (slug: string): Promise<BlogPost> => {
        const response = await api.get(`/blog/${slug}`);
        return response.data;
    },

    getPost: async (id: string): Promise<BlogPost> => {
        const response = await api.get(`/blog/${id}`);
        return response.data;
    }
};
