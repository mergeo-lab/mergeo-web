import { Progress } from "@/components/ui/progress";
import { UseSse } from "@/hooks/useSse";
import { PRODUCT_UPLOAD_EVENTS } from "@/lib/orders/endpoints";
import { FolderCheck } from "lucide-react";
import { useEffect } from "react";


type Props = {
    companyId: string;
    start: boolean;
    onFinish: () => void;
}

export function UploadEvents({ companyId, start, onFinish }: Props) {
    const { data: productUploadStream, setStart } = UseSse(`${PRODUCT_UPLOAD_EVENTS}${companyId}`);

    useEffect(() => {
        start && setStart(true);
    }, [setStart, start]);

    useEffect(() => {
        if (productUploadStream?.upload_percent === 100) {
            onFinish();
        }
    }, [productUploadStream, onFinish]);

    return (
        <div className="flex items-center gap-5 w-full p-5 rounded shadow">
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