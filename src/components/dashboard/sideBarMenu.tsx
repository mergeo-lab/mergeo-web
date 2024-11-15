import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Building, ChevronDown, ChevronRight, ScrollText, Settings, UsersRound, WalletCards, Scale } from "lucide-react";
import { Link, useNavigate, useRouter, useSearch } from '@tanstack/react-router';
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import UseUserStore from "@/store/user.store";
import { ACCOUNT } from "@/lib/constants";
import UseSearchConfigStore from "@/store/searchConfiguration.store.";

type Props = {
    companyName: string
}

export enum tabs {
    company = "company",
    users = "users"
}

export function SideBarMenu({ companyName }: Props) {
    const { user } = UseUserStore();
    const [collapsibleIsOpen, setCollapsibleIsOpen] = useState(false);
    const search = useSearch({ from: "/_authenticated/_dashboardLayout" });
    const { setConfigDialogOpen, setShouldResetConfig } = UseSearchConfigStore();
    const navigate = useNavigate()

    // Use useCallback to memoize the onCollapsibleChange function
    const onCollapsibleChange = useCallback((value: boolean) => {
        setCollapsibleIsOpen(value);
    }, []);

    const onLinkClicked = () => {
        setTimeout(() => {
            setCollapsibleIsOpen(!collapsibleIsOpen);
        }, 400);
    }

    function handleNewOrder() {
        setShouldResetConfig(true);
        setConfigDialogOpen(true);
        navigate({ to: "/client/orders" });
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
                                search={{ tab: tabs.company }}
                                className={cn("font-light text-default", {
                                    'text-primary': search.tab === tabs.company,
                                })}
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
                                search={{ tab: tabs.users }}
                                className={cn("font-light text-default", {
                                    'text-primary': search.tab === tabs.users,
                                })}
                            >
                                <UsersRound strokeWidth={2.5} />
                                Usuarios
                            </Link>
                        </li>
                    </ul>
                </CollapsibleContent>
            </Collapsible>

            <div className="mt-8">
                {user?.accountType === ACCOUNT.client &&
                    <div className="px-5">
                        <div className="w-full" onClick={handleNewOrder}>
                            <Button className="w-full text-md">
                                Hacer Pedido
                                <ChevronRight size={20} strokeWidth={3} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                }

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