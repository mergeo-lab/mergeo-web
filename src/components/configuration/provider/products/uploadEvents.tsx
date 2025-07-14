import { Progress } from "@/components/ui/progress";
import { useProductUploads } from "@/hooks/useProductUploads";
import { useUploadResultsStore } from "@/store/uploadResults.store";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

type Props = {
    id: string;
    userId: string;
    fileName: string;
    onFinish?: (id: string) => void;
};

export function UploadEvents({ id, userId, fileName, onFinish }: Props) {
    const { uploads } = useProductUploads(userId);
    const { addResult } = useUploadResultsStore();

    // Get the current file's upload status
    const currentUpload = uploads[fileName] || uploads[id];

    // Save upload results to localStorage when they change
    useEffect(() => {
        if (
            currentUpload &&
            (currentUpload.percent === 100 || currentUpload.finished)
        ) {
            addResult(fileName, {
                ...currentUpload,
                fileName,
                timestamp: Date.now(),
            });
            onFinish && onFinish(id);
        }
    }, [currentUpload, fileName, addResult, onFinish, id]);

    // Guard: never access .percent if currentUpload is undefined
    if (!currentUpload) {
        return null;
    }
    if (
        !('percent' in currentUpload) ||
        currentUpload.percent === 0 ||
        currentUpload.percent === 100 ||
        currentUpload.finished
    ) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4 p-5 w-full rounded shadow">
            <div className={cn("flex items-center gap-4 w-full transition-opacity duration-300")}
            >
                <p className="text-sm text-muted-foreground">
                    Subiendo archivo <span className="font-medium">{fileName}</span>
                </p>
                <div className="w-1/2">
                    <Progress value={currentUpload.percent} className="w-full rounded h-2" />
                </div>
                <div>{currentUpload.percent}%</div>
                <div className="text-sm text-muted-foreground">
                    Procesando producto con Ean/Gtin:
                    <span className="text-info pl-1">
                        {currentUpload.gtins?.[currentUpload.gtins.length - 1]}
                    </span>
                </div>
            </div>
        </div>
    );
}
