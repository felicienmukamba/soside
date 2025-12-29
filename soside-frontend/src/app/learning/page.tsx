'use client';

import React, { useEffect } from 'react';
import { useLearningStore } from '@/store/learningStore';
import CourseCardImproved from '@/components/learning/CourseCardImproved';
import { motion } from 'framer-motion';
import { BookOpen, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LearningPage = () => {
  const { courses, loading, fetchCourses } = useLearningStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedLevel, setSelectedLevel] = React.useState<string>('all');

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const levels = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level?.toLowerCase() === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Devenez un Expert <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Tech</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Des parcours de formation certifiants conçus par des experts pour propulser votre carrière.
            </p>
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Rechercher un cours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              {levels.map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                >
                  {level === 'all' ? 'Tous' : level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {filteredCourses.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {filteredCourses.length} cours trouvé{filteredCourses.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Courses Grid */}
        {loading && courses.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-border/50">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <CourseCardImproved course={course} />
                </motion.div>
              ))
            ) : (
              <Card className="border-border/50 col-span-full">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground text-lg">
                    Aucun cours disponible pour le moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPage;
