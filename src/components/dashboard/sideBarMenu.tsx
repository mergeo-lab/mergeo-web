import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Building, ChevronDown, Settings, UsersRound, WalletCards, Scale, Archive, Package } from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import UseUserStore from "@/store/user.store";
import { ACCOUNT, tabs } from "@/lib/constants";
import NewOrderButton from "@/components/dashboard/newOrderButton";
import SpecialLink from "@/components/dashboard/specialLink";
import { Link, useLocation, useSearch } from "@tanstack/react-router";
import CollapsibleList from "@/components/listasCollapsible";

type Props = {
    companyName: string
}

export function SideBarMenu({ companyName }: Props) {
    const { user } = UseUserStore();
    const [collapsibleIsOpen, setCollapsibleIsOpen] = useState(false);
    const search = useSearch({ from: "/_authenticated/_dashboardLayout" }) as { tab?: tabs };
    const location = useLocation();

    // Use useCallback to memoize the onCollapsibleChange function
    const onCollapsibleChange = useCallback((value: boolean) => {
        setCollapsibleIsOpen(value);
    }, []);

    const onLinkClicked = () => {
        setTimeout(() => {
            setCollapsibleIsOpen(false);
        }, 200);
    }

    function getConfigTab() {
        const tab = search.tab;
        if (location.pathname.includes("configuration")) {
            return tab
        } else {
            return "company"
        }
    }

    return (
        <div className="h-screen min-h-full w-[12%] min-w-52 bg-secondary-background">
            <div className="h-30 w-full flex justify-center items-center p-10">
                <img className='w-auto' src="/mergeo-logo.svg" alt='logo' />
            </div>

            <Collapsible open={!!collapsibleIsOpen} onOpenChange={onCollapsibleChange} className="bg-secondary-foreground py-4 px-4 transition-all">
                <div className="relative flex items-center">
                    <Link to='/client/configuration' search={{ tab: getConfigTab() as unknown as tabs }} className='w-full'>
                        <CollapsibleTrigger className="flex items-center text-secondary-backgroundfont-bold w-full gap-2">
                            <div className="w-10 min-w-10 h-10 flex justify-center items-center bg-primary rounded-full text-secondary-foreground font-extrabold">
                                {companyName && companyName[0].toUpperCase()}
                            </div>
                            <div className="font-bold text-base text-bg-secondary-background flex items-center gap-1">
                                <span>
                                    {companyName && companyName}
                                </span>
                                <ChevronDown size={15} strokeWidth={5} className={cn({ 'rotate-180': collapsibleIsOpen })} />
                            </div>
                        </CollapsibleTrigger>
                    </Link>
                    <div className="absolute right-0 hover:multi-[transition-all;rotate-180]">
                        <Link to="/client/configuration" search={{ tab: tabs.company as unknown as tabs }} onMouseEnter={(e) => e.preventDefault()}>
                            <Settings />
                        </Link>
                    </div>
                </div>
                <CollapsibleContent className="CollapsibleContent">
                    <ul className="py-4 pt-6 pl-10 [&>li>*]:multi-[flex;gap-2;] space-y-5 text-secondary-background ">
                        <li>
                            <Link
                                onMouseEnter={(e) => e.preventDefault()}
                                to="/client/configuration"
                                search={{ tab: tabs.company }}
                                className={cn("font-light", {
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
                                to="/client/configuration"
                                search={{ tab: tabs.users }}
                                className={cn("font-light", {
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

            <div className={cn("mt-8", { 'mt-0': user?.accountType === ACCOUNT.provider })}>
                {user?.accountType === ACCOUNT.client &&
                    <div className="px-5">
                        <NewOrderButton />
                    </div>
                }

                <ul className="py-4 pt-6 text-secondary-foreground [&>li]:multi-[w-full] [&>li>a]:multi-[flex;gap-2;text-sm;w-full;h-10;pl-6;py-6;items-center;] [&>li>a]:hover:multi-['hover:bg-secondary-foreground/20']">
                    {user?.accountType === ACCOUNT.client && (
                        <>
                            <li>
                                <SpecialLink
                                    to="/client/proOrders"
                                    onClick={onLinkClicked}
                                    activePaths={['/client/proOrders']}
                                >
                                    <Archive />
                                    Pedidos
                                </SpecialLink>

                            </li>
                            <li>

                                <CollapsibleList onLinkClicked={onLinkClicked} />

                            </li>
                        </>
                    )}
                    {user?.accountType === ACCOUNT.provider && (
                        <>
                            <li>
                                <SpecialLink
                                    to="/provider/products"
                                    activePaths={['/provider/products/newProducts', '/provider/products/']}
                                    onClick={onLinkClicked}
                                >
                                    <Package />
                                    Productos
                                </SpecialLink>
                            </li>
                            <li>
                                <SpecialLink
                                    to="/provider/proOrders"
                                    activePaths={['/provider/proOrders']}
                                    onClick={onLinkClicked}
                                >
                                    <Archive />
                                    Pedidos
                                </SpecialLink>
                            </li>
                        </>
                    )}
                    <li>
                        <SpecialLink
                            to="/buyOrder"
                            activePaths={['/buyOrder']}
                            onClick={onLinkClicked}
                        >
                            <WalletCards />
                            Ordenes de Compra
                        </SpecialLink>
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