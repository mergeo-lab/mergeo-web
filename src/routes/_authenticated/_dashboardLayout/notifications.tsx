import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_dashboardLayout/notifications')({
    component: () => <div>Hello /_authenticated/_dashboardLayout/notifications!</div>
})