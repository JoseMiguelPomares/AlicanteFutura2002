// Con las SPA no se recarga completamente la página al clicar un enlace interno.
// Con este efecto, logramos que el scroll comience desde arriba cuando el usuario navega.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Restablece el scroll al tope
  }, [pathname]);

  return null;
};