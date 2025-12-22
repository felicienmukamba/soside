import { Controller } from '@nestjs/common';
import { RecruitmentServiceService } from './recruitment-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class RecruitmentServiceController {
  constructor(private readonly recruitmentService: RecruitmentServiceService) { }

  @MessagePattern('create_job_post')
  createJobPost(@Payload() data: any) {
    return this.recruitmentService.createJobPost(data);
  }

  @MessagePattern('find_all_job_posts')
  findAllJobPosts() {
    return this.recruitmentService.findAllJobPosts();
  }

  @MessagePattern('find_job_post_by_id')
  findJobPostById(@Payload() id: string) {
    return this.recruitmentService.findJobPostById(id);
  }

  @MessagePattern('create_application')
  createApplication(@Payload() data: any) {
    return this.recruitmentService.createApplication(data);
  }

  @MessagePattern('update_application_status')
  updateApplicationStatus(@Payload() data: { id: string; status: string }) {
    return this.recruitmentService.updateApplicationStatus(data.id, data.status);
  }

  @MessagePattern('get_applications_by_job')
  getApplicationsByJob(@Payload() jobPostId: string) {
    return this.recruitmentService.getApplicationsByJob(jobPostId);
  }

  @MessagePattern('get_candidate_applications')
  getCandidateApplications(@Payload() candidateId: string) {
    return this.recruitmentService.getCandidateApplications(candidateId);
  }

  @MessagePattern('add_developer_skill')
  addSkill(@Payload() data: { developerId: string; skillName: string; proficiencyLevel: number }) {
    return this.recruitmentService.addSkill(data.developerId, data.skillName, data.proficiencyLevel);
  }

  @MessagePattern('get_developer_skills')
  getDeveloperSkills(@Payload() developerId: string) {
    return this.recruitmentService.getDeveloperSkills(developerId);
  }
}
