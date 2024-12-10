import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    errorMessages: {
        file: string,
        noFile: string
    }
    label: string,
    acceptedFileTypes: Record<string, string[]>;
    dzHeight?: number
}

export default function DropZone({ errorMessages, label, acceptedFileTypes, dzHeight }: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        setErrorMessage(null);
        setSelectedFile(null);

        if (fileRejections.length > 0) {
            setErrorMessage(errorMessages.file);
            return;
        }

        if (acceptedFiles.length > 0) {
            setSelectedFile(acceptedFiles[0]);
        }
    }, []);

    const handleUpload = () => {
        if (!selectedFile) {
            setErrorMessage(errorMessages.noFile);
            return;
        }

        setErrorMessage(null);
        setUploadProgress(0);

        // Simula la subida
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);

        // Aquí implementa la lógica real de subida (ej. con Axios o Fetch)
        console.log('Subiendo archivo:', selectedFile);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedFileTypes,
        maxFiles: 1,
    });

    return (
        <div className="w-full">
            {/* Dropzone */}
            <div
                className={cn("border-dashed border-2 border-gray-300 rounded-md p-8 text-center cursor-pointer flex justify-center items-center", `h-[${dzHeight}px]`)}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-gray-500">Suelta el archivo aquí...</p>
                ) : (
                    <p className="text-gray-500">{label}</p>
                )}
            </div>

            {/* Error */}
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}


            {/* Archivo Seleccionado */}
            <div className="flex justify-between items-center mt-4">
                <div>
                    {selectedFile && (
                        <div className="flex items-center gap-2">
                            <p className="text-gray-700 text-sm">
                                <strong>Archivo seleccionado:</strong> {selectedFile.name}
                            </p>
                            <Button
                                variant="ghost"
                                className="p-1 h-6 leading-none"
                                onClick={() => setSelectedFile(null)}
                            >
                                <X size={15} strokeWidth={3} className="text-destructive" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Botón Subir */}
                <Button
                    disabled={!selectedFile}
                    onClick={handleUpload}
                    className="bg-info hover:bg-info/70"
                >
                    Subir archivo
                </Button>
            </div>

            {/* Barra de Progreso */}
            <div className={cn("absolute top-0 left-0 right-0 transition-all duration-300 overflow-hidden", {
                "h-0": uploadProgress === 0 || uploadProgress === 100,
                "h-2": uploadProgress > 0 && uploadProgress < 100
            })}>
                <Progress value={uploadProgress} className='w-full rounded-none h-2' />
            </div>
        </div>
    );
}
