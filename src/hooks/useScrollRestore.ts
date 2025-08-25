import { useEffect, useRef } from 'react';

export function useScrollRestore(isOpen: boolean) {
    const scrollPositionRef = useRef<number>(0);

    useEffect(() => {
        if (isOpen) {
            // Guardar la posición actual del scroll
            scrollPositionRef.current = window.scrollY;
            
            // Agregar una clase CSS al body para mantener la posición
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPositionRef.current}px`;
            document.body.style.width = '100%';
        } else {
            // Restaurar la posición del scroll usando CSS
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            
            // Restaurar la posición del scroll
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        // Cleanup function
        return () => {
            if (!isOpen) {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
            }
        };
    }, [isOpen]);

    return {
        scrollPosition: scrollPositionRef.current,
        restoreScroll: () => {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
    };
}
