import { ProductsOverlay } from '@/components/configuration/provider/products/productsOverlay'
import UploadFile from '@/components/configuration/provider/products/uploadFile';
import UploadManualProducts from '@/components/configuration/provider/products/uploadManualProducts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UseCompanyStore from '@/store/company.store'
import UseProductListStore from '@/store/productsList.store';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { Plus } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/products/newProducts')({
    component: () => <UploadProducts />
})

enum TabsEnum {
    MANUAL_UPLOAD = 'manual',
    FILE_UPLOAD = 'file',
}

export default function UploadProducts() {
    const { history } = useRouter()
    const { selectedList } = UseProductListStore();
    const { company } = UseCompanyStore();
    const [tab, setTab] = useState(TabsEnum.MANUAL_UPLOAD);
    const [isDialogOoen, setIsDialogOpen] = useState(true);
    const tabsTriggerClassName = 'rounded w-52 data-[state=active]:multi-[bg-primary;text-secondary-foreground]';

    function onTabChange(value: string) {
        const selectedTab = value as TabsEnum;
        setTab(selectedTab)
    }

    return (
        <div>
            <div className="bg-accent py-4 px-10 shadow z-20 flex justify-between items-center">
                <div className='flex justify-center items-center w-fit gap-2'>
                    {isDialogOoen
                        ? <Skeleton className='w-[300px] h-10 bg-muted/20' />
                        : <p>Estas modifaicando la lista - <span className='bg-white border-border p-2 px-4 rounded shadow-sm text-primary font-thin'>{selectedList?.name}</span></p>
                    }
                </div>
                <div className='flex justify-center items-center w-fit gap-2'>
                    <Link to="/provider/products/newProducts">
                        <Button className='flex gap-2' onClick={() => setIsDialogOpen(true)} disabled={isDialogOoen}>
                            <Plus size={20} strokeWidth={3} />
                            <p>Cambiar o Crear Lista</p>
                        </Button>
                    </Link>
                </div>
            </div>

            <Tabs value={tab} className="w-full h-full m-auto rounded relative" onValueChange={onTabChange}>
                <TabsList className='rounded-none w-full justify-start h-[50px] bg-border pl-10'>
                    <TabsTrigger className={tabsTriggerClassName} value={TabsEnum.MANUAL_UPLOAD}>Buscar y agregar producto</TabsTrigger>
                    <TabsTrigger className={tabsTriggerClassName} value={TabsEnum.FILE_UPLOAD}>Subir un archivo</TabsTrigger>
                </TabsList>
                <TabsContent className='h-fit m-0 ' value={TabsEnum.MANUAL_UPLOAD}>
                    <UploadManualProducts />
                </TabsContent>
                <TabsContent className='h-fit m-0' value={TabsEnum.FILE_UPLOAD}>
                    <UploadFile />
                </TabsContent>
            </Tabs >

            <ProductsOverlay
                openDialog={isDialogOoen}
                companyId={company?.id}
                callback={() => {
                    setIsDialogOpen(false);

                }} onCancel={(goBack) => {
                    if (goBack) {
                        history.go(-1);
                    } else {
                        setIsDialogOpen(false);
                    }
                }} />
        </div>
    )
}
