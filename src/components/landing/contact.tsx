
import { FiMail, FiMapPin, FiPhoneCall } from 'react-icons/fi';

export default function Contact() {
    return (
        <section id="contact" className="section bg-white">
            <div className="container-custom">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="heading-lg mb-6">Contacto</h2>
                    <p className="text-lg text-gray-600">
                        ¿Tienes alguna pregunta o comentario? Nos encantaría saber de ti.
                        Completa el formulario a continuación o utiliza alguno de nuestros canales de contacto.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-gray-50 p-8 rounded-2xl">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Envíanos un mensaje</h3>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Tu nombre"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="tu@email.com"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                                <input
                                    type="text"
                                    id="subject"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="¿De qué se trata?"
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Tu mensaje..."
                                ></textarea>
                            </div>
                            <button type="submit" className="btn-primary w-full">Enviar Mensaje</button>
                        </form>
                    </div>

                    <div>
                        <div className="mb-10">
                            <h3 className="text-2xl font-bold mb-6 text-gray-800">Información de Contacto</h3>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                                        <FiMail className="text-primary text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Email</h4>
                                        <a href="mailto:contacto@miapp.com" className="text-gray-600 hover:text-primary">contacto@miapp.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                                        <FiPhoneCall className="text-primary text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Teléfono</h4>
                                        <a href="tel:+123456789" className="text-gray-600 hover:text-primary">+1 (234) 567-89</a>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                                        <FiMapPin className="text-primary text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Ubicación</h4>
                                        <p className="text-gray-600">Av. Principal 123, Ciudad</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-gray-800">Preguntas Frecuentes</h3>
                            <div className="space-y-4">
                                <details className="group border-b pb-4">
                                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                        <span>¿Cómo funciona el sistema de áreas de entrega?</span>
                                        <span className="transition group-open:rotate-180">+</span>
                                    </summary>
                                    <p className="text-gray-600 mt-3">
                                        Los proveedores pueden definir sus propias áreas de entrega dibujando zonas en un mapa interactivo.
                                        Los compradores solo verán productos de proveedores que entregan en su ubicación.
                                    </p>
                                </details>
                                <details className="group border-b pb-4">
                                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                        <span>¿Cuánto cuesta usar la plataforma?</span>
                                        <span className="transition group-open:rotate-180">+</span>
                                    </summary>
                                    <p className="text-gray-600 mt-3">
                                        Ofrecemos varios planes, desde uno gratuito con funcionalidades básicas hasta planes premium con
                                        características avanzadas. Visita nuestra sección de precios para más detalles.
                                    </p>
                                </details>
                                <details className="group border-b pb-4">
                                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                        <span>¿Cómo me registro como proveedor?</span>
                                        <span className="transition group-open:rotate-180">+</span>
                                    </summary>
                                    <p className="text-gray-600 mt-3">
                                        Simplemente haz clic en "Regístrate como Proveedor" en nuestra página, completa el formulario
                                        con la información de tu negocio y comienza a configurar tus áreas de entrega y productos.
                                    </p>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
