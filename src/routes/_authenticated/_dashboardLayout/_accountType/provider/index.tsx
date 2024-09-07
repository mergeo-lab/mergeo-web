import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/')({
  component: () => <div>Hello /_authenticated/_dashboardLayout/provider/!</div>
})