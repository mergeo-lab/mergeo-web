import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_dashboardLayout/faq')({
  component: () => <div>Hello /_authenticated/_dashboardLayout/faq!</div>
})