import { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { Link as RouterLink } from '@tanstack/react-router';
import { FiMenu, FiX } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import logoVertical from '../../assets/logo-vertical.svg'
import { cn } from '@/lib/utils';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navLinks = [
        { name: 'Inicio', to: 'hero' },
        { name: '¿Quiénes Somos?', to: 'about' },
        { name: '¿Qué Hacemos?', to: 'features' },
        { name: 'Contacto', to: 'contact' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-secondary-background shadow-md py-5' : 'bg-transparent py-5'}`}>
            <div className="container-custom py-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <img className='w-12 transition-all duration-300 mr-3' src={logoVertical} alt='logo' />
                        <div className={cn('flex flex-col text-nowrap text-secondary-background pt-1', {
                            "text-secondary-foreground": scrolled,
                        })}>
                            <h1 className='text-xl font-bold leading-none'>MERGEO</h1>
                            <h2 className='text-[.9rem] font-thin tracking-wide leading-none'>UNIENDO PUNTAS</h2>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                spy={true}
                                smooth={true}
                                offset={-70}
                                duration={500}
                                className={cn("text-gray-700 hover:text-primary font-medium cursor-pointer transition-colors", {
                                    'text-white': scrolled
                                })}
                            >
                                {link.name}
                            </Link>

                        ))}
                    </div>

                    <div className="hidden md:block">
                        <RouterLink to='/login'>
                            <Button>Empezar Ahora</Button>
                        </RouterLink>

                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-gray-700 hover:text-primary">
                            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-lg mt-2">
                    <div className="flex flex-col space-y-4 py-4 px-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                spy={true}
                                smooth={true}
                                offset={-70}
                                duration={500}
                                onClick={toggleMenu}
                                className="text-gray-700 hover:text-primary font-medium cursor-pointer transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <button className="btn-primary w-full mt-4">Empezar Ahora</button>
                    </div>
                </div>
            )}
        </nav>
    );
}
