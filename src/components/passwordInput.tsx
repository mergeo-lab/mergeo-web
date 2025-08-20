import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { LuEye, LuEyeOff } from 'react-icons/lu';

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
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                onClick={togglePasswordVisibility}
            >
                {isPasswordVisible ? (
                    <LuEyeOff size={20} />
                ) : (
                    <LuEye size={20} />
                )}
            </button>
        </div>

    )
}

export default PasswordInput;
