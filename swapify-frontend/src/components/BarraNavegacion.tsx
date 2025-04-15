"use client"

import type React from "react"

import { Link, useNavigate } from "react-router-dom"
import { Container, Navbar, Form, Nav, Button, Offcanvas, InputGroup } from "react-bootstrap"
import { Cart, Person, List, Search, Bell, BoxArrowInRight } from "react-bootstrap-icons"
import { useState } from "react"
import { useMediaQuery } from "react-responsive"
import Image from "react-bootstrap/Image"
import logo from "../assets/images/logosSwapify/logoNegroLargoFondoTransp.png"
import logoPequeno from "../assets/images/logosSwapify/logoNegroTransp.png" // Logo para móviles
import { BarraLateral } from "./BarraLateral"

// Importar el hook useAuth
import { useAuth } from "../contexts/AuthContext"

export const BarraNavegacion = () => {
  const [showSidebar, setShowSidebar] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const isMobile = useMediaQuery({ maxWidth: 640 }) // Pantallas pequeñas
  const navigate = useNavigate()

  // Añadir dentro de la función BarraNavegacion
  const { user, isAuthenticated, logout } = useAuth()

  // Manejar la búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/busqueda?q=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm("")
    }
  }

  return (
    <>
      {/* Barra Navegación PRINCIPAL con diseño mejorado */}
      <Navbar
        expand="lg"
        className="shadow-sm py-3"
        style={{
          background: "linear-gradient(90deg, #1a3c34 0%, #20b03d 100%)",
        }}
      >
        <Container>
          {/* Sección superior (logo, búsqueda y toggle en una fila) */}
          <div className="d-flex w-100 align-items-center gap-3">
            {/* Logo dinámico */}
            <Navbar.Brand as={Link} to="/" className="me-0 me-md-3">
              <Image
                src={isMobile ? logoPequeno : logo}
                alt="Swapify Logo"
                className="img-fluid"
                // Invertir colores para que el logo se vea bien en fondo oscuro
                style={
                  isMobile
                    ? { width: "70px", filter: "brightness(0) invert(1)" }
                    : { width: "100px", filter: "brightness(0) invert(1)" }
                }
              />
            </Navbar.Brand>

            {/* Barra de búsqueda mejorada */}
            <Form onSubmit={handleSearch} className="flex-grow-1 me-lg-4">
              <InputGroup>
                <Form.Control
                  type="search"
                  placeholder="Buscar productos, servicios o categorías..."
                  className="border-0 py-2"
                  aria-label="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="light" className="border-0" type="submit">
                  <Search size={18} />
                </Button>
              </InputGroup>
            </Form>

            {/* Toggle del menú (visible en móviles) */}
            <Navbar.Toggle
              onClick={() => setShowMenu(true)}
              aria-controls="navegacion-principal"
              className="border-0 shadow-none text-white"
            />
          </div>

          {/* Offcanvas SOLO en móviles */}
          <Navbar.Offcanvas
            id="navegacion-principal"
            show={showMenu}
            onHide={() => setShowMenu(false)}
            placement="end"
            className="d-lg-none"
          >
            <Offcanvas.Header closeButton className="border-bottom">
              <Offcanvas.Title className="fw-bold">Menú de Navegación</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="d-flex flex-column gap-3">
              {/* Botones principales */}
              <div className="d-flex flex-column gap-3">
                {isAuthenticated ? (
                  <>
                    <Button
                      as={Link as any}
                      to={`/perfil/${user?.id}`}
                      variant="success"
                      className="w-100 py-2 rounded-pill"
                      onClick={() => setShowMenu(false)}
                    >
                      <Person className="me-2" size={18} />
                      Mi Perfil
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="w-100 py-2 rounded-pill"
                      onClick={() => {
                        logout()
                        navigate('/');  // Redirect to home page after logout
                        setShowMenu(false)
                      }}
                    >
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <Button
                    as={Link as any}
                    to="/registro"
                    variant="success"
                    className="w-100 py-2 rounded-pill"
                    onClick={() => setShowMenu(false)}
                  >
                    <BoxArrowInRight className="me-2" size={18} />
                    Acceso / Registro
                  </Button>
                )}
                <Button
                  as={Link as any}
                  to={isAuthenticated ? "/vender" : "/login?redirect=/vender"}
                  variant="light"
                  className="rounded-pill px-4"
                  onClick={() => setShowMenu(false)}
                >
                  Vender
                </Button>
              </div>

              {/* Enlaces de navegación */}
              <div className="border-top border-bottom py-3 my-2">
                <Nav.Link as={Link} to="/contacto" className="py-2" onClick={() => setShowMenu(false)}>
                  Contacto
                </Nav.Link>
              </div>

              {/* Sección de perfil y créditos */}
              <div className="d-flex justify-content-between align-items-center mt-2">
                <Button variant="success" className="d-flex align-items-center gap-2 rounded-pill">
                  <Cart size={18} />
                  <span className="fw-bold">150 Créditos</span>
                </Button>
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>

          {/* NAVBAR NORMAL en pantallas grandes */}
          <Navbar.Collapse id="navegacion-principal" className="d-none d-lg-flex align-items-center gap-3">
            {/* Botones y secciones adicionales */}
            <Button
              as={Link as any}
              to={isAuthenticated ? "/vender" : "/login?redirect=/vender"}
              variant="light"
              className="w-100 py-2 rounded-pill"
              onClick={() => setShowMenu(false)}
            >
              Vender
            </Button>
            <div className="d-flex align-items-center ms-auto gap-4">
              <Nav.Link as={Link} to="/notificaciones" className="text-white position-relative">
                <Bell size={22} />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  2
                </span>
              </Nav.Link>
              {isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to={`/perfil/${user?.id}`} className="text-white">
                    <Person size={22} />
                  </Nav.Link>
                  <Button variant="outline-light" className="d-flex align-items-center gap-2 rounded-pill">
                    <Cart size={18} />
                    <span className="fw-bold">150 Créditos</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="rounded-pill"
                    onClick={() => {
                      logout();
                      navigate('/');  // Redirect to home page after logout
                    }}
                  >
                    Salir
                  </Button>
                </>
              ) : (
                <Button
                  as={Link as any}
                  to="/login"
                  variant="outline-light"
                  className="d-flex align-items-center gap-2 rounded-pill"
                >
                  <BoxArrowInRight size={18} />
                  <span className="fw-bold">Iniciar Sesión</span>
                </Button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Barra secundaria mejorada */}
      <div className="py-2 border-bottom" style={{ backgroundColor: "#f8f9fa" }}>
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            {/* Botón para toggle de la sidebar */}
            <Button
              variant="link"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-dark fw-bold p-2 text-decoration-none d-flex align-items-center"
              aria-label="Abrir categorías"
            >
              <List size={20} className="me-2" />
              Categorías
            </Button>

            {/* Resto de los enlaces */}
            <div className="d-none d-md-flex gap-5">
              <Nav.Link as={Link} to="/contacto" className="text-dark fw-bold">
                Contacto
              </Nav.Link>
            </div>

            {/* Botón de acceso/registro (visible solo en PANTALLAS GRANDES) */}
            {isAuthenticated && (
              <Button
                as={Link as any}
                to={`/perfil/${user?.id}`}
                variant="success"
                size="sm"
                className="d-none d-md-flex align-items-center gap-2 rounded-pill px-3"
              >
                <Person size={16} />
                Mi Perfil
              </Button>
            )}
          </div>
        </Container>
      </div>

      {/* Barra Lateral */}
      <BarraLateral mostrar={showSidebar} alCerrar={() => setShowSidebar(false)} />
    </>
  )
}

