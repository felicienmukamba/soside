import { projectService } from './projectService';
import { learningService } from './learningService';
import { userService } from './userService';
import { recruitmentService } from './recruitmentService';

export interface DashboardStats {
    activeProjects: number;
    totalStudents: number;
    totalCourses: number;
    jobOffers: number;
}

export const statsService = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        try {
            const [projects, courses, users, jobs] = await Promise.all([
                projectService.getAll(),
                learningService.getAllCourses(),
                userService.getAll(),
                recruitmentService.getJobs()
            ]);

            return {
                activeProjects: projects.length,
                totalStudents: users.filter(u => u.role === 'student').length,
                totalCourses: courses.length,
                jobOffers: jobs.length
            };
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
            return {
                activeProjects: 0,
                totalStudents: 0,
                totalCourses: 0,
                jobOffers: 0
            };
        }
    }
};
