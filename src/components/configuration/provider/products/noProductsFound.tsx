import { SearchX } from "lucide-react"

export default function NoProductsFound() {
    return (
        <div className="w-full h-full flex justify-center items-center">

            <div className="w-fit h-fit bg-white shadow rounded p-10 flex gap-5 items-center">

                <div className="bg-destructive w-fit h-fit p-2 rounded">
                    <SearchX size={36} strokeWidth={1.5} className="text-white" />
                </div>
                <div>
                    <p>
                        No se encontraron productos con esos parametros!
                    </p>
                    <p>
                        Intentalo nuevamente.
                    </p>
                </div>
            </div>
        </div>
    )
}