import { Controller } from '@nestjs/common';
import { LearningServiceService } from './learning-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class LearningServiceController {
  constructor(private readonly learningService: LearningServiceService) { }

  @MessagePattern('create_course')
  createCourse(@Payload() data: any) {
    return this.learningService.createCourse(data);
  }

  @MessagePattern('find_all_courses')
  findAllCourses() {
    return this.learningService.findAllCourses();
  }

  @MessagePattern('find_course_by_id')
  findCourseById(@Payload() id: string) {
    return this.learningService.findCourseById(id);
  }

  @MessagePattern('enroll_student')
  enrollStudent(@Payload() data: { studentId: string; courseId: string }) {
    return this.learningService.enrollStudent(data.studentId, data.courseId);
  }

  @MessagePattern('update_progress')
  updateProgress(@Payload() data: { enrollmentId: string; progressPercentage: number }) {
    return this.learningService.updateProgress(data.enrollmentId, data.progressPercentage);
  }

  @MessagePattern('get_student_enrollments')
  getStudentEnrollments(@Payload() studentId: string) {
    return this.learningService.getStudentEnrollments(studentId);
  }

  @MessagePattern('get_certificate_by_code')
  getCertificateByCode(@Payload() uniqueCode: string) {
    return this.learningService.getCertificateByCode(uniqueCode);
  }
}
