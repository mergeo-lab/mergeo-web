import { Link } from 'react-scroll';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h3 className="text-xl font-bold mb-4">MiApp</h3>
                        <p className="text-gray-400 mb-4">
                            Conectando compradores y proveedores locales de manera inteligente y eficiente.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FiFacebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FiTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FiInstagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FiLinkedin size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="hero"
                                    spy={true}
                                    smooth={true}
                                    offset={-70}
                                    duration={500}
                                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="about"
                                    spy={true}
                                    smooth={true}
                                    offset={-70}
                                    duration={500}
                                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    ¿Quiénes Somos?
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="features"
                                    spy={true}
                                    smooth={true}
                                    offset={-70}
                                    duration={500}
                                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    ¿Qué Hacemos?
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="contact"
                                    spy={true}
                                    smooth={true}
                                    offset={-70}
                                    duration={500}
                                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Recursos</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Centro de Ayuda</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Documentación API</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Guías de Usuario</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Casos de Éxito</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Términos de Servicio</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Política de Privacidad</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">GDPR</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 text-center md:flex md:justify-between md:text-left">
                    <p className="text-gray-400 mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} MiApp. Todos los derechos reservados.
                    </p>
                    <div className="flex justify-center md:justify-end space-x-6">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                            Español
                        </a>
                        <span className="text-gray-600">|</span>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                            English
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}