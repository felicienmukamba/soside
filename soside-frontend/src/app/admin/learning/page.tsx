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
    const [currentCourse, setCurrentCourse] = React.useState<Partial<Course> | null>(null)

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
            // Note: We need to update learningService with create/update/delete as well if not already done
            // For now using alert to simulate
            console.log("Saving course", currentCourse)
            setIsDialogOpen(false)
            setCurrentCourse(null)
            loadCourses()
        } catch (error) {
            console.error("Operation failed", error)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Supprimer cette formation ?")) {
            console.log("Deleting course", id)
            loadCourses()
        }
    }

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
                    <DialogContent>
                        {/* Form content similar to projects but for courses */}
                        <DialogHeader>
                            <DialogTitle>Nouveau Cours</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Titre</Label>
                                <Input id="title" className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setIsDialogOpen(false)}>Enregistrer</Button>
                        </DialogFooter>
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
                                <TableHead>Inscrits</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <BookOpen className="size-4 text-purple-600" />
                                        {course.title}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{course.level}</Badge>
                                    </TableCell>
                                    <TableCell>{course.duration}</TableCell>
                                    <TableCell>0</TableCell>
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
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
