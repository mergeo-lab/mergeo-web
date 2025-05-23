import { LuFile } from "react-icons/lu";

type Props = {
    fileName: string | undefined;
}

export default function FileNameBadge({ fileName }: Props) {
    if (!fileName) return null;
    return (
        <div className='border border-muted px-2 rounded-sm mr-2 flex items-center gap-2'>
            <LuFile size={16} className='text-info' />
            <span className='text-black/40'>{fileName}</span>
        </div>
    )
}