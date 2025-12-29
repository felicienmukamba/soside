'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: '1',
    question: 'Quels services propose SOSIDE ?',
    answer: 'SOSIDE offre une gamme complète de services incluant le développement d\'applications web et mobiles, l\'intégration d\'IA et LLM, la biométrie, l\'automatisation de processus, le marketing digital, et des formations professionnelles certifiantes.',
  },
  {
    id: '2',
    question: 'Dans quelles villes SOSIDE est-elle présente ?',
    answer: 'Nous avons une présence active dans 4 villes clés de la RDC : Goma (siège social), Bukavu, Kinshasa, et Mbujimayi. Chaque bureau offre un support local adapté aux besoins régionaux.',
  },
  {
    id: '3',
    question: 'Comment fonctionne le module de formation ?',
    answer: 'Notre plateforme LMS propose des parcours de formation en ligne et présentiel, avec suivi de progression en temps réel et certification à la fin de chaque parcours. Les formations peuvent être financées par les entreprises (B2B) ou suivies individuellement.',
  },
  {
    id: '4',
    question: 'Proposez-vous des solutions pour le secteur public (B2G) ?',
    answer: 'Oui, SOSIDE travaille activement avec les institutions publiques en RDC pour moderniser leurs systèmes informatiques, notamment dans les domaines de la santé, de l\'éducation et de l\'administration.',
  },
  {
    id: '5',
    question: 'Comment puis-je rejoindre la communauté SOSIDE ?',
    answer: 'Vous pouvez rejoindre notre communauté via la plateforme, participer aux événements organisés dans nos différents chapitres locaux, et échanger avec d\'autres membres via notre système de chat en temps réel.',
  },
  {
    id: '6',
    question: 'Quels sont les délais moyens pour un projet ?',
    answer: 'Les délais varient selon la complexité du projet. Un projet web simple peut prendre 2-3 mois, tandis qu\'un système ERP complet peut nécessiter 6-12 mois. Nous fournissons toujours un planning détaillé lors de la phase de consultation.',
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Questions <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Fréquentes</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Trouvez rapidement les réponses à vos questions
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggle(faq.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold pr-8">{faq.question}</h3>
                    <ChevronDown
                      className={cn(
                        'size-5 text-muted-foreground transition-transform shrink-0',
                        openId === faq.id && 'transform rotate-180'
                      )}
                    />
                  </div>
                </CardHeader>
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

