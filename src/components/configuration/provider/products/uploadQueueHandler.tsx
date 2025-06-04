import { UploadEvents } from "@/components/configuration/provider/products/uploadEvents";
import { useProductUploads } from "@/hooks/useProductUploads";

type Props = {
    userId: string;
    onFinish: () => void;
};

export function UploadQueueHandler({ userId, onFinish }: Props) {
    const { uploads } = useProductUploads(userId);

    // Only show in-progress uploads (not finished and percent < 100)
    const inProgressUploads = Object.entries(uploads).filter(
        ([, upload]) => !upload.finished && upload.percent < 100
    );

    // Optionally, call onFinish if all are done
    if (Object.values(uploads).length > 0 && inProgressUploads.length === 0) {
        onFinish();
        return null;
    }

    return (
        <div className="flex flex-col gap-2">
            {inProgressUploads.map(([key, upload]) => (
                <UploadEvents
                    key={key}
                    id={key}
                    fileName={upload.fileName || key}
                    userId={userId}
                    onFinish={() => { }}
                />
            ))}
        </div>
    );
}
