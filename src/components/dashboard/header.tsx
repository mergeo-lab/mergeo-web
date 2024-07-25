import { CircleHelp, Bell, CircleUserRound } from "lucide-react"
import { Link, useRouter } from '@tanstack/react-router'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useMutation } from "@tanstack/react-query"
import { logout } from "@/lib/auth"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks"
import { useEffect } from "react"

type Props = {
    title?: {
        icon?: JSX.Element,
        text?: string
    }
}

export function DashboardHeader({ title }: Props) {
    const mutation = useMutation({ mutationFn: logout })
    const { logOut, isAuthenticated } = useAuth();
    const router = useRouter();

    const closeSession = async () => {
        const response = await mutation.mutateAsync();

        if (response.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: response.error,
            })
        } else if (response.data) {
            logOut();
        }
    }

    useEffect(() => {
        if (!isAuthenticated) {
            const redirectTo = "/login";
            router.history.push(redirectTo, { replace: true });
        }
    }, [isAuthenticated, router.history]);

    return (
        <div className='h-24 w-full flex items-center justify-between px-5'>
            <div className="flex items-center">

                <div className="mr-2">
                    {title && title.icon && title.icon}
                </div>
                {title && <h1 className='text-2xl'>{title.text}</h1>}
            </div>
            <div className="h-full flex items-center gap-6">
                <Link to="/faq">
                    <CircleHelp size={30} />
                </Link>
                <Link to="/notifications">
                    <Bell size={30} />
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <CircleUserRound size={30} className="cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mr-12 mt-2 p-5 space-y-2">
                        <DropdownMenuItem className="w-full justify-center border border-muted cursor-pointer">
                            Mi Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={closeSession}
                            className="w-full justify-center border border-muted cursor-pointer">
                            Cerrar Sesion
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}