import { useEffect, useState } from 'react';
import { formatDistanceStrict, isPast, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { LuAlarmClock } from 'react-icons/lu';

export default function RemainingTime({ time }: { time: string }) {
    const targetDate = parseISO(time);
    const [remaining, setRemaining] = useState('');

    useEffect(() => {
        const updateTime = () => {
            if (isPast(targetDate)) {
                setRemaining('Finalizado');
                return;
            }

            const distance = formatDistanceStrict(new Date(), targetDate, {
                locale: es,
            });

            setRemaining("expira en " + distance);
        };

        updateTime(); // Initial call

        const interval = setInterval(updateTime, 10 * 60 * 1000); // 10 minutes

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="flex items-center text-sm text-gray-500">
            <LuAlarmClock className="mr-1 h-3 w-3" />
            {remaining}
        </div>
    );
}