import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Building, ChevronDown, ChevronRight, ScrollText, Settings, UsersRound, WalletCards, Scale } from "lucide-react";
import { Link } from '@tanstack/react-router';
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import UseUserStore from "@/store/user.store";
import { ACCOUNT } from "@/lib/constants";

type Props = {
    companyName: string
}

export function SideBarMenu({ companyName }: Props) {
    const { user } = UseUserStore();
    const [collapsibleIsOpen, setCollapsibleIsOpen] = useState(false);

    const onCollapsibleChange = (value: boolean) => {
        setCollapsibleIsOpen(value);
    }

    const onLinkClicked = () => {
        setTimeout(() => {
            setCollapsibleIsOpen(!collapsibleIsOpen);
        }, 400);
    }

    return (
        <div className="h-screen min-h-full w-[12%] min-w-52 bg-secondary-background">
            <div className="h-30 w-full flex justify-center items-center p-10">
                <img className='w-auto' src="/mergeo-logo.svg" alt='logo' />
            </div>

            <Collapsible open={!!collapsibleIsOpen} onOpenChange={onCollapsibleChange} className="bg-secondary-foreground py-4 px-4 transition-all">
                <div className="relative flex items-center">
                    <CollapsibleTrigger className="flex items-center text-lg text-secondary-backgroundfont-bold w-full gap-2">
                        <div className="w-10 min-w-10 h-10 flex justify-center items-center bg-primary rounded-full text-secondary-foreground text-lg font-extrabold">
                            {companyName && companyName[0].toUpperCase()}
                        </div>
                        <div className="font-bold text-base text-bg-secondary-background flex items-center gap-1">
                            <span>
                                {companyName && companyName}
                            </span>
                            <ChevronDown size={15} strokeWidth={5} className={cn({ 'rotate-180': collapsibleIsOpen })} />
                        </div>
                    </CollapsibleTrigger>
                    <div className="absolute right-0 hover:multi-[transition-all;rotate-180]">
                        <Link to="/client/configuration" search={{ tab: 'company' }} onMouseEnter={(e) => e.preventDefault()}>
                            <Settings />
                        </Link>
                    </div>
                </div>
                <CollapsibleContent className="CollapsibleContent">
                    <ul className="py-4 pt-6 pl-10 [&>li>*]:multi-[flex;gap-2;] space-y-5 text-secondary-background ">
                        <li>
                            <Link
                                onMouseEnter={(e) => e.preventDefault()}
                                onClick={onLinkClicked}
                                to="/client/configuration"
                                search={{ tab: 'company' }}
                                className="font-light text-default"
                                activeProps={{
                                    className: '!text-primary',
                                }}
                            >
                                <Building strokeWidth={2.5} />
                                Empresa
                            </Link>
                        </li>
                        <li>
                            <Link
                                onMouseEnter={(e) => e.preventDefault()}
                                onClick={onLinkClicked}
                                to="/client/configuration"
                                search={{ tab: 'users' }}
                                className="font-light text-base"
                                activeProps={{
                                    style: {
                                        fontWeight: 'bolder',
                                    },
                                }}>
                                <UsersRound strokeWidth={2.5} />
                                Usuarios
                            </Link>
                        </li>
                    </ul>
                </CollapsibleContent>
            </Collapsible>

            <div className="mt-8">
                <div className="px-5">
                    <Link to="/login" className="w-full">
                        <Button className="w-full text-md">
                            Hacer Pedido
                            <ChevronRight size={20} strokeWidth={3} className="ml-2" />
                        </Button>
                    </Link>
                </div>

                <ul className="py-4 pt-6 text-secondary-foreground [&>li]:multi-[w-full] [&>li>a]:multi-[flex;gap-2;text-sm;w-full;h-10;pl-6;py-6;items-center;] [&>li>a]:hover:multi-['hover:bg-secondary-foreground/20']">
                    {user?.accountType === ACCOUNT.client && (
                        <li>
                            <Link to="/client/searchLists">
                                <ScrollText />
                                Mis Listas
                            </Link>
                        </li>
                    )}
                    <li>
                        <Link to="/login">
                            <WalletCards />
                            Ordenes de Compra
                        </Link>
                    </li>
                    <li>
                        <Link to="/login">
                            <Scale />
                            Compulsas
                        </Link>
                    </li>
                </ul>
            </div >
        </div >
    )
}