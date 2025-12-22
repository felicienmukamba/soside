"use client"

import * as React from "react"
import { Activity, ShieldCheck, Database, HardDrive, Wifi } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const services = [
    { name: "API Gateway", port: 3000, icon: Activity },
    { name: "Auth Service", port: 3001, icon: ShieldCheck },
    { name: "Database (Postgres)", port: 5432, icon: Database },
    { name: "Redis Cache", port: 6379, icon: HardDrive },
    { name: "Learning Service", port: 3003, icon: Wifi },
    { name: "AI Service", port: 3006, icon: Bot },
]

import { Bot } from "lucide-react"

export default function AdminHealthPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Santé du Système</h1>
                <p className="text-muted-foreground">Surveillez l'état des microservices et de l'infrastructure.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {services.map((service) => (
                    <Card key={service.name} className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">
                                {service.name}
                            </CardTitle>
                            <service.icon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-muted-foreground">Port: {service.port}</div>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                    En ligne
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ressources Serveur</CardTitle>
                    <CardDescription>Utilisation en temps réel (Simulation Docker).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>CPU</span>
                            <span>12%</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[12%]" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Mémoire (RAM)</span>
                            <span>1.2 GB / 4 GB</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 w-[30%]" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
