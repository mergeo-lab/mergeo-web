import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/client/')({
  component: () => <div>Hello /_authenticated/_dashboardLayout/client/!</div>
})