import { Button } from '@/components/ui/button';
import { useCallback, useImperativeHandle, useState, forwardRef, useEffect } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { RxCross2 } from "react-icons/rx";
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { uploadProductsFile } from '@/lib/products';
import { useUploadQueue, UploadQueueItem } from '@/store/uploadQueue.store';
import { Progress } from '@/components/ui/progress';
import { useProductUploads } from '@/hooks/useProductUploads';
import { useAuth } from '@/context/AuthContext';
import { useUploadResultsStore } from '@/store/uploadResults.store';

function generateUploadId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// FileUploadRow component: shows file with upload button and progress
function FileUploadRow({ 
    selectedFile, 
    onUpload, 
    isUploading, 
    onFinish 
}: { 
    selectedFile: File | null, 
    onUpload: () => void, 
    isUploading: boolean,
    onFinish: () => void
}) {
    const { account } = useAuth();
    const userId = account?.user.id;
    const { uploads } = useProductUploads(userId || "");
    const { addResult } = useUploadResultsStore();
    
    // Get current upload data
    const currentUpload = selectedFile ? uploads[selectedFile.name] : null;
    const showProgress = currentUpload && (currentUpload.percent > 0 || currentUpload.finished);
    
    // Save results when upload finishes
    useEffect(() => {
        if (currentUpload && currentUpload.finished && currentUpload.percent === 100) {
            console.log('FileUploadRow: Upload finished, saving results');
            
            const resultData = {
                ...currentUpload,
                fileName: selectedFile?.name || '',
                timestamp: Date.now(),
            };
            
            addResult(selectedFile?.name || '', resultData);
            onFinish();
        }
    }, [currentUpload, selectedFile, addResult, onFinish]);
    
    if (!selectedFile) return null;
    
    return (
        <div className="flex flex-col gap-2 p-4 rounded-lg border mt-4">
            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{new Date().toLocaleString()}</p>
                </div>
                {!showProgress && (
                    <Button
                        onClick={onUpload}
                        disabled={isUploading}
                        className="flex items-center gap-2"
                    >
                        {isUploading ? "Subiendo..." : "Subir"}
                    </Button>
                )}
            </div>
            
            {/* Show progress if upload is in progress or completed */}
            {showProgress && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <Progress value={currentUpload.percent} className="w-full rounded h-2" />
                        </div>
                        <div className="text-sm font-medium">{currentUpload.percent}%</div>
                    </div>
                    
                    {!currentUpload.finished && currentUpload.gtins && currentUpload.gtins.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                            Procesando producto con Ean/Gtin:
                            <span className="text-info pl-1">
                                {currentUpload.gtins[currentUpload.gtins.length - 1]}
                            </span>
                        </div>
                    )}
                    
                    {currentUpload.finished && (
                        <div className="text-sm text-muted-foreground">
                            {currentUpload.successGtins?.length || 0} exitosos, {currentUpload.failedGtins?.length || 0} errores
                        </div>
                    )}
                </div>
            )}
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
    const [isUploading, setIsUploading] = useState(false);

    const {
        mutateAsync,
        error,
        reset: resetMutation,
    } = useMutation({ mutationFn: uploadProductsFile });

    const { addToQueue } = useUploadQueue();

    console.log('DropZone: Component rendered with companyId:', companyId);

    // Expose reset for parent component
    useImperativeHandle(ref, () => ({
        reset: () => {
            console.log('DropZone: Reset called');
            setSelectedFile(null);
            setUploadId(null);
            setErrorMessage(null);
            setIsUploading(false);
            resetMutation();
        }
    }));

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        console.log('DropZone: onDrop called with:', { acceptedFiles, fileRejections });
        setErrorMessage(null);

        if (fileRejections.length > 0) {
            console.log('DropZone: File rejected:', fileRejections);
            setErrorMessage(errorMessages.file);
            return;
        }
        const file = acceptedFiles[0];
        console.log('DropZone: File accepted:', file.name);
        setSelectedFile(file);
        setUploadId(generateUploadId());
    }, [errorMessages.file]);

    const handleUpload = async () => {
        console.log('DropZone: handleUpload called');

        if (!selectedFile || !uploadId) {
            console.log('DropZone: No file or uploadId, showing error');
            setErrorMessage(errorMessages.noFile);
            return;
        }

        if (!companyId) {
            console.log('DropZone: No companyId available');
            return;
        }

        console.log('DropZone: Starting upload for file:', selectedFile.name, 'with uploadId:', uploadId);

        setErrorMessage(null);
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            console.log('DropZone: Calling uploadProductsFile');
            await mutateAsync({ companyId, body: formData });
            console.log('DropZone: Upload successful');

            const item: UploadQueueItem = { id: uploadId, fileName: selectedFile.name };
            console.log('DropZone: Adding to queue:', item);
            addToQueue(item);

            console.log('DropZone: Calling onSuccess with:', item);
            onSuccess(item);
            
            // Don't reset file yet - let the SSE events handle completion
            console.log('DropZone: Keeping file visible for progress tracking');
        } catch (err: unknown) {
            console.error('DropZone: Error uploading file:', err);
            setIsUploading(false);
        }
    };

    const handleUploadFinish = useCallback(() => {
        console.log('DropZone: Upload finished, resetting file selection');
        setSelectedFile(null);
        setUploadId(null);
        setIsUploading(false);
    }, []);

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
                                console.log('DropZone: File removed by user');
                                setSelectedFile(null);
                                setUploadId(null);
                                setIsUploading(false);
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
            <FileUploadRow
                selectedFile={selectedFile}
                onUpload={handleUpload}
                isUploading={isUploading}
                onFinish={handleUploadFinish}
            />
        </div>
    );
});

DropZone.displayName = 'DropZone';

export default DropZone;
