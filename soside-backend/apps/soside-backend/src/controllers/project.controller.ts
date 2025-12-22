import { Controller, Get, Post, Body, Inject, Param, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
// We should ideally share DTOs via a shared library (libs), but for now duplicate or define locally
// For simplicity in this mono-repo setup without libs folder structure initiated, I will use `any` or strict types if I copy DTOs.
// To follow clean code, I should copy the DTO structure or use a shared lib.
// Defining DTOs here to avoid 'any'.

class CreateProjectDto {
    title: string;
    description: string;
    techStack: string[];
    imageUrl?: string;
    location?: { type: 'Point'; coordinates: number[] };
    region: string;
}

@ApiTags('projects')
@Controller('projects')
export class ProjectServiceController {
    constructor(@Inject('PROJECT_SERVICE') private readonly projectClient: ClientProxy) { }

    @Post()
    @ApiOperation({ summary: 'Create a new project' })
    create(@Body() createProjectDto: CreateProjectDto) {
        return this.projectClient.send('create_project', createProjectDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all projects' })
    findAll() {
        return this.projectClient.send('find_all_projects', {});
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get project by ID' })
    findOne(@Param('id') id: string) {
        return this.projectClient.send('find_project_by_id', id);
    }

    @Get('region/:region')
    @ApiOperation({ summary: 'Get projects by region' })
    findByRegion(@Param('region') region: string) {
        return this.projectClient.send('find_projects_by_region', region);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a project' })
    update(@Param('id') id: string, @Body() updateProjectDto: Partial<CreateProjectDto>) {
        return this.projectClient.send('update_project', { id, updateProjectDto });
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a project' })
    remove(@Param('id') id: string) {
        return this.projectClient.send('remove_project', id);
    }
}
