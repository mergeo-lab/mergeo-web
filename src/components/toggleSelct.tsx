
interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    // You can add any custom props here if needed
    variant?: 'selected' | 'normal'; // Optional custom prop
    onClick: () => void
}

const ToggleSelect: React.FC<CustomButtonProps> = ({
    children,
    variant = 'normal',
    className,
    onClick,
    ...props
}) => {
    const variantClass =
        variant === 'selected'
            ? 'bg-white border-primary text-primary hover:bg-primary/5'
            : 'bg-white text-foreground hover:bg-accent';

    return (
        <button
            onClick={onClick}
            className={`text-sm border-border border font-bold px-4 py-2 rounded transition-all ${variantClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default ToggleSelect;