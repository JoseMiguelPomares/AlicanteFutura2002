import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { ArrowUpCircleFill } from 'react-bootstrap-icons';

export const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Función para detectar cuando el usuario ha hecho scroll
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Función para hacer scroll hacia arriba
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Detectar si es un dispositivo móvil
    const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768);
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        window.addEventListener('resize', checkIfMobile);
        
        // Comprobar inicialmente
        checkIfMobile();
        
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    // Estilos para dispositivos móviles y escritorio
    const buttonStyle = {
        width: isMobile ? '40px' : '50px',
        height: isMobile ? '40px' : '50px',
        opacity: isMobile ? 0.6 : 0.9,
        zIndex: 1000
    };

    return (
        <>
            {isVisible && (
                <Button
                    onClick={scrollToTop}
                    variant="success"
                    className="position-fixed bottom-0 end-0 m-3 rounded-circle p-2 shadow-lg"
                    style={buttonStyle}
                    aria-label="Volver arriba"
                >
                    <ArrowUpCircleFill size={isMobile ? 18 : 24} />
                </Button>
            )}
        </>
    );
};