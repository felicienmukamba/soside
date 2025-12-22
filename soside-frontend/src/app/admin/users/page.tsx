"use client"

import * as React from "react"
import {
    MoreHorizontal,
    Plus,
    Pencil,
    Trash2,
    Shield,
    User as UserIcon,
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
import { userService, User } from "@/services/userService"

export default function adminUsersPage() {
    const [users, setUsers] = React.useState<User[]>([])
    const [loading, setLoading] = React.useState(true)

    const loadUsers = React.useCallback(async () => {
        setLoading(true)
        try {
            const data = await userService.getAll()
            setUsers(data)
        } catch (error) {
            console.error("Failed to load users", error)
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        loadUsers()
    }, [loadUsers])

    const handleUpdateRole = async (id: string, role: string) => {
        try {
            await userService.updateRole(id, role)
            loadUsers()
        } catch (error) {
            console.error("Failed to update role", error)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Supprimer cet utilisateur ?")) {
            try {
                await userService.deleteUser(id)
                loadUsers()
            } catch (error) {
                console.error("Delete failed", error)
            }
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Gestion des Utilisateurs</h1>
                    <p className="text-muted-foreground">
                        Contrôlez les accès, les rôles et les profils des utilisateurs de la plateforme.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un Utilisateur
                </Button>
            </div>

            <Card className="shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Utilisateur</TableHead>
                                <TableHead>Rôle</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                                                <UserIcon className="size-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-zinc-900">
                                                    {user.profile?.firstName} {user.profile?.lastName}
                                                </div>
                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.role === 'admin' ? 'default' : 'outline'}
                                            className={user.role === 'admin' ? 'bg-zinc-900 text-white' : ''}
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.isVerified ? (
                                            <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Vérifié</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">En attente</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Modifier le rôle</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleUpdateRole(user.id, 'admin')}>Administrateur</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleUpdateRole(user.id, 'developer')}>Développeur</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleUpdateRole(user.id, 'student')}>Étudiant</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(user.id)}>
                                                    <Trash2 className="mr-2 size-4" /> Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {users.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground lowercase">
                                        Aucun utilisateur trouvé.
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
