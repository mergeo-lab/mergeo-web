import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQItem {
    question: string;
    answer: string;
}

const faqItems: FAQItem[] = [
    {
        question: "¿Qué es Mergeo?",
        answer: "Mergeo es una plataforma que conecta a proveedores y clientes, facilitando la gestión de pedidos, inventario y relaciones comerciales. Nuestro objetivo es simplificar y optimizar el proceso de compra-venta entre empresas."
    },
    {
        question: "¿Cómo puedo registrarme como proveedor?",
        answer: "Para registrarte como proveedor, haz clic en 'Empezar Ahora' y selecciona la opción 'Registrarse como Proveedor'. Necesitarás proporcionar información de tu empresa, documentos legales y detalles de contacto. Nuestro equipo revisará tu solicitud y te contactará para completar el proceso."
    },
    {
        question: "¿Cómo puedo registrarme como cliente?",
        answer: "Para registrarte como cliente, haz clic en 'Empezar Ahora' y selecciona la opción 'Registrarse como Cliente'. Necesitarás proporcionar información de tu empresa y detalles de contacto. Una vez aprobado, podrás comenzar a realizar pedidos a los proveedores registrados."
    },
    {
        question: "¿Cómo funciona el sistema de pedidos?",
        answer: "El sistema de pedidos es simple y eficiente: 1) Explora el catálogo de productos de los proveedores, 2) Agrega productos a tu lista de pedidos, 3) Revisa y confirma tu pedido, 4) El proveedor recibirá la notificación y procesará tu pedido, 5) Recibirás actualizaciones sobre el estado de tu pedido en tiempo real."
    },
    {
        question: "¿Cómo se manejan los precios y descuentos?",
        answer: "Los precios son establecidos por cada proveedor y pueden variar según el volumen de compra. Los proveedores pueden ofrecer descuentos especiales a clientes específicos. Todos los precios y descuentos son visibles en la plataforma antes de realizar el pedido."
    },
    {
        question: "¿Qué métodos de pago están disponibles?",
        answer: "Actualmente aceptamos transferencias bancarias, tarjetas de crédito/débito y otros métodos de pago electrónico. Los métodos disponibles pueden variar según el proveedor. Los detalles de pago se muestran durante el proceso de checkout."
    },
    {
        question: "¿Cómo se manejan las devoluciones?",
        answer: "Las políticas de devolución varían según el proveedor. Cada proveedor tiene sus propias condiciones que son visibles en su perfil. En general, las devoluciones deben ser solicitadas dentro de un plazo específico y el producto debe estar en su estado original."
    },
    {
        question: "¿Cómo puedo contactar al soporte?",
        answer: "Puedes contactar a nuestro equipo de soporte a través del chat en vivo en la plataforma, por correo electrónico a soporte@mergeo.com, o llamando a nuestro número de atención al cliente. Estamos disponibles de lunes a viernes de 9:00 a 18:00."
    },
    {
        question: "¿Es seguro realizar transacciones en Mergeo?",
        answer: "Sí, la seguridad es nuestra prioridad. Utilizamos encriptación de datos, protocolos seguros y cumplimos con las regulaciones de protección de datos. Todas las transacciones son monitoreadas y protegidas contra fraudes."
    },
    {
        question: "¿Puedo personalizar mi perfil de empresa?",
        answer: "Sí, tanto proveedores como clientes pueden personalizar sus perfiles. Los proveedores pueden agregar su logo, descripción de la empresa, catálogo de productos y políticas comerciales. Los clientes pueden configurar sus preferencias de compra y detalles de facturación."
    }
];

interface FAQDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FAQDialog({ isOpen, onClose }: FAQDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Preguntas Frecuentes
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto p-6">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqItems.map((item, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border rounded-lg px-4"
                            >
                                <AccordionTrigger className="text-left font-medium py-4 hover:no-underline">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground pb-4">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </DialogContent>
        </Dialog>
    )
} 