import SpecialLink from '@/components/dashboardLayout/specialLink';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Link, useLocation } from '@tanstack/react-router';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';


type Props = {
    name: string,
    mainButton: {
        label: string,
        icon: React.ReactNode,
        link: string,
        activePaths: string[]
        onClick: () => void,
    }
    links: {
        label: string,
        icon: React.ReactNode,
        to: string,
        activepathName: string,
    }[]
}

export default function CollapsibleList({ name, mainButton, links }: Props) {
    const [collapsibleIsOpen, setCollapsibleIsOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState(name);
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname.split('/');
        setSelectedLink(path[path.length - 1])

        if (!location.pathname.includes(name)) {
            setCollapsibleIsOpen(false);
        }
    }, [location, name])

    return (
        <Collapsible open={!!collapsibleIsOpen} className="w-full transition-all">
            <CollapsibleTrigger className='w-full'>
                <div className="w-full text-base flex items-center justify-between gap-1 relative hover:multi-['hover:bg-secondary-foreground/20']" onClick={() => setCollapsibleIsOpen(!collapsibleIsOpen)}>
                    <SpecialLink
                        className="w-full flex items-center gap-2 multi-[flex;gap-2;text-sm;w-full;h-10;pl-6;py-6;items-center;]"
                        to={mainButton.link}
                        onClick={mainButton.onClick}
                        activePaths={mainButton.activePaths}
                    >
                        {mainButton.icon}
                        {mainButton.label}
                    </SpecialLink>
                    <ChevronDown size={15} strokeWidth={5} className={cn('absolute right-5', { 'rotate-180': collapsibleIsOpen })} />
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="CollapsibleContent">
                <ul className="py-4 pt-6 pl-10 [&>li>*]:multi-[flex;gap-2] space-y-5 bg-white">
                    {
                        links.map((link, index) => (
                            <li key={index}>
                                <Link
                                    onMouseEnter={(e) => e.preventDefault()}
                                    to={link.to}
                                    className={cn('flex items-center text-secondary text-sm hover:text-primary', {
                                        "font-black text-primary cursor-default": selectedLink === link.activepathName
                                    })}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </CollapsibleContent>
        </Collapsible>
    )
}
