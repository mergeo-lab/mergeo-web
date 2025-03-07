import SpecialLink from '@/components/dashboard/specialLink';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Link, useLocation } from '@tanstack/react-router';
import { Box, ChevronDown, Heart, ScrollText, ThumbsDown } from 'lucide-react';
import { useEffect, useState } from 'react';


type Props = {
    onLinkClicked: () => void
}

export default function CollapsibleList({ onLinkClicked }: Props) {
    const [collapsibleIsOpen, setCollapsibleIsOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState('lists');
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname.split('/');
        setSelectedLink(path[path.length - 1])

        if (!location.pathname.includes('lists')) {
            setCollapsibleIsOpen(false);
        }
    }, [location])

    return (
        <Collapsible open={!!collapsibleIsOpen} className="w-full transition-all">
            <CollapsibleTrigger className='w-full'>
                <div className="w-full text-base flex items-center justify-between gap-1 relative hover:multi-['hover:bg-secondary-foreground/20']" onClick={() => setCollapsibleIsOpen(!collapsibleIsOpen)}>
                    <SpecialLink
                        className="w-full flex items-center gap-2 multi-[flex;gap-2;text-sm;w-full;h-10;pl-6;py-6;items-center;]"
                        to="/client/lists/"
                        onClick={onLinkClicked}
                        activePaths={['/client/lists']}
                    >
                        <ScrollText />
                        Mis Listas
                    </SpecialLink>
                    <ChevronDown size={15} strokeWidth={5} className={cn('absolute right-5', { 'rotate-180': collapsibleIsOpen })} />
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="CollapsibleContent">
                <ul className="py-4 pt-6 pl-10 [&>li>*]:multi-[flex;gap-2] space-y-5 bg-white">
                    <li>
                        <Link
                            onMouseEnter={(e) => e.preventDefault()}
                            to="/client/lists"
                            className={cn('flex items-center text-secondary', {
                                "font-black text-primary": selectedLink === 'lists'
                            })}
                        >
                            <Box size={16} />
                            Productos
                        </Link>
                    </li>
                    <li>
                        <Link
                            onMouseEnter={(e) => e.preventDefault()}
                            to="/client/lists/favorites"
                            className={cn('flex items-center text-secondary', {
                                "font-black text-primary": selectedLink === 'favorites'
                            })}
                        >
                            <Heart size={16} />
                            Favoritos
                        </Link>
                    </li>
                    <li>
                        <Link
                            onMouseEnter={(e) => e.preventDefault()}
                            to="/client/lists/blackList"
                            className={cn('flex items-center text-secondary', {
                                "font-black text-primary": selectedLink === 'blackList'
                            })}                        >
                            <ThumbsDown size={16} />
                            Lista Negra
                        </Link>
                    </li>
                </ul>
            </CollapsibleContent>
        </Collapsible>
    )
}
