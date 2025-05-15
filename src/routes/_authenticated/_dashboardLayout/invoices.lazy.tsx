import { useAuth } from '@/hooks'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/_dashboardLayout/invoices')({
  component: () => <Invoices />,
})

function Invoices() {
  const auth = useAuth()
  return <p>Hi {auth && auth.user?.name}!</p>

}