import { FiUsers, FiMap, FiShoppingBag } from 'react-icons/fi';
import historyImg from '../../assets/historia.webp';

export default function About() {
    const stats = [
        {
            icon: <FiUsers className="w-10 h-10 text-primary" />,
            value: '15k+',
            label: 'Usuarios activos'
        },
        {
            icon: <FiMap className="w-10 h-10 text-primary" />,
            value: '200+',
            label: 'Zonas de entrega'
        },
        {
            icon: <FiShoppingBag className="w-10 h-10 text-primary" />,
            value: '50k+',
            label: 'Productos'
        },
    ];

    return (
        <section id="about" className="section bg-white">
            <div className="container-custom">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="heading-lg mb-6 text-primary font-black">¿Quiénes Somos?</h2>
                    <p className="text-md">
                        Somos una plataforma innovadora que transforma la manera en que compradores y vendedores interactúan en el mercado.
                        Nuestra misión es facilitar el comercio a través de tecnologías inteligentes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-gradient-to-b from-indigo-50 to-indigo-200 rounded-2xl p-8 text-center transform transition-transform hover:scale-105">
                            <div className="flex justify-center mb-4">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                            <p className="">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-white rounded shadow overflow-hidden">
                    <div className="flex">
                        <div className='space-y-6 p-8 md:p-12 w-full'>
                            <h3 className="text-md font-thin text-primary">Nuestra Historia</h3>
                            <p>
                                Nacimos con la visión de resolver el problema de conexión entre compradores y vendedores mayoristas.
                                Identificamos que la tarea de comprar a proveedores suele ser algo tedioso y complicado. Muchas empresas no
                                tienen una forma ordenada y facil de comprar u ofrecer productos de manera eficiente.
                            </p>
                            <p>
                                Hoy, nuestra plataforma permite a los proveedores definir sus áreas de entrega de manera
                                personalizada, tener sus productos ordenados, y recibir pedidos de manera rápida y eficiente.
                            </p>
                        </div>
                        <div className='w-full relative'>
                            <div className='bg-gradient-to-r from-white to-white/0 absolute h-full w-32'></div>
                            <img
                                src={historyImg}
                                alt="Nuestro equipo"
                                className="h-full aspect-video bg-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}