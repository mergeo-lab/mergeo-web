import UploadFile from '@/components/configuration/provider/products/uploadFile';
import UploadManualProducts from '@/components/configuration/provider/products/uploadManualProducts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createFileRoute } from '@tanstack/react-router'
import { Keyboard, Upload } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/products/newProducts')({
    component: () => <UploadProducts />
})

const TabsConfig = {
    MANUAL_UPLOAD: { value: 'manual', title: 'Subir productos manualmente', icon: <Keyboard /> },
    FILE_UPLOAD: { value: 'upload', title: 'Subir productos desde Archivo', icon: <Upload /> },
}

export default function UploadProducts() {
    const [tab, setTab] = useState(TabsConfig.MANUAL_UPLOAD.value);
    const tabsTriggerClassName = 'rounded w-fit px-5 border border-secondary/20 text-secondary/50 mr-4 data-[state=active]:multi-[bg-primary;text-secondary-foreground]';

    function onTabChange(value: string) {
        setTab(value);
    }

    return (
        <div>
            <div className="grid grid-rows-[auto_1fr] h-full w-full">
                <Tabs value={tab} className="w-full h-full m-auto rounded relative" onValueChange={onTabChange}>
                    <div className="bg-accent h-20 px-10 shadow z-20 flex justify-between items-center">
                        <TabsList className='rounded-none w-full justify-start h-[50px] bg-accent'>
                            {
                                Object.values(TabsConfig).map((tab) =>
                                    <TabsTrigger className={tabsTriggerClassName} value={tab.value}>
                                        <div className="space-x-3 flex items-center">
                                            <div>{tab.icon}</div>
                                            <div>{tab.title}</div>
                                        </div>
                                    </TabsTrigger>
                                )
                            }
                        </TabsList>
                    </div>
                    <TabsContent className='h-fit m-0 ' value={TabsConfig.MANUAL_UPLOAD.value}>
                        <UploadManualProducts />
                    </TabsContent>
                    <TabsContent className='h-fit m-0' value={TabsConfig.FILE_UPLOAD.value}>
                        <UploadFile />
                    </TabsContent>
                </Tabs >
            </div>
        </div>

    )
}
