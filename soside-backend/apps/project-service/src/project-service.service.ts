import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from './project.entity';
import { ProjectCategory } from './project-category.entity';
import { ProjectTag } from './project-tag.entity';
import { Location } from './location.entity';
import { ProjectMedia } from './project-media.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { MediaType } from './enums/media-type.enum';

@Injectable()
export class ProjectServiceService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectCategory)
    private readonly categoryRepository: Repository<ProjectCategory>,
    @InjectRepository(ProjectTag)
    private readonly tagRepository: Repository<ProjectTag>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(ProjectMedia)
    private readonly mediaRepository: Repository<ProjectMedia>,
  ) { }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create({
      title: createProjectDto.title,
      description: createProjectDto.description,
      techStack: createProjectDto.techStack,
      imageUrl: createProjectDto.imageUrl,
      region: createProjectDto.region,
    });

    if (createProjectDto.location) {
      project.location = {
        type: 'Point',
        coordinates: createProjectDto.location.coordinates
      };
    }

    if (createProjectDto.categoryIds && createProjectDto.categoryIds.length > 0) {
      project.categories = await this.categoryRepository.findBy({
        id: In(createProjectDto.categoryIds),
      });
    }

    if (createProjectDto.tagIds && createProjectDto.tagIds.length > 0) {
      project.tags = await this.tagRepository.findBy({
        id: In(createProjectDto.tagIds),
      });
    }

    return this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({ relations: ['categories', 'tags', 'media', 'locationDetails'] });
  }

  async findOne(id: string): Promise<Project | null> {
    return this.projectRepository.findOne({
      where: { id },
      relations: ['categories', 'tags', 'media', 'locationDetails']
    });
  }

  async findByRegion(region: string): Promise<Project[]> {
    return this.projectRepository.find({
      where: { region },
      relations: ['categories', 'tags', 'media', 'locationDetails']
    });
  }

  // Location operations
  async createLocation(city: string, latitude: number, longitude: number, address?: string): Promise<Location> {
    const location = this.locationRepository.create({ city, latitude, longitude, address });
    return this.locationRepository.save(location);
  }

  async getLocationById(id: string): Promise<Location | null> {
    return this.locationRepository.findOne({ where: { id } });
  }

  // Media operations
  async addMedia(projectId: string, url: string, type: 'image' | 'video', isMain: boolean = false): Promise<ProjectMedia> {
    const media = this.mediaRepository.create({
      projectId,
      url,
      type: type === 'image' ? MediaType.IMAGE : MediaType.VIDEO,
      isMain
    });
    return this.mediaRepository.save(media) as any as Promise<ProjectMedia>;
  }

  async getProjectMedia(projectId: string): Promise<ProjectMedia[]> {
    return this.mediaRepository.find({ where: { projectId } });
  }

  async deleteMedia(id: string): Promise<void> {
    await this.mediaRepository.delete(id);
  }
}
