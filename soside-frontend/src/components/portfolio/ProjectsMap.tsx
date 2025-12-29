'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import { Project } from '@/services/projectService';

interface ProjectsMapProps {
  projects: Project[];
  selectedCategory?: string;
  selectedRegion?: string;
}

export default function ProjectsMap({ projects, selectedCategory, selectedRegion }: ProjectsMapProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (selectedCategory && project.category !== selectedCategory) return false;
      if (selectedRegion && project.location?.city !== selectedRegion) return false;
      if (!project.location?.lat || !project.location?.lng) return false;
      return true;
    });
  }, [projects, selectedCategory, selectedRegion]);

  const handleMarkerClick = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  // Calculate center based on projects
  const center = useMemo(() => {
    if (filteredProjects.length === 0) {
      return { longitude: 23.5, latitude: -2.5, zoom: 5.5 };
    }

    const lngs = filteredProjects.map(p => p.location!.lng);
    const lats = filteredProjects.map(p => p.location!.lat);
    
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;

    return {
      longitude: centerLng,
      latitude: centerLat,
      zoom: filteredProjects.length === 1 ? 12 : 6,
    };
  }, [filteredProjects]);

  const [viewState, setViewState] = useState(center);

  // Update view when filters change
  React.useEffect(() => {
    setViewState(center);
  }, [center]);

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXV4NTFiamM2ZjJ6OG9rOXhhN2gifQ.rJcFIG214AriISLbB6B5aw';

  if (filteredProjects.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">
            Aucun projet géolocalisé trouvé avec les filtres sélectionnés.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border border-border/50 shadow-lg">
      <div className="h-[600px] w-full relative">
        <Map
          {...viewState}
          onMove={(evt: any) => setViewState(evt.viewState)}
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          style={{ width: '100%', height: '100%' }}
        >
          {filteredProjects.map((project) => {
            if (!project.location?.lat || !project.location?.lng) return null;
            
            return (
              <Marker
                key={project.id}
                longitude={project.location.lng}
                latitude={project.location.lat}
                // @ts-ignore - react-map-gl v8 types issue
                anchor="bottom"
                onClick={() => handleMarkerClick(project)}
              >
                <div
                  className="cursor-pointer transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <MapPin
                    className={`size-8 transition-colors ${
                      hoveredProject === project.id || selectedProject?.id === project.id
                        ? 'text-primary'
                        : 'text-secondary'
                    } drop-shadow-lg`}
                    fill="currentColor"
                  />
                  {hoveredProject === project.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-semibold whitespace-nowrap shadow-lg"
                    >
                      {project.title}
                    </motion.div>
                  )}
                </div>
              </Marker>
            );
          })}

          {selectedProject && selectedProject.location && (
              <Popup
                longitude={selectedProject.location.lng}
                latitude={selectedProject.location.lat}
                // @ts-ignore - react-map-gl v8 types issue
                anchor="bottom"
                onClose={() => setSelectedProject(null)}
                closeButton={false}
                // @ts-ignore - react-map-gl v8 types issue
                maxWidth="300px"
              >
              <Card className="border-0 shadow-none p-0 w-[280px]">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 line-clamp-2">
                        {selectedProject.title}
                      </CardTitle>
                      <Badge variant="outline" className="mb-2">
                        {selectedProject.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 shrink-0"
                      onClick={() => setSelectedProject(null)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {selectedProject.description}
                  </p>
                  {selectedProject.location.city && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                      <MapPin className="size-3" />
                      {selectedProject.location.city}
                    </div>
                  )}
                  <Button asChild size="sm" className="w-full">
                    <Link href={`/projects/${selectedProject.id}`}>
                      Voir les détails
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}

