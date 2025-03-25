// Importaciones necesarias
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PaginaInicio } from "./pages/PaginaInicio";
import { BarraNavegacion } from "./components/BarraNavegacion";
// import { PaginaRegistro } from "./pages/PaginaRegistro";
// import { PaginaLogin } from "./pages/PaginaLogin";
// import { PaginaPerfil } from "./pages/PaginaPerfil";
import { PaginaProducto } from "./pages/PaginaProducto";
import { Footer } from "./components/Footer";

// Componente principal de la aplicación
export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <BarraNavegacion />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<PaginaInicio />} />
            {/* <Route path="/registro" element={<PaginaRegistro />} /> */}
            {/* <Route path="/login" element={<PaginaLogin />} /> */}
            {/* <Route path="/perfil" element={<PaginaPerfil />} /> */}
            <Route path="/productos/:id" element={<PaginaProducto />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;


