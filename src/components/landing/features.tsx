import { cn } from '@/lib/utils';
import FeatureImage1 from '../../assets/feature-1.png';
import FeatureImage2 from '../../assets/feature-2.png';
import FeatureImage3 from '../../assets/feature-3.png';

export default function Features() {
    const features = [
        {
            id: 1,
            title: "Definición de Áreas de Entrega",
            description: "Los proveedores pueden establecer sus zonas de entrega de manera personalizada, dibujando en un mapa interactivo las áreas donde ofrecen sus servicios.",
            image: FeatureImage1,
            reverse: true
        },
        {
            id: 2,
            title: "Catálogo Personalizado",
            description: "Los compradores ven únicamente los productos disponibles en su ubicación, eliminando la frustración de encontrar productos que no pueden adquirir.",
            image: FeatureImage2,
            reverse: false
        },
        {
            id: 3,
            title: "Gestión de Inventario",
            description: "Los proveedores pueden gestionar fácilmente su inventario, actualizar precios y recibir notificaciones de nuevos pedidos en tiempo real.",
            image: FeatureImage3,
            reverse: true
        }
    ];

    return (
        <section id="features" className="section bg-gradient-to-br from-indigo-50 to-indigo-100">
            <div className="container-custom">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="heading-lg mb-6 text-primary font-black">¿Qué Hacemos?</h2>

                    <p className="text-md">
                        Nuestra plataforma ofrece herramientas innovadoras para facilitar el proceso de compra y venta
                        Estas son algunas de nuestras características principales:
                    </p>
                </div>

                <div className="space-y-24">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className={cn('flex gap-2 items-center', {
                                'flex-row-reverse': feature.reverse
                            })}
                        >
                            <div>
                                <h3 className="text-md mb-4">{feature.title}</h3>
                                <p className="text-gray-600 mb-6">{feature.description}</p>
                            </div>
                            <div className="w-full">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-8 md:p-12 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-3xl font-bold mb-6">Comienza a expandir tu negocio</h3>
                            <p className="mb-6 opacity-90">
                                Únete a los miles de proveedores que ya están ampliando su alcance y aumentando sus ventas con nuestra plataforma.
                            </p>
                            <button className="bg-white text-indigo-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300">
                                Regístrate como Proveedor
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
                                    <div className="font-bold text-3xl mb-2">+45%</div>
                                    <p className="text-sm opacity-90">Incremento promedio en ventas</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
                                    <div className="font-bold text-3xl mb-2">+60%</div>
                                    <p className="text-sm opacity-90">Nuevos clientes alcanzados</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
                                    <div className="font-bold text-3xl mb-2">-30%</div>
                                    <p className="text-sm opacity-90">Reducción en costos logísticos</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
                                    <div className="font-bold text-3xl mb-2">24/7</div>
                                    <p className="text-sm opacity-90">Disponibilidad de la plataforma</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}