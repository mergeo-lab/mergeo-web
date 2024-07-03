import { useAuth } from '@/hooks'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_dashboardLayout/invoices')({
  component: () => <Invoices />,
})

function Invoices() {
  const auth = useAuth()
  return <p>Hi {auth && auth.user?.name}!</p>

}