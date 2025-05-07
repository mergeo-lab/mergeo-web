import { Button } from '@/components/ui/button';
import { useCallback, useImperativeHandle, useState, forwardRef } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { uploadProductsFile } from '@/lib/products';
import OverlayLoadingIndicator from '@/components/overlayLoadingIndicator';
import { useUploadQueue } from '@/store/uploadQueue.store';

type Props = {
    errorMessages: {
        file: string;
        noFile: string;
    };
    label: string;
    acceptedFileTypes: Record<string, string[]>;
    dzHeight?: number;
    companyId?: string;
    onSuccess: (selectedFile: string) => void;
};

export interface DropZoneRef {
    reset: () => void;
}

const DropZone = forwardRef<DropZoneRef, Props>(({
    errorMessages,
    label,
    acceptedFileTypes,
    dzHeight = 200,
    companyId,
    onSuccess,
}, ref) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        mutateAsync,
        isPending,
        error,
        reset: resetMutation,
    } = useMutation({ mutationFn: uploadProductsFile });

    const { addToQueue } = useUploadQueue();

    // Expose reset for parent component
    useImperativeHandle(ref, () => ({
        reset: () => {
            setSelectedFile(null);
            setErrorMessage(null);
            resetMutation();
        }
    }));

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        setErrorMessage(null);

        if (fileRejections.length > 0) {
            setErrorMessage(errorMessages.file);
            return;
        }
        const file = acceptedFiles[0];
        setSelectedFile(file);
    }, [errorMessages.file]);

    const handleUpload = async () => {
        if (!selectedFile) {
            setErrorMessage(errorMessages.noFile);
            return;
        }

        if (!companyId) return;

        setErrorMessage(null);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await mutateAsync({ companyId, body: formData });
            addToQueue(selectedFile.name); // Added to queue after upload starts
            setSelectedFile(null);
            onSuccess(selectedFile.name); // Notify parent
        } catch (err: unknown) {
            // Error handled by `mutation.error`
            console.error('Error uploading file:', err);
        }
    };

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: acceptedFileTypes,
        multiple: false,
        noClick: true, // prevent auto opening on click
        noKeyboard: true,
    });

    return (
        <div className="w-full relative">
            {isPending && (
                <OverlayLoadingIndicator
                    label="Subiendo archivo"
                    className="flex flex-col justify-center"
                />
            )}

            {/* Dropzone area */}
            <div
                className={cn(
                    'border-dashed border-2 border-gray-300 rounded-md p-8 text-center cursor-pointer flex justify-center items-center',
                    `h-[${dzHeight}px]`
                )}
                {...getRootProps()}
                onClick={open}
            >
                <input {...getInputProps()} />
                <p className="text-gray-500">
                    {isDragActive ? 'Suelta el archivo aquí...' : label}
                </p>
            </div>

            {/* Error */}
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
            {error && <p className="text-red-500 text-sm mt-2">{error?.message}</p>}

            {/* File info and actions */}
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
                                onClick={() => {
                                    setSelectedFile(null);
                                    setErrorMessage(null);
                                }}
                            >
                                <X size={15} strokeWidth={3} className="text-destructive" />
                            </Button>
                        </div>
                    )}
                </div>

                <Button
                    disabled={!selectedFile || isPending}
                    onClick={handleUpload}
                    className="bg-info hover:bg-info/70"
                >
                    Subir archivo
                </Button>
            </div>
        </div>
    );
});

DropZone.displayName = 'DropZone';
export default DropZone;
