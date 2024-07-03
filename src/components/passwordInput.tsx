/* eslint-disable no-unused-vars */
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
    fieldName: string,
};

function PasswordInput({ fieldName }: Props) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { register } = useFormContext();

    const togglePasswordVisibility = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsPasswordVisible(!isPasswordVisible);
    }

    return (
        <div className='relative'>
            <Input type={isPasswordVisible ? "text" : "password"} {...register(fieldName)} />
            <button
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                onClick={togglePasswordVisibility}
            >
                {isPasswordVisible ? (
                    <EyeOff size={20} />
                ) : (
                    <Eye size={20} />
                )}
            </button>
        </div>

    )
}

export default PasswordInput;
