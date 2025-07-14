import { UploadEvents } from "@/components/configuration/provider/products/uploadEvents";
import { useProductUploads } from "@/hooks/useProductUploads";
import { useEffect, useRef } from "react";

type Props = {
    userId: string;
    onFinish: () => void;
};

export function UploadQueueHandler({ userId, onFinish }: Props) {
    const { uploads } = useProductUploads(userId);
    const hasCalledOnFinish = useRef(false);

    // Only show in-progress uploads (not finished and percent < 100)
    const inProgressUploads = Object.entries(uploads).filter(
        ([, upload]) => !upload.finished && upload.percent < 100
    );

    useEffect(() => {
        // Only call onFinish if we have uploads and they're all done
        if (Object.values(uploads).length > 0 && inProgressUploads.length === 0 && !hasCalledOnFinish.current) {
            hasCalledOnFinish.current = true;
            onFinish();
        } else if (inProgressUploads.length > 0) {
            // Reset the flag if we get new uploads
            hasCalledOnFinish.current = false;
        }
    }, [uploads, inProgressUploads.length, onFinish]);

    if (inProgressUploads.length === 0) {
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
                />
            ))}
        </div>
    );
}
