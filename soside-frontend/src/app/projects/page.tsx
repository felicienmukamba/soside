'use client';

import React, { useEffect, useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import ProjectCard from '@/components/portfolio/ProjectCard';
import ProjectsMap from '@/components/portfolio/ProjectsMap';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, Grid3x3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ProjectsPage = () => {
  const { projects, loading, error, fetchProjects } = useProjectStore();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const categories = ['All', 'Web', 'Mobile', 'IA', 'Automation', 'BI'];
  const regions = ['All', 'Goma', 'Bukavu', 'Kinshasa', 'Mbujimayi'];

  const filteredProjects = projects.filter(p => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (regionFilter !== 'All' && p.location?.city !== regionFilter) return false;
    return true;
  });

  if (loading && projects.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="inline-block size-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Chargement des projets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Notre <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Portfolio</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Découvrez nos réalisations technologiques à travers la République Démocratique du Congo.
            </p>
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and View Toggle */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground self-center">Catégorie:</span>
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={categoryFilter === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground self-center">Région:</span>
              {regions.map(region => (
                <Button
                  key={region}
                  variant={regionFilter === region ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRegionFilter(region)}
                >
                  {region}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="size-4 mr-2" />
                Grille
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
              >
                <MapPin className="size-4 mr-2" />
                Carte
              </Button>
            </div>
          </div>

          {filteredProjects.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {error && (
          <Card className="border-destructive mb-6">
            <CardContent className="p-4">
              <p className="text-destructive">Erreur: {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        ) : (
          <ProjectsMap
            projects={filteredProjects}
            selectedCategory={categoryFilter !== 'All' ? categoryFilter : undefined}
            selectedRegion={regionFilter !== 'All' ? regionFilter : undefined}
          />
        )}

        {filteredProjects.length === 0 && !loading && (
          <Card className="border-border/50">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground text-lg">
                Aucun projet trouvé avec les filtres sélectionnés.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
