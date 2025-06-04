import { Link, useRouter } from '@tanstack/react-router'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useEffect, JSX } from "react"
import { LuCircleUserRound, LuBell, LuCircleHelp } from "react-icons/lu";
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { tabs } from "@/lib/constants";

type Props = {
    title?: {
        icon?: JSX.Element,
        text?: string | JSX.Element
    }
}

export function DashboardHeader({ title }: Props) {
    const { logout, account } = useAuth();
    const router = useRouter();

    // Memoize the closeSession function to ensure it remains stable
    const closeSession = () => {
        logout();
    };

    useEffect(() => {
        if (!account?.user) {
            const redirectTo = "/login";
            router.history.push(redirectTo, { replace: true });
        }
    }, [account?.user, router.history]);

    const handleProfileClick = () => {
        if (account?.user.accountType === 'client') {
            router.navigate({ to: '/client/configuration', search: { tab: "users" as tabs } });
        } else {
            router.navigate({ to: '/provider/configuration', search: { tab: "users" as tabs } });
        }
    };

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
                        <DropdownMenuItem
                            onClick={handleProfileClick}
                            className="w-full justify-center border border-muted cursor-pointer">
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