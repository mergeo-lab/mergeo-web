import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Building, ChevronDown, ChevronRight, ScrollText, Settings, UsersRound, WalletCards, Scale } from "lucide-react";
import { Link } from '@tanstack/react-router';
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';


export default function SideBarMenu() {

    const [chebronState, toggleChevron] = useState(false);

    return (
        <div className="h-screen min-h-full w-[12%] min-w-52 bg-secondary-background">
            <div className="h-30 w-full flex justify-center items-center p-10">
                <img className='w-auto' src="/mergeo-logo.svg" alt='logo' />
            </div>
            <Collapsible className="bg-secondary-foreground py-4 px-4 transition-all">
                <CollapsibleTrigger className="flex items-center text-lg text-secondary-backgroundfont-bold w-full gap-2" onClick={() => toggleChevron(!chebronState)}>
                    <div className="w-10 min-w-10 h-10 flex justify-center items-center bg-primary rounded-full text-secondary-foreground text-lg font-extrabold">
                        V
                    </div>
                    <div className="font-bold text-bg-secondary-background flex items-center gap-1">
                        <span>
                            Vivanco
                        </span>
                        <ChevronDown size={15} strokeWidth={5} className={cn({ 'rotate-180': chebronState })} />
                    </div>
                    <div className="w-full flex justify-end">
                        <Link to="/login" className="hover:multi-[transition-all;rotate-180]">
                            <Settings />
                        </Link>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent">
                    <ul className="py-4 pt-6 pl-10 [&>li>*]:multi-[flex;gap-2;] space-y-5 text-secondary-background ">
                        <li>
                            <Link to="/company">
                                <Building strokeWidth={2.5} />
                                Empresa
                            </Link>
                        </li>
                        <li>
                            <Link to="/users">
                                <UsersRound strokeWidth={2.5} />
                                Usuarios
                            </Link>
                        </li>
                    </ul>
                </CollapsibleContent>
            </Collapsible>

            <div className="px-5 mt-8>
                <Link to="/login" className="w-full">
                    <Button className="w-full text-md">
                        Hacer Pedido
                        <ChevronRight size={20} strokeWidth={3} className="ml-2" />
                    </Button>
                </Link>

                <ul className="py-4 pt-8 [&>li>*]:multi-[flex;gap-2;text-sm] space-y-5 text-secondary-foreground">
                    <li>
                        <Link to="/login" className="w-full">
                            <ScrollText />
                            Mis Listas
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" className="w-full">
                            <WalletCards />
                            Ordenes de Compra
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" className="w-full">
                            <Scale />
                            Compulsas
                        </Link>
                    </li>
                </ul>
            </div >
        </div >
    )
}