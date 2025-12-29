'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image?: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Jean Kabila',
    role: 'Directeur IT',
    company: 'Ministère de la Santé',
    content: 'SOSIDE a transformé notre système de gestion hospitalière. Leur expertise en IA et automatisation a considérablement amélioré notre efficacité opérationnelle.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Marie Mukamba',
    role: 'CEO',
    company: 'TechStart RDC',
    content: 'La formation dispensée par SOSIDE a permis à nos équipes de maîtriser les dernières technologies. Un investissement qui a porté ses fruits.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Paul Mwanza',
    role: 'CTO',
    company: 'Digital Solutions Kinshasa',
    content: 'Leur approche modulaire et leur support local à Kinshasa ont fait toute la différence. Des professionnels de confiance.',
    rating: 5,
  },
];

export default function Testimonials() {
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
            Ce que disent nos <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Clients</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Des témoignages authentiques de nos partenaires et clients
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} • {testimonial.company}
                      </p>
                      <div className="flex gap-1 mt-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Quote className="size-6 text-primary/50 mb-3" />
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

