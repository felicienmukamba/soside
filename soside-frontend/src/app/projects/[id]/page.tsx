'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProjectStore } from '@/store/projectStore';
import { ArrowLeft, Calendar, Tag, User, Globe, MapPin, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Skeleton } from '@/components/ui/skeleton';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { getProjectById, loading, fetchProjects } = useProjectStore();
  const [showMap, setShowMap] = React.useState(false);

  const project = getProjectById(id as string);

  useEffect(() => {
    if (!project) {
      fetchProjects();
    }
  }, [id, project, fetchProjects]);

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXV4NTFiamM2ZjJ6OG9rOXhhN2gifQ.rJcFIG214AriISLbB6B5aw';

  const [viewState, setViewState] = React.useState({
    longitude: project?.location?.lng || 23.5,
    latitude: project?.location?.lat || -2.5,
    zoom: 12,
  });

  if (loading || !project) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/projects" className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Retour au Portfolio
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src={project.imageUrl || 'https://via.placeholder.com/1920x1080'}
          alt={project.title}
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
              {project.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {project.title}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              {project.status === 'completed' ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-green-500" />
                  <span>Terminé</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-yellow-500" />
                  <span>En cours</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Description du <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Projet</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Technologies Utilisées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm py-1 px-3">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Map */}
            {project.location && project.location.lat && project.location.lng && (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <MapPin className="size-6 text-primary" />
                      Localisation
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMap(!showMap)}
                    >
                      {showMap ? 'Masquer' : 'Afficher'} la carte
                    </Button>
                  </div>
                </CardHeader>
                {showMap && (
                  <CardContent>
                    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-border/50">
                      <Map
                        {...viewState}
                        onMove={(evt: any) => setViewState(evt.viewState)}
                        mapboxAccessToken={MAPBOX_TOKEN}
                        mapStyle="mapbox://styles/mapbox/dark-v11"
                        style={{ width: '100%', height: '100%' }}
                      >
                        <Marker
                          longitude={project.location.lng}
                          latitude={project.location.lat}
                          // @ts-ignore - react-map-gl v8 types issue
                          anchor="bottom"
                        >
                          <MapPin className="size-8 text-primary drop-shadow-lg" fill="currentColor" />
                        </Marker>
                      </Map>
                    </div>
                    {project.location.city && (
                      <p className="text-sm text-muted-foreground mt-4">
                        <MapPin className="size-4 inline mr-1" />
                        {project.location.city}
                      </p>
                    )}
                  </CardContent>
                )}
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-24">
              <CardHeader>
                <CardTitle>Détails du Projet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="size-4" />
                    <span>Catégorie</span>
                  </div>
                  <Badge variant="secondary">{project.category}</Badge>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="size-4" />
                    <span>Client</span>
                  </div>
                  <p className="font-medium">{project.clientName || 'Confidentiel'}</p>
                </div>

                {project.location?.city && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="size-4" />
                        <span>Localisation</span>
                      </div>
                      <p className="font-medium">{project.location.city}</p>
                    </div>
                  </>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="size-4" />
                    <span>Statut</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.status === 'completed' ? (
                      <>
                        <CheckCircle2 className="size-4 text-green-500" />
                        <span className="font-medium">Terminé</span>
                      </>
                    ) : (
                      <>
                        <Clock className="size-4 text-yellow-500" />
                        <span className="font-medium">En cours</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Intéressé par ce type de solution ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Contactez notre équipe de consultants pour une étude personnalisée.
                </p>
                <Button className="w-full" size="lg">
                  Démarrer un projet
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
