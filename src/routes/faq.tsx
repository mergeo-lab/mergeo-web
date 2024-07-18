import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/faq')({
    component: () => <div>Hello /faq!</div>
})