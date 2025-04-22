import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from '@tanstack/react-router';
import UseSearchConfigStore from "@/store/searchConfiguration.store.";

type Props = {
    showArrow?: boolean,
    onLinkClicked: () => void,
}

export default function NewOrderButton({ showArrow = true, onLinkClicked }: Props) {
    const { setConfigDialogOpen, setShouldResetConfig } = UseSearchConfigStore();
    const navigate = useNavigate()

    function handleNewOrder() {
        onLinkClicked();
        setShouldResetConfig(true);
        setConfigDialogOpen(true);
        navigate({ to: "/client/orders" });
    }
    return (
        <div className="w-full" onClick={handleNewOrder}>
            <Button className="w-full text-base">
                Hacer Pedido
                {showArrow &&
                    <ChevronRight size={20} strokeWidth={3} className="ml-2" />
                }
            </Button>
        </div>
    )
}