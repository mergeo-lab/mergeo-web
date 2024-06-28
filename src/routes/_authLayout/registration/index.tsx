import { ACCOUNT } from '@/lib/constants'
import UseCompanyStore from '@/store/registration.store';
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/_authLayout/registration/')({
    component: () => <ChooseAccountType />
})

function ChooseAccountType() {
    const router = useRouter();
    const companyState = UseCompanyStore();

    const selectAccountType = (accountType: ACCOUNT.CLIENT | ACCOUNT.PROVIDER) => {
        companyState.saveAccountType(accountType);

        const redirectTo = '/registration/company';
        router.history.push(redirectTo, { replace: true });
    }

    return (
        <div className='w-full h-full flex justify-center items-center gap-5'>
            <div onClick={() => selectAccountType(ACCOUNT.CLIENT)} className='w-28 h-28 rounded border border-secondary-background flex justify-center items-center bg-secondary-background text-secondary-foreground cursor-pointer hover:bg-secondary-background/80'>
                <h2>Cliente</h2>
            </div>

            <div onClick={() => selectAccountType(ACCOUNT.PROVIDER)} className='w-28 h-28 rounded border border-secondary-background flex justify-center items-center bg-secondary-background text-secondary-foreground cursor-pointer hover:bg-secondary-background/80'>
                <h2>Proveedor</h2>
            </div>
        </div>
    )
}