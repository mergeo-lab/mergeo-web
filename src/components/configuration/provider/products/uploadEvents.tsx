import { Progress } from "@/components/ui/progress";
import { UseSse } from "@/hooks/useSse";
import { PRODUCT_UPLOAD_EVENTS } from "@/lib/orders/endpoints";
import { cn } from "@/lib/utils";
import { FolderCheck } from "lucide-react";
import { useEffect, useState } from "react";


type Props = {
    companyId: string | undefined;
    start: boolean;
    onFinish: () => void;
}

export function UploadEvents({ companyId, onFinish }: Props) {
    const { data: productUploadStream } = UseSse(`${PRODUCT_UPLOAD_EVENTS}${companyId}`);
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);

    }, []);

    useEffect(() => {
        if (productUploadStream?.upload_percent === 100) {
            onFinish();
            setShow(false);
        }
    }, [productUploadStream, onFinish]);

    return (
        <div className={cn("flex items-center gap-5 w-full p-5 rounded shadow opacity-0", {
            "opacity-100": show
        })}>
            <p>
                Porcesando producto con EAN/GTIN <span className="text-info font-bold">{productUploadStream?.gtin}</span>
            </p>
            {
                (productUploadStream?.upload_percent ?? 0) < 100 ?
                    <>
                        <div className="w-1/2">
                            <Progress value={productUploadStream?.upload_percent ?? 0} className='w-full rounded h-2' />
                        </div>
                        <div>{productUploadStream?.upload_percent}%</div>
                    </>

                    : <div className="flex items-center gap-2">
                        <FolderCheck className="text-primary" />
                        <p>Productos cargados exitosamente!</p>
                    </div>
            }

        </div>
    );
}