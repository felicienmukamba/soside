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

export default function adminBlogPage() {
    const [posts, setPosts] = React.useState<BlogPost[]>([])
    const [loading, setLoading] = React.useState(true)

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

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Gestion du Blog</h1>
                    <p className="text-muted-foreground">
                        Éditez et publiez des articles techniques pour la communauté.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvel Article
                </Button>
            </div>

            <Card className="shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Titre</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.map((post: any) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <FileText className="size-4 text-blue-600" />
                                        {post.title}
                                    </TableCell>
                                    <TableCell>{post.category}</TableCell>
                                    <TableCell>
                                        <Badge variant={post.isPublished ? "default" : "secondary"} className={post.isPublished ? "bg-green-100 text-green-700 border-green-200" : ""}>
                                            {post.isPublished ? "Publié" : "Brouillon"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Pencil className="mr-2 size-4" /> Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 size-4" /> Prévisualiser
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">
                                                    <Trash2 className="mr-2 size-4" /> Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
