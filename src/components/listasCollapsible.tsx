import SpecialLink from '@/components/dashboard/specialLink';
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { ChevronDown, ScrollText } from 'lucide-react';
import { useState } from 'react';


type Props = {
    onLinkClicked: () => void
}

export default function CollapsibleList({ onLinkClicked }: Props) {
    const [collapsibleIsOpen, setCollapsibleIsOpen] = useState(false);

    const onCollapsibleChange = (value: boolean) => {
        setCollapsibleIsOpen(value);
    }

    return (
        <Collapsible open={!!collapsibleIsOpen} onOpenChange={onCollapsibleChange} className="w-full transition-all hover:multi-['hover:bg-secondary-foreground/20']">
            <CollapsibleTrigger className='w-full'>
                <div className="w-full text-base flex items-center justify-between gap-1 relative">
                    <SpecialLink
                        className="w-full flex items-center gap-2 multi-[flex;gap-2;text-sm;w-full;h-10;pl-6;py-6;items-center;]"
                        to="/client/searchLists"
                        onClick={onLinkClicked}
                    >
                        <ScrollText />
                        Mis Listas
                    </SpecialLink>
                    <ChevronDown size={15} strokeWidth={5} className={cn('absolute right-5', { 'rotate-180': collapsibleIsOpen })} />
                </div>
            </CollapsibleTrigger>
        </Collapsible>
    )
}
