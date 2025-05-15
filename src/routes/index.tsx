
import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

const About = React.lazy(() => import('@/components/landing/about'));
const Contact = React.lazy(() => import('@/components/landing/contact'));
const Features = React.lazy(() => import('@/components/landing/features'));
const Footer = React.lazy(() => import('@/components/landing/footer'));
const Hero = React.lazy(() => import('@/components/landing/hero'));
const Navbar = React.lazy(() => import('@/components/landing/navBar'));

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