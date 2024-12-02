import { Link, useLocation } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

type Props = {
    to: string;
    children: React.ReactNode;
    activePaths?: string[];
};

function matchDynamicRoute(pathname: string, to: string): boolean {
    if (to.includes('$')) {
        const regex = new RegExp(`^${to.replace(/\$[a-zA-Z]+/g, '[^/]+')}$`);
        return regex.test(pathname);
    }
    return false;
}

export default function SpecialLink({ to, children, activePaths }: Props) {
    const location = useLocation();

    // Check if the link is active
    const isActive =
        location.pathname === to ||
        matchDynamicRoute(location.pathname, to) ||
        (activePaths && activePaths.some((activePath) => location.pathname.startsWith(activePath)));

    return (
        <Link
            to={to}
            className={cn(
                'transition-all duration-300',
                {
                    'text-white bg-gradient-to-r from-primary via-primary to-primary/20 font-bold': isActive,
                }
            )}
        >
            {children}
        </Link>
    );
}
