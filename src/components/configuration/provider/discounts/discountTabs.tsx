
import { FaBoxesPacking } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscountProducts from "@/components/configuration/provider/discounts/discountProducts";
import DiscountAddProducts from "@/components/configuration/provider/discounts/discountAddProducts";
import { useEffect, useState } from "react";
import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";

type Props = {
    className?: string,
    companyId: string,
    selectedDiscountId?: string | null,
    discount?: number,
    activeTab?: string,
    onTabChange?: (tab: string) => void,
}

export default function DiscountTabs({ className, companyId, selectedDiscountId, discount = 0, activeTab, onTabChange }: Props) {
    const [tab, setTab] = useState("products");
    const [isTabLoading, setIsTabLoading] = useState(false);

    useEffect(() => {
        setTab("products");
    }, [selectedDiscountId])

    useEffect(() => {
        if (activeTab) {
            setTab(activeTab);
        }
    }, [activeTab]);

    const handleTabChange = (newTab: string) => {
        setIsTabLoading(true);
        setTab(newTab);
        onTabChange?.(newTab);

        // Simular un pequeño delay para mostrar el loading
        setTimeout(() => {
            setIsTabLoading(false);
        }, 300);
    };

    if (!selectedDiscountId) {
        return (
            <div className='w-full h-full flex flex-col justify-center items-center relative'>
                <FaBoxesPacking size={300} className='text-muted/10' />
                <p className='text-md'>
                    Selecciona una lista para ver los productos
                </p>
            </div>
        )
    }

    return (
        <div className={cn("w-full h-full ", className)}>
            <Tabs value={tab} onValueChange={handleTabChange} className="w-full h-full">
                <div className="w-full px-4">
                    <TabsList className="grid w-full grid-cols-2 gap-2 bg-muted/20 h-fit p-2">
                        <TabsTrigger className={cn("!text-white",
                            {
                                "!bg-info": tab === "products",
                                "bg-info/50": tab !== "products"
                            }
                        )}
                            value="products">Productos</TabsTrigger>
                        <TabsTrigger className={cn("!text-white",
                            {
                                "!bg-info": tab === "add",
                                "bg-info/50": tab !== "add"
                            }
                        )} value="add">Agregar Productos</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="products" className="h-full relative">
                    <DiscountProducts selectedDiscountId={selectedDiscountId} discount={discount} />
                    {isTabLoading && (
                        <OverlayLoadingIndicator label="Cargando productos" />
                    )}
                </TabsContent>
                <TabsContent value="add" className="h-full relative">
                    <DiscountAddProducts
                        companyId={companyId}
                        discountListId={selectedDiscountId}
                        discount={discount}
                        onSuccess={() => handleTabChange("products")}
                    />
                    {isTabLoading && (
                        <OverlayLoadingIndicator label="Cargando productos" />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
