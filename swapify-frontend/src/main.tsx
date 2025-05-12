// Entrada principal de la aplicación

import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css' // Importa primero los estilos base de Bootstrap
import './index.css' // Importa luego tu CSS personalizado
import App from './App.tsx'

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
      <App />
  );
} else {
  console.error("No se encontró el elemento con id 'root'");
}

