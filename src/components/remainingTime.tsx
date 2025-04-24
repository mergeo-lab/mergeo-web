import { useEffect, useState } from 'react';
import { formatDistanceStrict, isPast, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

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

            setRemaining(distance);
        };

        updateTime(); // Initial call

        const interval = setInterval(updateTime, 10 * 60 * 1000); // 10 minutes

        return () => clearInterval(interval);
    }, [targetDate]);

    console.log(remaining);
    return remaining;
}