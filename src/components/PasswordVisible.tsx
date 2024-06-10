/* eslint-disable no-unused-vars */
import { Eye, EyeOff } from 'lucide-react';

type PasswordVisibleProps = {
    isPasswordVisible: boolean,
    togglePasswordVisibility: (e: React.MouseEvent) => void;
};

function PasswordVisible({ isPasswordVisible, togglePasswordVisibility }: PasswordVisibleProps) {
    return (
        <button
            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
            onClick={togglePasswordVisibility}
        >
            {isPasswordVisible ? (
                <Eye size={20} />
            ) : (
                <EyeOff size={20} />
            )}
        </button>
    )
}

export default PasswordVisible;
