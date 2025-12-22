"use client"

import * as React from "react"
import {
    MoreHorizontal,
    Plus,
    Pencil,
    Trash2,
    Briefcase,
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { recruitmentService, JobOffer } from "@/services/recruitmentService"

export default function adminRecruitmentPage() {
    const [jobs, setJobs] = React.useState<JobOffer[]>([])
    const [loading, setLoading] = React.useState(true)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [currentJob, setCurrentJob] = React.useState<Partial<JobOffer>>({})

    const loadJobs = React.useCallback(async () => {
        setLoading(true)
        try {
            const data = await recruitmentService.getJobs()
            setJobs(data)
        } catch (error) {
            console.error("Failed to load jobs", error)
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        loadJobs()
    }, [loadJobs])

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentJob?.title) return

        try {
            if (currentJob.id) {
                await recruitmentService.updateJob(currentJob.id, currentJob)
            } else {
                await recruitmentService.createJob(currentJob as any)
            }
            setIsDialogOpen(false)
            setCurrentJob({})
            loadJobs()
        } catch (error) {
            console.error("Operation failed", error)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Supprimer cette offre ?")) {
            try {
                await recruitmentService.deleteJob(id)
                loadJobs()
            } catch (error) {
                console.error("Delete failed", error)
            }
        }
    }

    const jobTypes = ["Full-time", "Contract", "Remote"]
    const categories = ["Ingénierie", "Design", "Produit", "Marketing"]

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Gestion du Recrutement</h1>
                    <p className="text-muted-foreground">
                        Publiez des offres d'emploi et gérez les candidatures entrantes.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { setCurrentJob({}); setIsDialogOpen(true); }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouvelle Offre
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{currentJob?.id ? "Modifier l'Offre" : "Nouvelle Offre"}</DialogTitle>
                            <DialogDescription>
                                Créez une nouvelle opportunité pour attirer des talents.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateOrUpdate} className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Titre du Poste</Label>
                                    <Input
                                        id="title"
                                        value={currentJob?.title || ""}
                                        onChange={(e) => setCurrentJob({ ...currentJob, title: e.target.value })}
                                        placeholder="Ex: Senior Backend Developer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Lieu</Label>
                                    <Input
                                        id="location"
                                        value={currentJob?.location || ""}
                                        onChange={(e) => setCurrentJob({ ...currentJob, location: e.target.value })}
                                        placeholder="Ex: Goma (RDC) ou Distant"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type de Contrat</Label>
                                    <select
                                        id="type"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={currentJob?.type || ""}
                                        onChange={(e) => setCurrentJob({ ...currentJob, type: e.target.value as any })}
                                    >
                                        <option value="">Sélectionner</option>
                                        {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Catégorie</Label>
                                    <select
                                        id="category"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={currentJob?.category || ""}
                                        onChange={(e) => setCurrentJob({ ...currentJob, category: e.target.value })}
                                    >
                                        <option value="">Sélectionner</option>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description et Pré-requis</Label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={currentJob?.description || ""}
                                    onChange={(e) => setCurrentJob({ ...currentJob, description: e.target.value })}
                                    placeholder="Détaillez les responsabilités et les compétences attendues..."
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
                                <TableHead>Titre du Poste</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Lieu</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">Chargement...</TableCell>
                                </TableRow>
                            ) : jobs.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Briefcase className="size-4 text-emerald-600" />
                                        {job.title}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{job.type}</Badge>
                                    </TableCell>
                                    <TableCell>{job.location}</TableCell>
                                    <TableCell>{job.category}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setCurrentJob(job); setIsDialogOpen(true); }}>
                                                    <Pencil className="mr-2 size-4" /> Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(job.id)}>
                                                    <Trash2 className="mr-2 size-4" /> Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && jobs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground lowercase">
                                        Aucune offre trouvée.
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
