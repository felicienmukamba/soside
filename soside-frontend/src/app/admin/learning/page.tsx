"use client"

import * as React from "react"
import {
    MoreHorizontal,
    Plus,
    Pencil,
    Trash2,
    BookOpen,
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
import { learningService, Course } from "@/services/learningService"

export default function adminLearningPage() {
    const [courses, setCourses] = React.useState<Course[]>([])
    const [loading, setLoading] = React.useState(true)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [currentCourse, setCurrentCourse] = React.useState<Partial<Course>>({})

    const loadCourses = React.useCallback(async () => {
        setLoading(true)
        try {
            const data = await learningService.getAllCourses()
            setCourses(data)
        } catch (error) {
            console.error("Failed to load courses", error)
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        loadCourses()
    }, [loadCourses])

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentCourse?.title) return

        try {
            if (currentCourse.id) {
                await learningService.updateCourse(currentCourse.id, currentCourse)
            } else {
                await learningService.createCourse(currentCourse as any)
            }
            setIsDialogOpen(false)
            setCurrentCourse({})
            loadCourses()
        } catch (error) {
            console.error("Operation failed", error)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Supprimer cette formation ?")) {
            try {
                await learningService.deleteCourse(id)
                loadCourses()
            } catch (error) {
                console.error("Delete failed", error)
            }
        }
    }

    const levels = ["Débutant", "Intermédiaire", "Avancé", "Expert"]
    const categories = ["Développement", "Design", "Business", "Marketing"]

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Catalogue des Formations</h1>
                    <p className="text-muted-foreground">
                        Gérez les cours, les modules et les leçons de la plateforme LMS.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { setCurrentCourse({}); setIsDialogOpen(true); }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouveau Cours
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{currentCourse?.id ? "Modifier le Cours" : "Nouveau Cours"}</DialogTitle>
                            <DialogDescription>
                                Remplissez les informations ci-dessous pour gérer votre formation.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateOrUpdate} className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Titre</Label>
                                    <Input
                                        id="title"
                                        value={currentCourse?.title || ""}
                                        onChange={(e) => setCurrentCourse({ ...currentCourse, title: e.target.value })}
                                        placeholder="Ex: Formation Next.js Avancé"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Durée</Label>
                                    <Input
                                        id="duration"
                                        value={currentCourse?.duration || ""}
                                        onChange={(e) => setCurrentCourse({ ...currentCourse, duration: e.target.value })}
                                        placeholder="Ex: 8 heures"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="level">Niveau</Label>
                                    <select
                                        id="level"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={currentCourse?.level || ""}
                                        onChange={(e) => setCurrentCourse({ ...currentCourse, level: e.target.value })}
                                    >
                                        <option value="">Sélectionner</option>
                                        {levels.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Catégorie</Label>
                                    <select
                                        id="category"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={currentCourse?.category || ""}
                                        onChange={(e) => setCurrentCourse({ ...currentCourse, category: e.target.value })}
                                    >
                                        <option value="">Sélectionner</option>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={currentCourse?.description || ""}
                                    onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })}
                                    placeholder="Décrivez le contenu du cours..."
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
                                <TableHead>Titre du cours</TableHead>
                                <TableHead>Niveau</TableHead>
                                <TableHead>Durée</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">Chargement...</TableCell>
                                </TableRow>
                            ) : courses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <BookOpen className="size-4 text-purple-600" />
                                        {course.title}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{course.level}</Badge>
                                    </TableCell>
                                    <TableCell>{course.duration}</TableCell>
                                    <TableCell>{course.category}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setCurrentCourse(course); setIsDialogOpen(true); }}>
                                                    <Pencil className="mr-2 size-4" /> Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(course.id)}>
                                                    <Trash2 className="mr-2 size-4" /> Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && courses.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground lowercase">
                                        Aucun cours trouvé.
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
