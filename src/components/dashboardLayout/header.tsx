import { CircleHelp, Bell, CircleUserRound } from "lucide-react"
import { Link, useRouter } from '@tanstack/react-router'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useMutation } from "@tanstack/react-query"
import { logout } from "@/lib/auth"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks"
import { useEffect, useCallback, memo } from "react"

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

    // Memoize individual DropdownMenuItems to prevent unnecessary re-renders
    const MemoizedProfileItem = memo(() => (
        <DropdownMenuItem className="w-full justify-center border border-muted cursor-pointer">
            Mi Perfil
        </DropdownMenuItem>
    ));

    const MemoizedLogoutItem = memo(() => (
        <DropdownMenuItem
            onClick={closeSession}
            className="w-full justify-center border border-muted cursor-pointer">
            Cerrar Sesion
        </DropdownMenuItem>
    ));

    return (
        <div className='h-24 w-full flex items-center justify-between px-5'>
            <div className="flex items-center">
                <div className="mr-2">
                    {title && title.icon && title.icon}
                </div>
                {title && <h1 className='text-md'>{title.text}</h1>}
            </div>
            <div className="h-full flex items-center gap-6">
                <Link to="/faq">
                    <CircleHelp size={25} className="text-secondary-background" />
                </Link>
                <Link to="/notifications">
                    <Bell size={25} className="text-secondary-background" />
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <CircleUserRound size={25} className="cursor-pointer text-secondary-background" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mr-12 mt-2 p-5 space-y-2">
                        <MemoizedProfileItem />
                        <MemoizedLogoutItem />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}