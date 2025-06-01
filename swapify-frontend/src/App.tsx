"use client"

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
import PaginaContacto from "./pages/PaginaContacto"
import { AuthProvider } from "./contexts/AuthContext"
import { PaginaPorCategoria } from "./pages/PaginaPorCategoria"
import { PaginaChat } from "./pages/PaginaChat"
import { PaginaEditarPerfil } from "./pages/PaginaEditarPerfil"
import { ScrollToTopButton } from "./components/ScrollToTopButton"
import { NotificationProvider } from "./contexts/NotificationContext"
import { AdminRoute } from './components/AdminRoute';
import { PaginaAdminPanel } from './pages/PaginaAdminPanel';

import { useState, useEffect } from "react"
import { Button, Form } from "react-bootstrap"
import { FavoritesProvider } from "./contexts/FavoritesContext"
import { PaginaFavoritos } from "./pages/PaginaFavoritos"
import { PaginaComoFunciona } from "./pages/PaginaComoFunciona"
import { PaginaEditarProducto } from "./pages/PaginaEditarProducto"

// Componente principal de la aplicación
export const App: React.FC = () => {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <NotificationProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="d-flex flex-column min-vh-100">
              <BarraNavegacion />
              <main className="flex-grow-1">
                <Routes>
                  <Route path="/admin" element={<AdminRoute><PaginaAdminPanel /></AdminRoute>}/>
                  <Route path="/" element={<PaginaInicio />} />
                  <Route path="/perfil/:id" element={<PaginaPerfil />} />
                  <Route path="/editar-perfil" element={<PaginaEditarPerfil />} />
                  <Route path="/vender" element={<PaginaVender />} />
                  <Route path="/registro" element={<PaginaRegistro />} />
                  <Route path="/login" element={<PaginaLogin />} />
                  <Route path="/items/:id" element={<PaginaProducto />} />
                  <Route path="/editar-producto/:id" element={<PaginaEditarProducto />} />
                  <Route path="/busqueda" element={<PaginaBusqueda />} />
                  <Route path="/contacto" element={<PaginaContacto />} />
                  <Route path="/categoria/:categoria" element={<PaginaPorCategoria />} />
                  <Route path="/chat" element={<PaginaChat />} />
                  <Route path="/chat/:chatId" element={<PaginaChat />} />
                  <Route path="/favoritos" element={<PaginaFavoritos />} />
                  <Route path="/como-funciona" element={<PaginaComoFunciona />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <ScrollToTopButton />
            <CookieConsent />
          </BrowserRouter>
        </NotificationProvider>
      </FavoritesProvider>
    </AuthProvider>
  )
}

export default App

const CookieConsent = () => {
  const [show, setShow] = useState(false)
  const [consent, setConsent] = useState(() => localStorage.getItem("cookieConsent"))
  const [showCustomize, setShowCustomize] = useState(false)

  useEffect(() => {
    if (!consent) {
      setShow(true)
    }
  }, [consent])

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent", "accepted")
    setConsent("accepted")
    setShow(false)
  }

  const handleRejectAll = () => {
    localStorage.setItem("cookieConsent", "rejected")
    setConsent("rejected")
    setShow(false)
  }

  const handleCustomize = () => {
    setShowCustomize(true)
  }

  if (!show) return null

  return (
    <div className="fixed-bottom w-100 bg-white border-top" style={{ zIndex: 1050 }}>
      <div className="container-fluid p-3">
        <div className="row">
          <div className="col-12 mb-3">
            <p className="mb-0">
              Utilizamos cookies propias y de terceros para conocer los usos de nuestra tienda online y poder mejorarla,
              adaptar el contenido a tus gustos y personalizar nuestros anuncios, marketing y publicaciones en redes
              sociales. Puedes aceptarlas todas, rechazarlas o elegir tu configuración pulsando los botones
              correspondientes. Ten en cuenta que rechazar las cookies puede afectar a tu experiencia de compra. Para
              más información puedes consultar nuestra{" "}
              <a href="/docs/cookies_policy_es_ES-20241120.pdf" className="text-decoration-underline">
                Política de cookies
              </a>
            </p>
          </div>
          <div className="col-12">
            <div className="d-flex flex-wrap justify-content-end gap-2">
              <Button variant="outline-secondary" onClick={handleRejectAll}>
                RECHAZAR OPCIONALES
              </Button>
              <Button variant="outline-secondary" onClick={handleCustomize}>
                CONFIGURACIÓN DE COOKIES
              </Button>
              <Button variant="dark" onClick={handleAcceptAll}>
                ACEPTAR TODAS LAS COOKIES
              </Button>
            </div>
          </div>
        </div>

        {showCustomize && (
          <div className="mt-3 border-top pt-3">
            <h5>Personalizar Cookies</h5>
            <Form.Check type="switch" id="analisis" label="Cookies de análisis" />
            <Form.Check type="switch" id="funcionalidad" label="Cookies de funcionalidad" />
            <Form.Check type="switch" id="publicidad" label="Cookies de publicidad" />
          </div>
        )}
      </div>
    </div>
  )
}