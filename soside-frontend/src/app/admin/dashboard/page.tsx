"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Briefcase,
    Users,
    BookOpen,
    DollarSign,
    TrendingUp,
} from "lucide-react"

import { statsService, DashboardStats } from "@/services/statsService"
import * as React from "react"

export default function AdminDashboard() {
    const [statsData, setStatsData] = React.useState<DashboardStats | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchStats = async () => {
            const data = await statsService.getDashboardStats()
            setStatsData(data)
            setLoading(false)
        }
        fetchStats()
    }, [])

    const statCards = [
        {
            title: "Projets Actifs",
            value: statsData?.activeProjects.toString() || "0",
            description: "+2 ce mois-ci",
            icon: Briefcase,
            color: "text-blue-600",
        },
        {
            title: "Étudiants",
            value: statsData?.totalStudents.toLocaleString() || "0",
            description: "+18% vs mois dernier",
            icon: Users,
            color: "text-green-600",
        },
        {
            title: "Formations",
            value: statsData?.totalCourses.toString() || "0",
            description: "4 nouvelles ce mois",
            icon: BookOpen,
            color: "text-purple-600",
        },
        {
            title: "Offres d'Emploi",
            value: statsData?.jobOffers.toString() || "0",
            description: "Opportunités SOSIDE",
            icon: DollarSign,
            color: "text-emerald-600",
        },
    ]

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
                <p className="text-muted-foreground">
                    Bienvenue sur l'administration globale de SOSIDE.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-zinc-900">
                                {loading ? "..." : stat.value}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle>Vue d'ensemble</CardTitle>
                        <CardDescription>
                            Progression mensuelle des projets et inscriptions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center border-t bg-muted/20">
                        <div className="text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="size-4" />
                            Graphique en attente de données
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle>Activités Récentes</CardTitle>
                        <CardDescription>
                            Dernières actions sur la plateforme.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                                        U{i}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Nouveau projet créé: "Solution CRM-DRC"
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Il y a {i * 10} minutes par Admin
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
