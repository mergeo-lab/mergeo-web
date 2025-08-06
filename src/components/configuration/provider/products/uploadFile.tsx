import { SavedUploads } from "@/components/configuration/provider/products/savedUploads";
import Dropzone, { DropZoneRef } from "@/components/dropzone";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useUploadQueue, UploadQueueItem } from "@/store/uploadQueue.store";
import { useEffect, useRef, useCallback } from "react";

export default function UploadFile() {
    const { account } = useAuth();
    const companyId = account?.company.id;
    const dropzoneRef = useRef<DropZoneRef>(null);
    const { addToQueue, removeFinishedFromQueue } = useUploadQueue();


    const fileUploadedCallback = useCallback((item: UploadQueueItem) => {
        addToQueue(item); // queue the file as "pending"
    }, [addToQueue]);

    useEffect(() => {
        return () => {
            if (dropzoneRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                dropzoneRef.current.reset();
            }
            removeFinishedFromQueue();
        }
    }, [removeFinishedFromQueue]);

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
            <div className="max-h-96 overflow-y-auto">
                <SavedUploads />
            </div>
        </div>
    )
}