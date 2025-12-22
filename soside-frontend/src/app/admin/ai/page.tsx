"use client"

import * as React from "react"
import { Bot, Terminal, Send, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { aiService, AILog } from "@/services/aiService"

export default function AdminAIPage() {
    const [logs, setLogs] = React.useState<AILog[]>([])
    const [prompt, setPrompt] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    const fetchLogs = React.useCallback(async () => {
        try {
            const data = await aiService.getLogs()
            setLogs(data)
        } catch (e) {
            console.error(e)
        }
    }, [])

    React.useEffect(() => {
        fetchLogs()
    }, [fetchLogs])

    const handleTest = async () => {
        if (!prompt) return
        setLoading(true)
        try {
            await aiService.sendPrompt(prompt)
            setPrompt("")
            fetchLogs()
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Intelligence Artificielle</h1>
                <p className="text-muted-foreground">Gérez les prompts et surveillez les workflows automatisés.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Terminal className="size-5" /> Testeur de Prompt
                        </CardTitle>
                        <CardDescription>Envoyez un prompt pour tester la réponse du service AI.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Entrez votre prompt ici..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <Button onClick={handleTest} disabled={loading} className="w-full">
                            {loading ? <RefreshCw className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}
                            Tester le Prompt
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="size-5" /> État du Service
                        </CardTitle>
                        <CardDescription>Informations sur le modèle et l'utilisation.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Modèle Actif :</span>
                                <span className="font-medium">GPT-4 / Custom LLM</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Prompts Totaux :</span>
                                <span className="font-medium">{logs.length}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Logs d'Activité</CardTitle>
                    <CardDescription>Historique des interactions avec le service AI.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Prompt</TableHead>
                                <TableHead>Réponse</TableHead>
                                <TableHead className="text-right">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="max-w-[200px] truncate">{log.prompt}</TableCell>
                                    <TableCell className="max-w-[300px] truncate text-muted-foreground italic">
                                        {log.response}
                                    </TableCell>
                                    <TableCell className="text-right text-xs text-muted-foreground">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {logs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                        Aucun log trouvé.
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
