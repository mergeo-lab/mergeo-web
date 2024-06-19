
type Props = {
    children: React.ReactNode
}

export function CardHeader({ children }: Props) {
    return (
        <div className='py-5 px-5 md:px-16 border-b'>
            {children}
        </div>
    )
}

export type CardHeaderType = typeof CardHeader;