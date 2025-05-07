import { UploadQueueHandler } from "@/components/configuration/provider/products/uploadQueueHandler";
import Dropzone, { DropZoneRef } from "@/components/dropzone";
import { cn } from "@/lib/utils";
import UseCompanyStore from "@/store/company.store";
import { useUploadQueue } from "@/store/uploadQueue.store";
import { useEffect, useRef } from "react";

export default function UploadFile() {
    const { company } = UseCompanyStore();
    const companyId = company?.id;
    const dropzoneRef = useRef<DropZoneRef>(null);
    const { addToQueue, resetQueue } = useUploadQueue();

    function fileUploadedCallback(uploadedFile: string) {
        addToQueue(uploadedFile); // queue the file as "pending"
    }

    function productsQueueFinishCallback() {
        dropzoneRef.current?.reset();
        resetQueue();
    }

    useEffect(() => {
        const dropzone = dropzoneRef.current;
        return () => {
            dropzone?.reset();
            resetQueue();
        }
    }, [resetQueue])

    return (
        <div className='p-10'>
            <div className={cn('transition-all rounded-sm p-5 relative')}>
                <div className='space-y-2'>
                    <p className=''>Subir una archivo de Productos</p>
                    <div className='flex justify-between pb-1'>
                        <p className='text-sm text-muted'>Puedes bajar un template haciendo click
                            <a
                                href="/downloads/template_productos.xlsx"
                                className='pl-1 font-semibold underline text-info'
                                download="template_productos.xlsx"
                            >
                                aqui
                            </a>
                        </p>
                        <p className='text-sm text-muted'>Solo se permiten archivos de Excel (.xls, .xlsx) o Google Sheets (.csv).</p>
                    </div>
                </div>
                <Dropzone
                    ref={dropzoneRef}
                    acceptedFileTypes={{
                        'application/vnd.ms-excel': ['.xls'],
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                        'text/csv': ['.csv'],
                    }}
                    errorMessages={{
                        file: 'Solo se permiten archivos de Excel (.xls, .xlsx) o Google Sheets (.csv).',
                        noFile: "Por favor selecciona un archivo antes de subirlo."
                    }}
                    label="Arrastra y suelta un archivo aquí, o haz clic para seleccionarlo."
                    dzHeight={200}
                    companyId={companyId}
                    onSuccess={fileUploadedCallback}
                />
            </div>
            <div>
                <UploadQueueHandler
                    providerId={companyId!}
                    onFinish={productsQueueFinishCallback}
                />

            </div>
        </div>

    )
}