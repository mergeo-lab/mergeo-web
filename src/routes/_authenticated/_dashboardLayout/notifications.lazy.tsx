import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/_dashboardLayout/notifications')({
    component: () => <div>Hello /_authenticated/_dashboardLayout/notifications!</div>
})