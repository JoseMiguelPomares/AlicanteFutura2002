import type React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { PaginaInicio } from "./pages/PaginaInicio"
import { BarraNavegacion } from "./components/BarraNavegacion"
import { PaginaRegistro } from "./pages/PaginaRegistro"
import { PaginaLogin } from "./pages/PaginaLogin"
import { PaginaPerfil } from "./pages/PaginaPerfil"
import { PaginaProducto } from "./pages/PaginaProducto"
import { Footer } from "./components/Footer"
import { PaginaVender } from "./pages/PaginaVender"
import { ScrollToTop } from "./components/ScrollToTop"
import { PaginaBusqueda } from "./pages/PaginaBusqueda"
import { AuthProvider } from "./contexts/AuthContext"

// Componente principal de la aplicación
export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="d-flex flex-column min-vh-100">
          <BarraNavegacion />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<PaginaInicio />} />
              <Route path="/perfil/:id" element={<PaginaPerfil />} />
              <Route path="/vender" element={<PaginaVender />} />
              <Route path="/registro" element={<PaginaRegistro />} />
              <Route path="/login" element={<PaginaLogin />} />
              <Route path="/productos/:id" element={<PaginaProducto />} />
              <Route path="/busqueda" element={<PaginaBusqueda />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App