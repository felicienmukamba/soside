'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Signal, Users, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration?: string;
    level: string;
    category?: string;
    modules?: Array<{ id: string; title: string; lessons: any[] }>;
    progress?: number;
    enrolled?: boolean;
  };
}

const levelColors = {
  beginner: 'bg-green-500/10 text-green-500 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default function CourseCardImproved({ course }: CourseCardProps) {
  const levelKey = course.level?.toLowerCase() as keyof typeof levelColors;
  const levelColor = levelColors[levelKey] || levelColors.beginner;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all hover:shadow-lg group overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.thumbnail || 'https://via.placeholder.com/400x225'}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            {course.category && (
              <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
                {course.category}
              </Badge>
            )}
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className={cn('backdrop-blur-sm bg-background/80', levelColor)}>
              <Signal className="size-3 mr-1" />
              {course.level}
            </Badge>
          </div>
        </div>

        <CardHeader>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {course.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {course.duration && (
              <div className="flex items-center gap-1">
                <Clock className="size-4" />
                <span>{course.duration}</span>
              </div>
            )}
            {course.modules && (
              <div className="flex items-center gap-1">
                <BookOpen className="size-4" />
                <span>{course.modules.length} module{course.modules.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {course.progress !== undefined && course.progress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progression</span>
                <span className="font-medium">{Math.round(course.progress)}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          )}

          {course.enrolled && (
            <Badge variant="outline" className="w-full justify-center">
              <Award className="size-3 mr-1" />
              Inscrit
            </Badge>
          )}

          <Button asChild className="w-full" variant={course.enrolled ? 'default' : 'outline'}>
            <Link href={`/learning/${course.id}`}>
              {course.enrolled ? 'Continuer' : 'Voir le parcours'}
              <BookOpen className="size-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

