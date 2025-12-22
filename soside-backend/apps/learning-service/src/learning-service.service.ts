import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { Module as CourseModule } from './module.entity';
import { Lesson } from './lesson.entity';
import { Enrollment } from './enrollment.entity';
import { Certificate } from './certificate.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LearningServiceService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(CourseModule)
    private readonly moduleRepository: Repository<CourseModule>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
  ) { }

  // Course operations
  async createCourse(data: any): Promise<Course> {
    const course = this.courseRepository.create(data as object);
    return this.courseRepository.save(course as Course);
  }

  async findAllCourses(): Promise<Course[]> {
    return this.courseRepository.find({ relations: ['modules', 'enrollments'] });
  }

  async findCourseById(id: string): Promise<Course | null> {
    return this.courseRepository.findOne({
      where: { id },
      relations: ['modules', 'modules.lessons']
    });
  }

  // Enrollment operations
  async enrollStudent(studentId: string, courseId: string): Promise<Enrollment> {
    const enrollment = this.enrollmentRepository.create({ studentId, courseId });
    return this.enrollmentRepository.save(enrollment);
  }

  async updateProgress(enrollmentId: string, progressPercentage: number): Promise<Enrollment> {
    await this.enrollmentRepository.update(enrollmentId, { progressPercentage });
    const enrollment = await this.enrollmentRepository.findOne({ where: { id: enrollmentId } });

    if (!enrollment) throw new Error('Enrollment not found');

    if (progressPercentage >= 100) {
      enrollment.completedAt = new Date();
      await this.enrollmentRepository.save(enrollment);
      await this.generateCertificate(enrollmentId);
    }

    return enrollment;
  }

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: { studentId },
      relations: ['course', 'certificate']
    });
  }

  // Certificate operations
  private async generateCertificate(enrollmentId: string): Promise<Certificate> {
    const uniqueCode = `CERT-${uuidv4().substring(0, 8).toUpperCase()}`;
    const certificate = this.certificateRepository.create({
      enrollmentId,
      issueDate: new Date(),
      uniqueCode,
    });
    return this.certificateRepository.save(certificate);
  }

  async getCertificateByCode(uniqueCode: string): Promise<Certificate | null> {
    return this.certificateRepository.findOne({
      where: { uniqueCode },
      relations: ['enrollment', 'enrollment.course']
    });
  }

  async updateCourse(id: string, data: any): Promise<Course | null> {
    await this.courseRepository.update(id, data);
    return this.findCourseById(id);
  }

  async deleteCourse(id: string): Promise<void> {
    await this.courseRepository.delete(id);
  }
}
