import { Link } from 'react-scroll';
import { Link as RouterLink } from '@tanstack/react-router';
import HeroImage from '../../assets/hero-guy.png';
import { Button } from '@/components/ui/button';

export default function Hero() {
    return (
        <section id="hero" className="pt-28 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-indigo-50 to-indigo-100">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <h1 className="heading-xl mb-6 leading-tight">
                            Conectamos <span className="text-primary font-bold">compradores</span> con  <span className="text-primary font-bold">proveedores</span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-2">
                            Te ayudamos en el proceso de compra y venta. Te brindamos una herramineta facil de usar, intuitiva y pensada para vos.
                        </p>
                        <p className='text-primary text-md mb-8 font-thin'>
                            Proveedores y Compradores cada ves mas cerca.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <RouterLink to='/login'>
                                <Button>Empezar Ahora</Button>
                            </RouterLink>
                            <Button variant='ghost'>
                                <Link
                                    to="features"
                                    spy={true}
                                    smooth={true}
                                    offset={-70}
                                    duration={500}
                                    className="btn-secondary"
                                >
                                    Conoce Más
                                </Link>
                            </Button>
                        </div>
                        <div className="mt-10 flex items-center space-x-6">
                            <div className="flex -space-x-2">
                                <img src="https://randomuser.me/api/portraits/women/79.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                                <img src="https://randomuser.me/api/portraits/women/45.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                            </div>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">+2,500</span> proveedores activos en la plataforma
                            </p>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 flex justify-center md:justify-end">
                        <div className="relative">
                            <img
                                src={HeroImage}
                                alt="App Dashboard"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
