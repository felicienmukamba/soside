import { Module } from '@nestjs/common';
import { LearningServiceController } from './learning-service.controller';
import { LearningServiceService } from './learning-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Module as CourseModule } from './module.entity';
import { Lesson } from './lesson.entity';
import { Enrollment } from './enrollment.entity';
import { Certificate } from './certificate.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'soside_user',
      password: process.env.DB_PASSWORD || 'soside_password',
      database: process.env.DB_NAME || 'soside_db',
      entities: [Course, CourseModule, Lesson, Enrollment, Certificate],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Course, CourseModule, Lesson, Enrollment, Certificate]),
  ],
  controllers: [LearningServiceController],
  providers: [LearningServiceService],
})
export class LearningServiceModule { }
