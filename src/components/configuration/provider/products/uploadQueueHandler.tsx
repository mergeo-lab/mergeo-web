import { UploadEvents } from "@/components/configuration/provider/products/uploadEvents";
import { useProductUploads } from "@/hooks/useProductUploads";
import { useEffect, useRef, useState } from "react";

type Props = {
    userId: string;
    onFinish: () => void;
};

export function UploadQueueHandler({ userId, onFinish }: Props) {
    const { uploads } = useProductUploads(userId);
    const hasCalledOnFinish = useRef(false);
    const [completedUploads, setCompletedUploads] = useState<Set<string>>(new Set());

    console.log('UploadQueueHandler: All uploads:', uploads);

    // Show uploads that are in progress OR recently completed (within 10 seconds)
    const visibleUploads = Object.entries(uploads).filter(
        ([key, upload]) => {
            const isInProgress = !upload.finished && upload.percent < 100;
            const isRecentlyCompleted = upload.finished && upload.percent === 100 && !completedUploads.has(key);
            const shouldShow = isInProgress || isRecentlyCompleted;
            console.log('UploadQueueHandler: Upload', key, 'isInProgress:', isInProgress, 'isRecentlyCompleted:', isRecentlyCompleted, 'shouldShow:', shouldShow);
            return shouldShow;
        }
    );

    useEffect(() => {
        // Track completed uploads and remove them after 10 seconds
        const newCompletedUploads = new Set<string>();

        Object.entries(uploads).forEach(([key, upload]) => {
            if (upload.finished && upload.percent === 100) {
                newCompletedUploads.add(key);

                // Remove from completed uploads after 10 seconds
                setTimeout(() => {
                    setCompletedUploads(prev => {
                        const updated = new Set(prev);
                        updated.delete(key);
                        return updated;
                    });
                }, 10000);
            }
        });

        if (newCompletedUploads.size > 0) {
            setCompletedUploads(prev => new Set([...prev, ...newCompletedUploads]));
        }

        // Only call onFinish if we have uploads and they're all done
        if (Object.values(uploads).length > 0 && visibleUploads.length === 0 && !hasCalledOnFinish.current) {
            hasCalledOnFinish.current = true;
            if (typeof onFinish === 'function') {
                onFinish();
            }
        } else if (visibleUploads.length > 0) {
            // Reset the flag if we get new uploads
            hasCalledOnFinish.current = false;
        }
    }, [uploads, visibleUploads.length, onFinish]);

    if (visibleUploads.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2">
            {visibleUploads.map(([key, upload]) => (
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
