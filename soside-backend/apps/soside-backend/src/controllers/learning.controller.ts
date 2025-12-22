import { Controller, Get, Post, Body, Inject, Param, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('learning')
@Controller('learning')
export class LearningController {
    constructor(@Inject('LEARNING_SERVICE') private readonly learningClient: ClientProxy) { }

    @Post('courses')
    @ApiOperation({ summary: 'Create a new course' })
    createCourse(@Body() courseData: any) {
        return this.learningClient.send('create_course', courseData);
    }

    @Get('courses')
    @ApiOperation({ summary: 'Get all courses' })
    findAllCourses() {
        return this.learningClient.send('find_all_courses', {});
    }

    @Get('courses/:id')
    @ApiOperation({ summary: 'Get course by ID' })
    findOne(@Param('id') id: string) {
        return this.learningClient.send('find_course_by_id', id);
    }

    @Patch('courses/:id')
    @ApiOperation({ summary: 'Update a course' })
    updateCourse(@Param('id') id: string, @Body() courseData: any) {
        return this.learningClient.send('update_course', { id, courseData });
    }

    @Delete('courses/:id')
    @ApiOperation({ summary: 'Delete a course' })
    removeCourse(@Param('id') id: string) {
        return this.learningClient.send('remove_course', id);
    }

    @Post('enroll')
    @ApiOperation({ summary: 'Enroll a student in a course' })
    enroll(@Body() data: { studentId: string; courseId: string }) {
        return this.learningClient.send('enroll_student', data);
    }

    @Get('enrollments')
    @ApiOperation({ summary: 'Get all enrollments' })
    findEnrollments() {
        return this.learningClient.send('find_all_enrollments', {});
    }
}
