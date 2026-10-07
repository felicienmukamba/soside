import { Module } from '@nestjs/common';
import { LearningServiceController } from './learning-service.controller';
import { LearningServiceService } from './learning-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Module as CourseModule } from './module.entity';
import { Lesson } from './lesson.entity';
import { Enrollment } from './enrollment.entity';
import { Certificate } from './certificate.entity';

export const LEARNING_ENTITIES = [Course, CourseModule, Lesson, Enrollment, Certificate];

// Contrôleurs et services sans connexion : réutilisés par la gateway en mode monolithe (Vercel).
@Module({
  imports: [TypeOrmModule.forFeature(LEARNING_ENTITIES)],
  controllers: [LearningServiceController],
  providers: [LearningServiceService],
})
export class LearningCoreModule { }
