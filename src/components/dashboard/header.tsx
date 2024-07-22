import { CircleHelp, Bell, CircleUserRound } from "lucide-react"
import { Link, useRouter } from '@tanstack/react-router'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useMutation } from "@tanstack/react-query"
import { logout } from "@/lib/auth"
import { toast } from "@/components/ui/use-toast"
import { removeUser } from "@/store/user.store"
import { removeRegistrationStore } from "@/store/registration.store"
import { removeCompany } from "@/store/company.store"

type Props = {
    title?: {
        icon?: JSX.Element,
        text?: string
    }
}

export function DashboardHeader({ title }: Props) {
    const mutation = useMutation({ mutationFn: logout })
    const router = useRouter();

    const logOut = async () => {
        const response = await mutation.mutateAsync();

        if (response.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: response.error,
            })
        } else if (response.data) {
            const redirectTo = `/login`;
            removeUser();
            removeRegistrationStore();
            removeCompany();
            router.history.push(redirectTo, { replace: true });
        }
    }

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
                        <CircleUserRound size={30} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mr-12 mt-2 p-5 space-y-2">
                        <DropdownMenuItem className="w-full justify-center border border-muted cursor-pointer">
                            Mi Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={logOut}
                            className="w-full justify-center border border-muted cursor-pointer">
                            Cerrar Sesion
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}