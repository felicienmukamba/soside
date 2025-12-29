'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { blogService, BlogPost } from '@/services/blogService';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await blogService.getPost(params.id as string);
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
          <Button asChild>
            <Link href="/blog">Retour au blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Retour au blog
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      {post.coverImage && (
        <div className="relative h-[400px] w-full overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge variant="secondary">{post.category}</Badge>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="size-4" />
              {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            {(post.author || post.authorName) && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <User className="size-4" />
                {post.author || post.authorName}
              </div>
            )}
            {post.readTime && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Clock className="size-4" />
                {post.readTime} min de lecture
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {post.title}
          </h1>

          {/* Summary */}
          {post.summary && (
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.summary}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Markdown Content */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              {post.content ? (
                <MarkdownRenderer content={post.content} />
              ) : (
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground">
                    Le contenu de cet article sera bientôt disponible.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </article>
  );
}

