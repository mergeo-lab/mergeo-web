import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks'


export const Route = createFileRoute('/_authenticated/dashboard')({
    component: DashboardPage,
})

function DashboardPage() {
    const auth = useAuth()

    return (
        <section className="grid gap-2 p-2">
            <p>Hi {auth && auth.user?.name}!</p>
            <p>You are currently on the dashboard route.</p>
        </section>
    )
}
