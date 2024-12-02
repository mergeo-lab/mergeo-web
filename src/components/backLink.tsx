import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from '@tanstack/react-router'

export default function BackLink() {
    const { history } = useRouter()

    return (
        <Button onClick={() => history.go(-1)}
            variant="ghost" type="button" className="text-secondary px-2 pr-4">
            <ChevronLeft />
            Volver
        </Button>
    )
}
