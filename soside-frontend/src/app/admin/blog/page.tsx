"use client"

import * as React from "react"
import {
    MoreHorizontal,
    Plus,
    Pencil,
    Trash2,
    FileText,
    Eye,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { blogService, BlogPost } from "@/services/blogService"
import { DialogFooter, DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Input } from "@/components/ui/input"

export default function adminBlogPage() {
    const [posts, setPosts] = React.useState<BlogPost[]>([])
    const [loading, setLoading] = React.useState(true)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [currentPost, setCurrentPost] = React.useState<Partial<BlogPost>>({})

    const loadPosts = React.useCallback(async () => {
        setLoading(true)
        try {
            const data = await blogService.getPosts()
            setPosts(data)
        } catch (error) {
            console.error("Failed to load posts", error)
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        loadPosts()
    }, [loadPosts])

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentPost?.title) return

        try {
            if (currentPost.id) {
                await blogService.updatePost(currentPost.id, currentPost)
            } else {
                await blogService.createPost(currentPost)
            }
            setIsDialogOpen(false)
            setCurrentPost({})
            loadPosts()
        } catch (error) {
            console.error("Operation failed", error)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Supprimer cet article ?")) {
            try {
                await blogService.deletePost(id)
                loadPosts()
            } catch (error) {
                console.error("Delete failed", error)
            }
        }
    }

    const categories = ["Actualités", "Tutoriels", "Carrière", "Technologie"]

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Gestion du Blog</h1>
                    <p className="text-muted-foreground">
                        Éditez et publiez des articles techniques pour la communauté.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { setCurrentPost({}); setIsDialogOpen(true); }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouvel Article
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>{currentPost?.id ? "Modifier l'Article" : "Nouvel Article"}</DialogTitle>
                            <DialogDescription>
                                Rédigez et publiez du contenu de qualité pour vos lecteurs.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateOrUpdate} className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label >Titre</Label>
                                    <Input
                                        id="title"
                                        value={currentPost?.title || ""}
                                        onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                                        placeholder="Ex: Les nouveautés de TypeScript 5.0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Catégorie</Label>
                                    <select
                                        id="category"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={currentPost?.category || ""}
                                        onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                                    >
                                        <option value="">Sélectionner</option>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Résumé (SEO)</Label>
                                <Input
                                    id="summary"
                                    value={currentPost?.summary || ""}
                                    onChange={(e) => setCurrentPost({ ...currentPost, summary: e.target.value })}
                                    placeholder="Une brève description pour les réseaux sociaux..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Contenu (Markdown supporté)</Label>
                                <textarea
                                    id="content"
                                    className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={currentPost?.content || ""}
                                    onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                                    placeholder="Écrivez votre article ici..."
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Enregistrer</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Titre</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">Chargement...</TableCell>
                                </TableRow>
                            ) : posts.map((post: any) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <FileText className="size-4 text-blue-600" />
                                        {post.title}
                                    </TableCell>
                                    <TableCell>{post.category}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Non publié'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setCurrentPost(post); setIsDialogOpen(true); }}>
                                                    <Pencil className="mr-2 size-4" /> Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 size-4" /> Prévisualiser
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(post.id)}>
                                                    <Trash2 className="mr-2 size-4" /> Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && posts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground lowercase">
                                        Aucun article trouvé.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
