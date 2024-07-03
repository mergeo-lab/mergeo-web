import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createLazyFileRoute, Link } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/_dashboardLayout/')({
    component: Index,
})

function Index() {
    return (
        <>
            <div className="p-2">
                <h3>Welcome Home!</h3>
                <ul className="py-2 flex gap-2">
                    <li>
                        <Link
                            to="/dashboard"
                            className="hover:underline data-[status='active']:font-semibold"
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/invoices"
                            className="hover:underline data-[status='active']:font-semibold"
                        >
                            Invoices
                        </Link>
                    </li>
                </ul>
            </div>
            <div className='ml-10 flex gap-2 border p-4 rounded w-fit shadow'>
                <Button variant="default">Primary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
            </div>
            <div className='m-10 flex gap-2 border p-4 rounded w-fit shadow-lg'>
                <Input type="text" placeholder='Type something' />
            </div>
        </>
    )
}
