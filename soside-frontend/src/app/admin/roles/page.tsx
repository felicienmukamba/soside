"use client"

import * as React from "react"
import { Shield, ShieldAlert, ShieldCheck, Lock, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const roles = [
    { name: "admin", description: "Accès total à tous les systèmes et services.", userCount: 2, level: "High" },
    { name: "recruiter", description: "Gestion des offres d'emploi et des candidats.", userCount: 5, level: "Medium" },
    { name: "developer", description: "Accès aux outils techniques et monitoring.", userCount: 8, level: "Medium" },
    { name: "student", description: "Accès aux cours et à la communauté.", userCount: 1200, level: "Low" },
]

export default function AdminRolesPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Rôles & Permissions</h1>
                    <p className="text-muted-foreground">Définissez qui peut faire quoi sur la plateforme.</p>
                </div>
                <Button>
                    <UserPlus className="mr-2 size-4" /> Créer un Rôle
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ShieldCheck className="size-5 text-green-600" /> Sécurité
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Activée</div>
                        <p className="text-xs text-muted-foreground">Authentification 2FA requise pour Admin.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Lock className="size-5 text-blue-600" /> RBAC
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">V4.2.0</div>
                        <p className="text-xs text-muted-foreground">Moteur de permissions synchronisé.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ShieldAlert className="size-5 text-amber-600" /> Audits
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0 Alertes</div>
                        <p className="text-xs text-muted-foreground">Aucune violation détectée ce jour.</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Hiérarchie des Rôles</CardTitle>
                    <CardDescription>Visualisez et modifiez les permissions par groupe d'utilisateurs.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom du Rôle</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Niveau de Risque</TableHead>
                                <TableHead className="text-right">Utilisateurs</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map((role) => (
                                <TableRow key={role.name}>
                                    <TableCell className="font-semibold uppercase flex items-center gap-2">
                                        <Shield className="size-4 text-zinc-500" />
                                        {role.name}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{role.description}</TableCell>
                                    <TableCell>
                                        <Badge variant={role.level === 'High' ? 'destructive' : 'secondary'}>
                                            {role.level}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">{role.userCount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
