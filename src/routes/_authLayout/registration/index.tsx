import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_authLayout/registration/')({
    component: () => <ChooseAccountType />
})

function ChooseAccountType() {
    return (
        <div className='w-full h-full flex justify-center items-center gap-5'>
            <Link search={{ type: 'client' }} to={'/registration/company'}>
                <div className='w-28 h-28 rounded border border-secondary-background flex justify-center items-center bg-secondary-background text-secondary-foreground cursor-pointer hover:bg-secondary-background/80'>
                    <h2>Cliente</h2>
                </div>
            </Link>
            <Link search={{ type: 'provider' }} to={'/registration/company'}>
                <div className='w-28 h-28 rounded border border-secondary-background flex justify-center items-center bg-secondary-background text-secondary-foreground cursor-pointer hover:bg-secondary-background/80'>
                    <h2>Proveedor</h2>
                </div>
            </Link>
        </div>
    )
}