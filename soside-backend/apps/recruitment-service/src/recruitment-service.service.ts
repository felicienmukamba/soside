import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPost } from './job-post.entity';
import { Application } from './application.entity';
import { DeveloperSkill } from './developer-skill.entity';
import { ApplicationStatus } from './enums/recruitment.enum';

@Injectable()
export class RecruitmentServiceService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(DeveloperSkill)
    private readonly skillRepository: Repository<DeveloperSkill>,
  ) { }

  async createJobPost(data: any): Promise<JobPost> {
    const jobPost = this.jobPostRepository.create(data);
    return this.jobPostRepository.save(jobPost) as any as Promise<JobPost>;
  }

  async findAllJobPosts(): Promise<JobPost[]> {
    return this.jobPostRepository.find({ relations: ['applications'] });
  }

  async findJobPostById(id: string): Promise<JobPost | null> {
    return this.jobPostRepository.findOne({
      where: { id },
      relations: ['applications']
    });
  }

  async createApplication(data: any): Promise<Application> {
    const application = this.applicationRepository.create(data);
    return this.applicationRepository.save(application) as any as Promise<Application>;
  }

  async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<void> {
    await this.applicationRepository.update(id, { status });
  }

  async getApplicationsByJob(jobPostId: string): Promise<Application[]> {
    return this.applicationRepository.find({ where: { jobPostId } });
  }

  async getCandidateApplications(candidateId: string): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { candidateId },
      relations: ['jobPost']
    });
  }

  async addSkill(developerId: string, skillName: string, proficiencyLevel: number): Promise<DeveloperSkill> {
    const skill = this.skillRepository.create({ developerId, skillName, proficiencyLevel });
    return this.skillRepository.save(skill);
  }

  async getDeveloperSkills(developerId: string): Promise<DeveloperSkill[]> {
    return this.skillRepository.find({ where: { developerId } });
  }
}
