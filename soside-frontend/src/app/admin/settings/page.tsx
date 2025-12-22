"use client"

import * as React from "react"
import { Settings, Globe, Bell, Palette, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminSettingsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Paramètres du Système</h1>
                <p className="text-muted-foreground">Configurez les options globales de la plateforme SOSIDE.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="general" className="gap-2"><Globe className="size-4" /> Général</TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2"><Bell className="size-4" /> Notifications</TabsTrigger>
                    <TabsTrigger value="appearance" className="gap-2"><Palette className="size-4" /> Apparence</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations Générales</CardTitle>
                            <CardDescription>Nom de la plateforme et URLs de base.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="siteName">Nom du Site</Label>
                                <Input id="siteName" defaultValue="SOSIDE APPLICATION" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="contactEmail">Email de Contact</Label>
                                <Input id="contactEmail" defaultValue="contact@soside.io" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="gap-2"><Save className="size-4" /> Enregistrer</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Canaux de Notification</CardTitle>
                            <CardDescription>Gérez l'envoi des emails et alertes push.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground italic">Configuration SMTP & Push en attente.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
