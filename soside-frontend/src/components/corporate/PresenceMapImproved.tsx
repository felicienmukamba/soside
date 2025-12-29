'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Location {
  id: string;
  name: string;
  city: string;
  details: string;
  coordinates: [number, number]; // [longitude, latitude]
  region: string;
}

const locations: Location[] = [
  {
    id: 'goma',
    name: 'Goma',
    city: 'Goma',
    details: 'Siège Social, Incubateur Tech',
    coordinates: [29.2289, -1.6792],
    region: 'Nord-Kivu',
  },
  {
    id: 'bukavu',
    name: 'Bukavu',
    city: 'Bukavu',
    details: 'Développement Software & IA',
    coordinates: [28.8608, -2.5083],
    region: 'Sud-Kivu',
  },
  {
    id: 'kinshasa',
    name: 'Kinshasa',
    city: 'Kinshasa',
    details: 'Relations B2G & Stratégie',
    coordinates: [15.2663, -4.3276],
    region: 'Kinshasa',
  },
  {
    id: 'mbujimayi',
    name: 'Mbujimayi',
    city: 'Mbujimayi',
    details: 'Formation & Automatisation',
    coordinates: [23.5967, -6.1360],
    region: 'Kasaï-Oriental',
  },
];

export default function PresenceMapImproved() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const regions = ['all', ...Array.from(new Set(locations.map(loc => loc.region)))];

  const filteredLocations = selectedRegion === 'all'
    ? locations
    : locations.filter(loc => loc.region === selectedRegion);

  const handleMarkerClick = useCallback((location: Location) => {
    setSelectedLocation(location);
  }, []);

  // Center of DRC for initial view
  const [viewState, setViewState] = useState({
    longitude: 23.5,
    latitude: -2.5,
    zoom: 5.5,
  });

  // Mapbox token - should be in env variable
  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXV4NTFiamM2ZjJ6OG9rOXhhN2gifQ.rJcFIG214AriISLbB6B5aw';

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Notre <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Présence</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Un impact local avec une vision globale à travers la RDC
          </p>
        </motion.div>

        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {regions.map((region) => (
            <Button
              key={region}
              variant={selectedRegion === region ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRegion(region)}
            >
              {region === 'all' ? 'Toutes les régions' : region}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {filteredLocations.map((location) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:border-primary/50 ${
                  selectedLocation?.id === location.id ? 'border-primary' : ''
                }`}
                onClick={() => handleMarkerClick(location)}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-5 text-primary" />
                    <CardTitle className="text-xl">{location.name}</CardTitle>
                  </div>
                  <Badge variant="outline">{location.region}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{location.details}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="rounded-lg overflow-hidden border border-border/50 shadow-lg">
          <div className="h-[500px] w-full">
            <Map
              {...viewState}
              onMove={(evt: any) => setViewState(evt.viewState)}
              mapboxAccessToken={MAPBOX_TOKEN}
              mapStyle="mapbox://styles/mapbox/dark-v11"
              style={{ width: '100%', height: '100%' }}
            >
              {filteredLocations.map((location) => (
                <Marker
                  key={location.id}
                  longitude={location.coordinates[0]}
                  latitude={location.coordinates[1]}
                  // @ts-ignore - react-map-gl v8 types issue
                  anchor="bottom"
                  onClick={() => handleMarkerClick(location)}
                >
                  <div className="cursor-pointer">
                    <MapPin className="size-8 text-primary drop-shadow-lg" fill="currentColor" />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                      {location.name}
                    </div>
                  </div>
                </Marker>
              ))}

              {selectedLocation && (
                <Popup
                  longitude={selectedLocation.coordinates[0]}
                  latitude={selectedLocation.coordinates[1]}
                  anchor="bottom"
                  onClose={() => setSelectedLocation(null)}
                  closeButton={false}
                >
                  <Card className="border-0 shadow-none p-0">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{selectedLocation.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6"
                          onClick={() => setSelectedLocation(null)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                      <Badge variant="outline">{selectedLocation.region}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{selectedLocation.details}</p>
                    </CardContent>
                  </Card>
                </Popup>
              )}
            </Map>
          </div>
        </div>
      </div>
    </section>
  );
}

