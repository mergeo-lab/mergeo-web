import { createLazyFileRoute, Link } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
    component: Index,
})

function Index() {
    return (
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
    )
}
