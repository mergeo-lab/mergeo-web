import { CardFooter } from "@/components/card"
import { NewUser } from "@/components/configuration/newUser"
import { RoleDetail } from "@/components/configuration/roleDetail"
import LoadingIndicator from "@/components/loadingIndicator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RoleSchemaType, UserSchemaType } from "@/lib/configuration/schema"
import { getUsers } from "@/lib/configuration/users"
import { colorClasses } from "@/lib/constants"
import { cn, formatDate } from "@/lib/utils"
import UseCompanyStore from "@/store/company.store"
import { AvatarImage } from "@radix-ui/react-avatar"
import { useQuery } from "@tanstack/react-query"
import { Pencil, Trash2 } from "lucide-react"

export function Users() {
    const { company } = UseCompanyStore();

    const { data: usersData, isLoading, isError } = useQuery({
        queryKey: ['users', company?.id],
        queryFn: ({ queryKey }) => {
            const companyId = queryKey[1];
            if (!companyId) {
                // Return a rejected promise if companyId is undefined
                return Promise.reject(new Error('Company ID is undefined'));
            }
            return getUsers(companyId);
        },
        enabled: !!company?.id, // Ensure the query runs only if company ID exists
    });
    const users = usersData && usersData.data || { data: [] };

    const userNameInitials = (username: string) => {
        return username.split(' ').map((n) => n.charAt(0).toUpperCase()).join('')
    }

    if (isError) return <div>Hubo un error</div>;

    return (
        <div className="flex w-full h-full">
            <div className="flex flex-col justify-between w-full">
                <div className="flex gap-20 m-10">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-white">
                                <TableHead className="w-4 p-0 m-0"></TableHead>
                                <TableHead className="">Nombre</TableHead>
                                <TableHead className="">Email</TableHead>
                                <TableHead className="">Estado</TableHead>
                                <TableHead className="">Roles</TableHead>
                                <TableHead className="text-center">Creado</TableHead>
                                <TableHead className="text-center">Editado</TableHead>
                                <TableHead className="w-2"></TableHead>
                                <TableHead className="w-2"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading
                                ? <TableRow>
                                    <TableCell>
                                        <LoadingIndicator />
                                    </TableCell>
                                </TableRow>
                                : users?.data && users?.data.map((user: UserSchemaType) => (
                                    <TableRow key={user.id} className="hover:bg-accent">
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage src="https://github.com/shadcn.png" />
                                                <AvatarFallback>
                                                    {userNameInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-base">
                                            {user.name}
                                        </TableCell>
                                        <TableCell className="">{user.email}</TableCell>
                                        <TableCell className={cn('text-primary', {
                                            'text-highlight': !user.isActive
                                        })}>
                                            {
                                                user.isActive
                                                    ? "ACTIVO"
                                                    : "INACTIVO"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2 items-center">
                                                {user.roles.length ?
                                                    user.roles.map((role: RoleSchemaType, index: number) => (
                                                        <HoverCard key={role.id}>
                                                            <HoverCardTrigger>
                                                                <Badge className={`cursor-pointer ${colorClasses[index]} hover:opacity-70 hover:${colorClasses[index]}`}>{role.name}</Badge>
                                                            </HoverCardTrigger>
                                                            <HoverCardContent className="w-96">
                                                                <div className="flex flex-col">
                                                                    {
                                                                        <RoleDetail role={role} />
                                                                    }
                                                                </div>
                                                            </HoverCardContent>
                                                        </HoverCard>
                                                    )
                                                    )
                                                    : "-"
                                                }
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">{formatDate(user.created)}</TableCell>
                                        <TableCell className="text-center">{formatDate(user.updated)}</TableCell>
                                        <TableCell className="text-right">
                                            <Pencil size={18} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Trash2 size={18} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
                <CardFooter className='w-full'>
                    <div className='flex flex-col-reverse md:flex-row justify-end items-center min-h-20'>
                        <NewUser />
                    </div>
                </CardFooter>
            </div >
        </div >
    )
}