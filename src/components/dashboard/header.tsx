import { CircleHelp, Bell, CircleUserRound } from "lucide-react"
import { Link } from '@tanstack/react-router'

type Props = {
    title?: {
        icon?: JSX.Element,
        text?: string
    }
}

export function DashboardHeader({ title }: Props) {
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
                <CircleUserRound size={30} />
            </div>
        </div>
    )
}