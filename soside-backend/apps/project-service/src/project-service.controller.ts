import { Controller } from '@nestjs/common';
import { ProjectServiceService } from './project-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller()
export class ProjectServiceController {
  constructor(private readonly projectService: ProjectServiceService) { }

  @MessagePattern('create_project')
  create(@Payload() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @MessagePattern('find_all_projects')
  findAll() {
    return this.projectService.findAll();
  }

  @MessagePattern('find_project_by_id')
  findOne(@Payload() id: string) {
    return this.projectService.findOne(id);
  }

  @MessagePattern('find_projects_by_region')
  findByRegion(@Payload() region: string) {
    return this.projectService.findByRegion(region);
  }

  @MessagePattern('create_location')
  createLocation(@Payload() data: { city: string; latitude: number; longitude: number; address?: string }) {
    return this.projectService.createLocation(data.city, data.latitude, data.longitude, data.address);
  }

  @MessagePattern('add_project_media')
  addMedia(@Payload() data: { projectId: string; url: string; type: 'image' | 'video'; isMain?: boolean }) {
    return this.projectService.addMedia(data.projectId, data.url, data.type, data.isMain);
  }

  @MessagePattern('get_project_media')
  getProjectMedia(@Payload() projectId: string) {
    return this.projectService.getProjectMedia(projectId);
  }

  @MessagePattern('delete_media')
  deleteMedia(@Payload() id: string) {
    return this.projectService.deleteMedia(id);
  }
}
