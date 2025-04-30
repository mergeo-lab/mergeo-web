

type Props = {
    percent: number;
    label: string;
}
export default function PercentBar({ percent, label }: Props) {
    return (
        < div className="my-4" >
            <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span>{percent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div >
    )
}