import { Button } from '@/components/ui/button';
import { useCallback, useImperativeHandle, useState, forwardRef } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { RxCross2 } from "react-icons/rx";
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { uploadProductsFile } from '@/lib/products';
import OverlayLoadingIndicator from '@/components/overlayLoadingIndicator';
import { useUploadQueue, UploadQueueItem } from '@/store/uploadQueue.store';
// import { SavedUploads } from '@/components/configuration/provider/products/savedUploads';

function generateUploadId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// PendingUpload component: shows only the selected file and upload button
function PendingUpload({ selectedFile, onUpload, isUploading }: { selectedFile: File | null, onUpload: () => void, isUploading: boolean }) {
    if (!selectedFile) return null;
    return (
        <div className="flex flex-col gap-2 p-4 rounded-lg border mt-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{new Date().toLocaleString()}</p>
                </div>
                <Button
                    onClick={onUpload}
                    disabled={isUploading}
                    className="flex items-center gap-2"
                >
                    {isUploading ? "Subiendo..." : "Subir"}
                </Button>
            </div>
        </div>
    );
}

type Props = {
    errorMessages: {
        file: string;
        noFile: string;
    };
    label: string;
    acceptedFileTypes: Record<string, string[]>;
    dzHeight?: number;
    companyId?: string;
    onSuccess: (item: UploadQueueItem) => void;
};

export type DropZoneRef = {
    reset: () => void;
};

const DropZone = forwardRef<DropZoneRef, Props>(({ errorMessages, label, acceptedFileTypes, dzHeight = 200, companyId, onSuccess }, ref) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadId, setUploadId] = useState<string | null>(null);
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
            setUploadId(null);
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
        setUploadId(generateUploadId());
    }, [errorMessages.file]);

    const handleUpload = async () => {
        if (!selectedFile || !uploadId) {
            setErrorMessage(errorMessages.noFile);
            return;
        }

        if (!companyId) return;

        setErrorMessage(null);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await mutateAsync({ companyId, body: formData });
            const item: UploadQueueItem = { id: uploadId, fileName: selectedFile.name };
            addToQueue(item); // Added to queue after upload starts
            setSelectedFile(null);
            setUploadId(null);
            onSuccess(item); // Notify parent with the UploadQueueItem
        } catch (err: unknown) {
            // Error handled by `mutation.error`
            console.error('Error uploading file:', err);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedFileTypes,
        multiple: false,
    });

    return (
        <div className="relative">
            <div
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed rounded-lg p-4 transition-colors',
                    isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
                    'hover:border-primary/50 cursor-pointer',
                    'flex flex-col items-center justify-center gap-4',
                    'relative'
                )}
                style={{ height: dzHeight }}
            >
                <input {...getInputProps()} />
                {selectedFile ? (
                    <div className="flex items-center gap-2">
                        <p className="text-sm">{selectedFile.name}</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFile(null);
                                setUploadId(null);
                            }}
                        >
                            <RxCross2 className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center">{label}</p>
                )}
            </div>
            {errorMessage && (
                <p className="text-sm text-destructive mt-2">{errorMessage}</p>
            )}
            {error && (
                <p className="text-sm text-destructive mt-2">{error.message}</p>
            )}
            <PendingUpload
                selectedFile={selectedFile}
                onUpload={handleUpload}
                isUploading={isPending}
            />
            {isPending && <OverlayLoadingIndicator />}
        </div>
    );
});

DropZone.displayName = 'DropZone';

export default DropZone;
