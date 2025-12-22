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
import { recruitmentService, JobOffer } from "@/services/recruitmentService"

export default function adminRecruitmentPage() {
    const [jobs, setJobs] = React.useState<JobOffer[]>([])
    const [loading, setLoading] = React.useState(true)

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

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Gestion du Recrutement</h1>
                    <p className="text-muted-foreground">
                        Publiez des offres d'emploi et gérez les candidatures entrantes.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle Offre
                </Button>
            </div>

            <Card className="shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Titre du Poste</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Lieu</TableHead>
                                <TableHead>Candidatures</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {jobs.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Briefcase className="size-4 text-emerald-600" />
                                        {job.title}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{job.type}</Badge>
                                    </TableCell>
                                    <TableCell>{job.location}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Users className="size-3" />
                                            0
                                        </div>
                                    </TableCell>
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
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">
                                                    <Trash2 className="mr-2 size-4" /> Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {jobs.length === 0 && !loading && (
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
