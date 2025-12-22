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

const stats = [
    {
        title: "Projets Actifs",
        value: "12",
        description: "+2 ce mois-ci",
        icon: Briefcase,
        color: "text-blue-600",
    },
    {
        title: "Étudiants",
        value: "1,234",
        description: "+18% vs mois dernier",
        icon: Users,
        color: "text-green-600",
    },
    {
        title: "Formations",
        value: "24",
        description: "4 nouvelles ce mois",
        icon: BookOpen,
        color: "text-purple-600",
    },
    {
        title: "Revenu (Est.)",
        value: "$15.4k",
        description: "+12.5% vs mois dernier",
        icon: DollarSign,
        color: "text-emerald-600",
    },
]

export default function AdminDashboard() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
                <p className="text-muted-foreground">
                    Bienvenue sur l'administration globale de SOSIDE.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
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
