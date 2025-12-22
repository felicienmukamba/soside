import { Controller, Get, Post, Body, Inject, Param, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('recruitment')
@Controller('recruitment')
export class RecruitmentController {
    constructor(@Inject('RECRUITMENT_SERVICE') private readonly recruitmentClient: ClientProxy) { }

    @Get('jobs')
    @ApiOperation({ summary: 'Get all job posts' })
    findAllJobs() {
        return this.recruitmentClient.send('find_all_job_posts', {});
    }

    @Get('jobs/:id')
    @ApiOperation({ summary: 'Get job post by ID' })
    findOneJob(@Param('id') id: string) {
        return this.recruitmentClient.send('find_job_post_by_id', id);
    }

    @Post('jobs')
    @ApiOperation({ summary: 'Create a new job post' })
    createJob(@Body() data: any) {
        return this.recruitmentClient.send('create_job_post', data);
    }

    @Patch('jobs/:id')
    @ApiOperation({ summary: 'Update a job post' })
    updateJob(@Param('id') id: string, @Body() data: any) {
        return this.recruitmentClient.send('update_job_post', { id, jobData: data });
    }

    @Delete('jobs/:id')
    @ApiOperation({ summary: 'Delete a job post' })
    removeJob(@Param('id') id: string) {
        return this.recruitmentClient.send('remove_job_post', id);
    }

    @Post('jobs/:jobId/apply')
    @ApiOperation({ summary: 'Apply for a job' })
    apply(@Param('jobId') jobId: string, @Body() data: any) {
        return this.recruitmentClient.send('create_application', { jobId, ...data });
    }

    @Get('jobs/:jobId/applications')
    @ApiOperation({ summary: 'Get applications for a job' })
    getApplications(@Param('jobId') jobId: string) {
        return this.recruitmentClient.send('get_applications_by_job', jobId);
    }
}
