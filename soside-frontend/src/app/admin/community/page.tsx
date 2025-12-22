"use client"

import * as React from "react"
import {
    MoreHorizontal,
    Plus,
    Pencil,
    Trash2,
    Users,
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
import { communityService, Chapter } from "@/services/communityService"

export default function adminCommunityPage() {
    const [chapters, setChapters] = React.useState<Chapter[]>([])
    const [loading, setLoading] = React.useState(true)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [currentChapter, setCurrentChapter] = React.useState<Partial<Chapter>>({})

    const loadChapters = React.useCallback(async () => {
        setLoading(true)
        try {
            const data = await communityService.getChapters()
            setChapters(data)
        } catch (error) {
            console.error("Failed to load chapters", error)
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        loadChapters()
    }, [loadChapters])

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentChapter?.name) return

        try {
            if (currentChapter.id) {
                await communityService.updateChapter(currentChapter.id, currentChapter)
            } else {
                await communityService.createChapter(currentChapter as any)
            }
            setIsDialogOpen(false)
            setCurrentChapter({})
            loadChapters()
        } catch (error) {
            console.error("Operation failed", error)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Supprimer ce chapitre ?")) {
            try {
                await communityService.deleteChapter(id)
                loadChapters()
            } catch (error) {
                console.error("Delete failed", error)
            }
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Gestion de la Communauté</h1>
                    <p className="text-muted-foreground">
                        Pilotez les chapitres régionaux et les événements communautaires.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { setCurrentChapter({}); setIsDialogOpen(true); }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouveau Chapitre
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{currentChapter?.id ? "Modifier le Chapitre" : "Nouveau Chapitre"}</DialogTitle>
                            <DialogDescription>
                                Créez ou modifiez un chapitre régional de la communauté.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateOrUpdate} className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom du Chapitre</Label>
                                <Input
                                    id="name"
                                    value={currentChapter?.name || ""}
                                    onChange={(e) => setCurrentChapter({ ...currentChapter, name: e.target.value })}
                                    placeholder="Ex: SOSIDE Goma"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">Ville</Label>
                                <Input
                                    id="city"
                                    value={currentChapter?.city || ""}
                                    onChange={(e) => setCurrentChapter({ ...currentChapter, city: e.target.value })}
                                    placeholder="Ex: Goma"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={currentChapter?.description || ""}
                                    onChange={(e) => setCurrentChapter({ ...currentChapter, description: e.target.value })}
                                    placeholder="Brève description du chapitre..."
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
                                <TableHead>Nom du Chapitre</TableHead>
                                <TableHead>Ville</TableHead>
                                <TableHead>Membres</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">Chargement...</TableCell>
                                </TableRow>
                            ) : chapters.map((chapter) => (
                                <TableRow key={chapter.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Users className="size-4 text-orange-600" />
                                        {chapter.name}
                                    </TableCell>
                                    <TableCell>{chapter.city}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{chapter.memberCount} membres</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setCurrentChapter(chapter); setIsDialogOpen(true); }}>
                                                    <Pencil className="mr-2 size-4" /> Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(chapter.id)}>
                                                    <Trash2 className="mr-2 size-4" /> Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && chapters.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground lowercase">
                                        Aucun chapitre trouvé.
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
