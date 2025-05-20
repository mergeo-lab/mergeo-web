import { UploadEvents } from "@/components/configuration/provider/products/uploadEvents";
import { useUploadQueue } from "@/store/uploadQueue.store";
import { useProductUploads } from "@/hooks/useProductUploads";

type Props = {
    providerId: string;
    onFinish: () => void;
};

export function UploadQueueHandler({ providerId, onFinish }: Props) {
    const { queue, addToFinished } = useUploadQueue(); // your zustand store with queued file names
    const { uploads } = useProductUploads(providerId);

    const isAllProcessed = Array.from(queue).every((file) =>
        Object.values(uploads).some((u) => u.fileName === file && u.percent === 100)
    );

    // Once all are done, we call onFinish
    if (queue.length > 0 && isAllProcessed) {
        onFinish();
        return null;
    }

    return (
        <div className="flex flex-col gap-2">
            {Array.from(queue).map((file, index) => (
                <UploadEvents
                    key={file + index}
                    fileName={file}
                    providerId={providerId}
                    onFinish={(filename) => { addToFinished(filename) }} // Let parent decide when to fully reset
                />
            ))}
        </div>
    );
}
