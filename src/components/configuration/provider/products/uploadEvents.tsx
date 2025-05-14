import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Progress } from "@/components/ui/progress";
import { useProductUploads } from "@/hooks/useProductUploads";
import { cn } from "@/lib/utils";
import { CopyCheck, FolderCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { BiMessageAltError } from "react-icons/bi";
import { BsDatabaseAdd } from "react-icons/bs";


type Props = {
    providerId: string;
    fileName: string;
    onFinish: (fileName: string) => void;
};

export function UploadEvents({ providerId, fileName, onFinish }: Props) {
    const { uploads } = useProductUploads(providerId);
    const [copy, setCopy] = useState(false);

    // Get the current file's upload statu
    const currentUpload = uploads[fileName];

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log("Copied to clipboard!");
                setCopy(true);
                setTimeout(() => {
                    setCopy(false);
                }, 1000);
            })
            .catch((err) => {
                console.error("Failed to copy:", err);
            });
    }

    // Call onFinish only when current file finishes uploading
    useEffect(() => {
        if (currentUpload?.percent === 100) {
            const timeout = setTimeout(() => {
                onFinish(fileName);
            }, 1500); // optional: short delay to allow user to see success

            return () => clearTimeout(timeout);
        }
    }, [currentUpload?.percent, fileName, onFinish]);

    // If the file is not being uploaded yet or is already finished
    if (!currentUpload) {
        return <div className="flex flex-col gap-4 p-5 w-full rounded shadow">
            <p className="text-sm text-muted-foreground">
                Esperando a subir archivo <span className="font-medium">{fileName}</span>
            </p>
        </div>
    }

    return (
        <div className="flex flex-col gap-4 p-5 w-full rounded shadow">
            <div
                className={cn("flex items-center gap-4 w-full transition-opacity duration-300")}
            >
                {currentUpload.percent < 100 ? (
                    <>
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
                                {currentUpload.gtins[currentUpload.gtins.length - 1]}
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="w-full flex items-center justify-between">
                        <div className="flex gap-2">
                            <FolderCheck className="text-primary" />
                            <p>Archivo <span className="font-medium">{fileName}</span> cargado!</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex items-center gap-2 border-2 border-muted/40 px-2 rounded h-10">
                                <BsDatabaseAdd size={25} className="text-primary" />
                                {`${currentUpload.successGtins?.length} productos procesados con exito`}
                            </div>
                            <div className="h-5">
                                {currentUpload?.failedGtins && currentUpload?.failedGtins?.length > 0 &&
                                    <NavigationMenu>
                                        <NavigationMenuList>
                                            <NavigationMenuItem>
                                                <NavigationMenuTrigger className="border-2 border-destructive/40 px-4 rounded h-10 text-black/70 text-base">
                                                    <div className="flex items-center gap-1">
                                                        <BiMessageAltError size={30} className="text-destructive" />
                                                        {`${currentUpload.failedGtins?.length}  productos procesados con error`}
                                                    </div>
                                                </NavigationMenuTrigger>
                                                <NavigationMenuContent className="p-0! w-full min-w-80 max-h-50">
                                                    <div className="h-50 overflow-auto flex justify-center flex-wrap p-4 gap-2">
                                                        {currentUpload.failedGtins?.map((item, index) =>
                                                            <div key={item + index} className="text-sm border border-muted px-3 rounded-sm flex items-center justify-center">{item}</div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        className="text-info w-full"
                                                        onClick={() => currentUpload.failedGtins && copyToClipboard(currentUpload.failedGtins?.join(', '))}
                                                    >{!copy ? "Copiar" : <CopyCheck className="tect-primary" />}</Button>
                                                </NavigationMenuContent>
                                            </NavigationMenuItem>
                                        </NavigationMenuList>
                                    </NavigationMenu>
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
