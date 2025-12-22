"use client"

import * as React from "react"
import {
    MoreHorizontal,
    Plus,
    Pencil,
    Trash2,
    ExternalLink,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { projectService, Project } from "@/services/projectService"
import { toast } from "sonner" // Assuming sonner or similar is available or I'll use simple alert

export default function adminProjectsPage() {
    const [projects, setProjects] = React.useState<Project[]>([])
    const [loading, setLoading] = React.useState(true)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [currentProject, setCurrentProject] = React.useState<Partial<Project> | null>(null)

    const loadProjects = React.useCallback(async () => {
        setLoading(true)
        try {
            const data = await projectService.getAll()
            setProjects(data)
        } catch (error) {
            console.error("Failed to load projects", error)
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        loadProjects()
    }, [loadProjects])

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentProject?.title) return

        try {
            if (currentProject.id) {
                await projectService.update(currentProject.id, currentProject)
            } else {
                await projectService.create(currentProject as Omit<Project, 'id'>)
            }
            setIsDialogOpen(false)
            setCurrentProject(null)
            loadProjects()
        } catch (error) {
            console.error("Operation failed", error)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
            try {
                await projectService.delete(id)
                loadProjects()
            } catch (error) {
                console.error("Delete failed", error)
            }
        }
    }

    const openEditDialog = (project: Project) => {
        setCurrentProject(project)
        setIsDialogOpen(true)
    }

    const openCreateDialog = () => {
        setCurrentProject({
            title: "",
            description: "",
            category: "",
            techStack: [],
            imageUrl: "",
            status: "completed"
        })
        setIsDialogOpen(true)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Gestion des Projets</h1>
                    <p className="text-muted-foreground">
                        Visualisez et gérez les projets technologiques de SOSIDE.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreateDialog}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouveau Projet
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleCreateOrUpdate}>
                            <DialogHeader>
                                <DialogTitle>{currentProject?.id ? 'Modifier le Projet' : 'Nouveau Projet'}</DialogTitle>
                                <DialogDescription>
                                    Remplissez les détails ci-dessous pour {currentProject?.id ? 'mettre à jour' : 'créer'} un projet.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">Titre</Label>
                                    <Input
                                        id="title"
                                        className="col-span-3"
                                        value={currentProject?.title || ""}
                                        onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="category" className="text-right">Catégorie</Label>
                                    <Input
                                        id="category"
                                        className="col-span-3"
                                        value={currentProject?.category || ""}
                                        onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="region" className="text-right">Région</Label>
                                    <Input
                                        id="region"
                                        className="col-span-3"
                                        value={currentProject?.status || ""}
                                        onChange={(e) => setCurrentProject({ ...currentProject, status: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">Description</Label>
                                    <Input
                                        id="description"
                                        className="col-span-3"
                                        value={currentProject?.description || ""}
                                        onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">{currentProject?.id ? 'Mettre à jour' : 'Créer'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Liste des Projets</CardTitle>
                    <CardDescription>
                        {projects.length} projet(s) trouvé(s) dans le système.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="py-10 text-center text-muted-foreground italic">Chargement...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[300px]">Titre</TableHead>
                                    <TableHead>Catégorie</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Région</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map((project) => (
                                    <TableRow key={project.id} className="hover:bg-zinc-50 border-zinc-100">
                                        <TableCell className="font-medium text-zinc-900">{project.title}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs uppercase bg-muted/30">
                                                {project.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={project.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200'}>
                                                {project.status === 'completed' ? 'Terminé' : 'En cours'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{project.location?.city || "Non spécifié"}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[160px]">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => openEditDialog(project)}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Modifier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <a href={`/projects/${project.id}`} target="_blank">
                                                            <ExternalLink className="mr-2 h-4 w-4" /> Voir public
                                                        </a>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => handleDelete(project.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {projects.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            Aucun projet trouvé.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
