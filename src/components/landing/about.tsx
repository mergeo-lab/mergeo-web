import { FiUsers, FiMap, FiShoppingBag } from 'react-icons/fi';
import historyImg from '../../assets/who-we-are.png';

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
            <div className="">
                <div className="text-center max-w-3xl mx-auto mb-16 container-custom">
                    <h2 className="heading-lg mb-6 text-primary font-black">¿Quiénes Somos?</h2>
                    <p className="text-md">
                        Somos una plataforma innovadora que transforma la manera en que compradores y vendedores interactúan en el mercado.
                        Nuestra misión es facilitar el comercio a través de tecnologías inteligentes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container-custom">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-gradient-to-b border-2 border-border rounded-2xl p-8 text-center transform transition-transform hover:scale-105">
                            <div className="flex justify-center mb-4">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl font-bold mb-2 text-secondary-background">{stat.value}</h3>
                            <p className="text-secondary-background">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center relative">
                    {/* <div className='h-full max-h-[562px] w-full max-w-[1350px] bg-no-repeat bg-top flex flex-col items-start' style={{ backgroundImage: `URL(${historyImg})` }}> */}
                    <div className='h-[562px] w-full max-w-[1350px] relative'>
                        <div className='absolute bottom-0 bg-no-repeat bg-top p-16' style={{ backgroundImage: `URL(${historyImg})` }}>
                            <div className='flex justify-start flex-col mt-32 mb-20 px-32 space-y-5'>
                                <h3 className="text-md font-black text-primary">Nuestra Historia</h3>
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
                        </div>
                    </div>
                    <div className='shadow-[0px_-5px_6px_2px_rgba(0,_0,_0,_0.2)] absolute -bottom-10 h-10 w-full'>

                    </div>
                </div>
            </div>
        </section >
    );
}