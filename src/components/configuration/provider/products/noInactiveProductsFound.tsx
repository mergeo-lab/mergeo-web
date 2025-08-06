import { LuSearchX } from "react-icons/lu";

export default function NoInactiveProductsFound() {
    return (
        <div className="w-full h-full flex justify-center items-center">

            <div className="w-fit h-fit bg-white shadow rounded p-10 flex gap-5 items-center">

                <div className="bg-yellow-500 w-fit h-fit p-2 rounded">
                    <LuSearchX size={36} strokeWidth={1.5} className="text-white" />
                </div>
                <div>
                    <p className="font-medium">
                        No tienes productos inactivos en este momento
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Todos tus productos están activos
                    </p>
                </div>
            </div>
        </div>
    )
} 