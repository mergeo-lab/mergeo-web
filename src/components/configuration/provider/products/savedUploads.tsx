import { Button } from "@/components/ui/button";
import { useUploadResultsStore, UploadResult } from "@/store/uploadResults.store";
import { LuTrash2, LuUpload } from "react-icons/lu";
import { useState } from "react";

interface SavedUploadsProps {
    selectedFile?: File | null;
    onUpload?: () => void;
    isUploading?: boolean;
}

export function SavedUploads({ selectedFile, onUpload, isUploading }: SavedUploadsProps) {
    const { results, clearResults, removeResult } = useUploadResultsStore();
    const [expanded, setExpanded] = useState<string | null>(null);

    const resultEntries = Object.entries(results).sort((a, b) => {
        // Sort by timestamp descending
        const aTime = (a[1] as UploadResult).timestamp;
        const bTime = (b[1] as UploadResult).timestamp;
        return bTime - aTime;
    });

    if (resultEntries.length === 0 && !selectedFile) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4 p-5">
            {selectedFile && (
                <div className="flex flex-col gap-2 p-4 rounded-lg border">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium">{selectedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {new Date().toLocaleString()}
                            </p>
                        </div>
                        <Button
                            onClick={onUpload}
                            disabled={isUploading}
                            className="flex items-center gap-2"
                        >
                            <LuUpload className="h-4 w-4" />
                            {isUploading ? "Subiendo..." : "Subir"}
                        </Button>
                    </div>
                </div>
            )}

            {resultEntries.length > 0 && (
                <>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Subidas Guardadas</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={clearResults}
                        >
                            <LuTrash2 className="h-4 w-4 mr-2" />
                            Limpiar Todo
                        </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {resultEntries.map(([key, result]) => (
                            <div
                                key={key}
                                className="flex flex-col gap-2 p-4 rounded-lg border"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{result.fileName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(result.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm text-muted-foreground">
                                            {result.successGtins?.length || 0} productos exitosos
                                        </div>
                                        {result.failedGtins && result.failedGtins.length > 0 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setExpanded(expanded === key ? null : key)}
                                            >
                                                {expanded === key ? "Ocultar Errores" : `${result.failedGtins.length} errores`}
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive"
                                            onClick={() => removeResult(key)}
                                        >
                                            <LuTrash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                {expanded === key && result.failedGtins && (
                                    <div className="mt-2 p-2 bg-destructive/10 rounded">
                                        <div className="font-semibold mb-1">IDs con error:</div>
                                        <div className="flex flex-wrap gap-2">
                                            {result.failedGtins.map((id, idx) => (
                                                <span key={id + idx} className="text-xs bg-destructive/20 px-2 py-1 rounded">
                                                    {id}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
} 