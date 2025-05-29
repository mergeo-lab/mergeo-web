import { Link, useRouter } from '@tanstack/react-router'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useMutation } from "@tanstack/react-query"
import { logout } from "@/lib/auth"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks"
import { useEffect, useCallback, JSX } from "react"
import { LuCircleUserRound, LuBell, LuCircleHelp } from "react-icons/lu";
import { Button } from '@/components/ui/button'

type Props = {
    title?: {
        icon?: JSX.Element,
        text?: string | JSX.Element
    }
}

export function DashboardHeader({ title }: Props) {
    const mutation = useMutation({ mutationFn: logout })
    const { logOut, isAuthenticated } = useAuth();
    const router = useRouter();

    // Memoize the closeSession function to ensure it remains stable
    const closeSession = useCallback(async () => {
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
    }, [mutation, logOut]);

    useEffect(() => {
        if (!isAuthenticated) {
            const redirectTo = "/login";
            router.history.push(redirectTo, { replace: true });
        }
    }, [isAuthenticated, router.history]);


    return (
        <div className='h-16 w-full flex items-center justify-between px-5'>
            <div className="flex items-center">
                <div className="mr-2">
                    {title && title.icon && title.icon}
                </div>
                {title && <h1 className='text-md'>{title.text}</h1>}
            </div>
            <div className="h-full flex items-center">
                <Link to="/faq">
                    <Button variant="ghost" className='w-fit h-fit px-2'>
                        <LuCircleHelp size={25} className="text-secondary-background" />
                    </Button>
                </Link>
                <Link to="/notifications">
                    <Button variant="ghost" className='w-fit h-fit px-2'>
                        <LuBell size={25} className="text-secondary-background" />
                    </Button>
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className='w-fit h-fit px-2'>
                            <LuCircleUserRound size={25} className="cursor-pointer text-secondary-background" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mr-11 mt-0 p-5 space-y-2">
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