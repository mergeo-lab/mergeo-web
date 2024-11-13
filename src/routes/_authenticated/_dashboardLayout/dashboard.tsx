import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_dashboardLayout/dashboard')({
    component: () => <Dashboard />,
})

export default function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}