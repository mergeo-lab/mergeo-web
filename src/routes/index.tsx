import About from '@/components/landing/about'
import Contact from '@/components/landing/contact'
import Features from '@/components/landing/features'
import Footer from '@/components/landing/footer'
import Hero from '@/components/landing/hero'
import Navbar from '@/components/landing/navBar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: () => <Landing />
})

export default function Landing() {
    return (
        <div className="min-h-screen bg-light w-full">
            <Navbar />
            <Hero />
            <About />
            <Features />
            <Contact />
            <Footer />
        </div>
    )
}