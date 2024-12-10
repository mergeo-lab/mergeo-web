import Dropzone from "@/components/dropzone";
import { cn } from "@/lib/utils";

export default function UploadFile() {
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
                />
            </div>
        </div>

    )
}