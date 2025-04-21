import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { ProductSchemaType } from "@/lib/schemas";
import { motion, usePresence } from "framer-motion";
import { ImageIcon, Trash2 } from "lucide-react";

export default function AnimatedRow({ product, handleRemove }: { product: ProductSchemaType; handleRemove: () => void }) {
    const [isPresent, safeToRemove] = usePresence();

    const transition = { type: "spring", stiffness: 500, damping: 50, mass: 1 };

    const animations = {
        layout: true,
        initial: false,
        style: {
            position: isPresent ? "static" : "absolute",
            top: 0,
            left: 0,
            right: 0,
        },
        animate: "in",
        exit: "out",
        whileTap: "tapped",
        variants: {
            in: { scaleY: 1, opacity: 1 },
            out: { scaleY: 0, opacity: 0, zIndex: -1 },
            tapped: { scale: 0.98, opacity: 0.5, transition: { duration: 0.1 } },
        },
        onAnimationComplete: () => {
            if (!isPresent) safeToRemove();
        },
        transition,
    };

    return (
        <motion.tr {...animations} className="origin-top" style={{ position: isPresent ? "static" : "absolute", top: 0, left: 0, right: 0 } as const}>
            <TableCell className="p-0 m-0 py-2">
                <div className="flex justify-start items-center w-full">
                    <div className="bg-border rounded p-4">
                        <ImageIcon size={50} className="text-white" />
                    </div>
                    <div className="flex flex-col ml-2">
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-muted font-thin text-sm">{product.brand}</div>
                    </div>
                </div>
            </TableCell>
            <TableCell className="text-center">{product.netContent}</TableCell>
            <TableCell className="text-center">{product.measurementUnit}</TableCell>
            <TableCell className="text-center">{product.price}</TableCell>
            <TableCell className="text-center">
                {product.netContent ? +product.price * product.netContent : 1}
            </TableCell>
            <TableCell>
                <Button
                    variant="ghost"
                    className="hover:text-destructive"
                    onClick={handleRemove}
                >
                    <Trash2 size={18} />
                </Button>
            </TableCell>
        </motion.tr>
    );
}
