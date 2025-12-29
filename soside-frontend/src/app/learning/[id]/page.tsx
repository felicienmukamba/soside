'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { learningService, Course, Module, Lesson } from '@/services/learningService';
import { ArrowLeft, BookOpen, Clock, CheckCircle2, PlayCircle, FileText, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';

export default function CourseDetailPage() {
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await learningService.getCourseDetails(params.id as string);
        setCourse(data);
        if (data.modules && data.modules.length > 0) {
          setSelectedModule(data.modules[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  const calculateProgress = () => {
    if (!course?.modules) return 0;
    const totalLessons = course.modules.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0);
    if (totalLessons === 0) return 0;
    return (completedLessons.size / totalLessons) * 100;
  };

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cours non trouvé</h1>
          <Button asChild>
            <Link href="/learning">Retour aux formations</Link>
          </Button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  const currentModule = course.modules?.find(m => m.id === selectedModule);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/learning" className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Retour aux formations
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={course.thumbnail || 'https://via.placeholder.com/1920x1080'}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <Badge variant="secondary" className="mb-4">
              {course.category || 'Formation'}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {course.title}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {course.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Progress */}
            {progress > 0 && (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progression globale</span>
                    <span className="text-sm font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </CardContent>
              </Card>
            )}

            {/* Modules and Lessons */}
            {course.modules && course.modules.length > 0 ? (
              <Tabs value={selectedModule || undefined} onValueChange={setSelectedModule}>
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {course.modules.map((module, index) => (
                    <TabsTrigger key={module.id} value={module.id} className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Module {index + 1}</span>
                        <Badge variant="outline" className="ml-auto">
                          {module.lessons?.length || 0} leçons
                        </Badge>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {course.modules.map((module) => (
                  <TabsContent key={module.id} value={module.id} className="space-y-4">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-2xl">{module.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {module.lessons && module.lessons.length > 0 ? (
                          module.lessons.map((lesson, idx) => (
                            <div key={lesson.id} className="space-y-2">
                              <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary font-semibold shrink-0">
                                    {idx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      {lesson.type === 'video' && <PlayCircle className="size-4 text-primary" />}
                                      {lesson.type === 'article' && <FileText className="size-4 text-primary" />}
                                      {lesson.type === 'quiz' && <HelpCircle className="size-4 text-primary" />}
                                      <h3 className="font-semibold">{lesson.title}</h3>
                                    </div>
                                    {lesson.duration && (
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Clock className="size-3" />
                                        <span>{lesson.duration}</span>
                                      </div>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleLessonComplete(lesson.id)}
                                    className={completedLessons.has(lesson.id) ? 'text-green-500' : ''}
                                  >
                                    <CheckCircle2
                                      className={`size-5 ${
                                        completedLessons.has(lesson.id)
                                          ? 'fill-green-500 text-green-500'
                                          : ''
                                      }`}
                                    />
                                  </Button>
                                </div>
                              </div>
                              {lesson.contentUrl && (
                                <div className="ml-14 p-4 bg-muted/50 rounded-lg">
                                  {lesson.type === 'article' ? (
                                    <MarkdownRenderer content={lesson.contentUrl} />
                                  ) : (
                                    <div className="text-sm text-muted-foreground">
                                      Contenu disponible: {lesson.contentUrl}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-8">
                            Aucune leçon disponible dans ce module.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">
                    Le contenu de ce cours sera bientôt disponible.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-24">
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.duration && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Durée:</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                )}
                <Separator />
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Niveau:</span>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                {course.modules && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Modules:</span>
                      <span className="font-medium">{course.modules.length}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" size="lg">
                  S'inscrire au cours
                </Button>
                <Button variant="outline" className="w-full">
                  Partager
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

