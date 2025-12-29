'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Code, Cpu, LineChart, Users, Zap, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const services = [
  {
    icon: Code,
    title: "Développement d'Apps",
    description: "Web, Mobile et Solutions ERP sur mesure pour booster votre productivité.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Cpu,
    title: "Intelligence Artificielle",
    description: "Intégration de LLMs et biométrie pour des systèmes intelligents et sécurisés.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Automatisation",
    description: "Optimisez vos workflows complexes avec nos solutions d'automatisation intelligente.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: LineChart,
    title: "Marketing Digital",
    description: "Stratégies axées sur les données pour accroître votre visibilité et vos revenus.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Users,
    title: "Formation Pro",
    description: "Certification tech et parcours financés pour vos équipes et talents.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Globe,
    title: "Présence Régionale",
    description: "Support local fort à Goma, Bukavu, Kinshasa et Mbujimayi.",
    gradient: "from-teal-500 to-cyan-500",
  },
];

export default function ServicesImproved() {
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
            Nos <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Une expertise multidimensionnelle pour répondre aux défis de demain.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all hover:shadow-lg group">
                  <CardHeader>
                    <div className={cn(
                      "size-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                      service.gradient
                    )}>
                      <Icon className="size-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

