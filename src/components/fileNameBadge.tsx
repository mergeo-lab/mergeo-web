import { File } from "lucide-react";

type Props = {
    fileName: string | undefined;
}

export default function FileNameBadge({ fileName }: Props) {
    return (
        <div className='border border-muted px-2 rounded-sm mr-2 flex items-center gap-2'>
            <File size={16} className='text-info' />
            <span className='text-black/40'>{fileName}</span>
        </div>
    )
}