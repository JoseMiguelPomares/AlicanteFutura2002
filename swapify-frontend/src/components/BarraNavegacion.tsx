"use client"

import { Link } from "react-router-dom"
import { Container, Navbar, Form, Nav, Button, Offcanvas, InputGroup } from "react-bootstrap"
import { Cart, Person, List, Search, Bell, BoxArrowInRight } from "react-bootstrap-icons"
import { useState } from "react"
import { useMediaQuery } from "react-responsive"
import Image from "react-bootstrap/Image"
import logo from "../assets/images/logosSwapify/logoNegroLargoFondoTransp.png"
import logoPequeno from "../assets/images/logosSwapify/logoNegroTransp.png" // Logo para móviles
import { BarraLateral } from "./BarraLateral"

export const BarraNavegacion = () => {
  const [showSidebar, setShowSidebar] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const isMobile = useMediaQuery({ maxWidth: 640 }) // Pantallas pequeñas

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
                style={{ height: "45px", filter: "brightness(0) invert(1)" }}
              />
            </Navbar.Brand>

            {/* Barra de búsqueda mejorada */}
            <InputGroup className="flex-grow-1 me-lg-4">
              <Form.Control
                type="search"
                placeholder="Buscar productos, servicios o categorías..."
                className="border-0 py-2"
                aria-label="Buscar"
              />
              <Button variant="light" className="border-0">
                <Search size={18} />
              </Button>
            </InputGroup>

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
                <Button
                  variant="outline-success"
                  className="w-100 py-2 rounded-pill"
                  onClick={() => setShowMenu(false)}
                >
                  Vender
                </Button>
              </div>

              {/* Enlaces de navegación */}
              <div className="border-top border-bottom py-3 my-2">
                <Nav.Link as={Link} to="/ofertas" className="py-2" onClick={() => setShowMenu(false)}>
                  Ofertas
                </Nav.Link>
                <Nav.Link as={Link} to="/contacto" className="py-2" onClick={() => setShowMenu(false)}>
                  Contacto
                </Nav.Link>
              </div>

              {/* Sección de perfil y créditos */}
              <div className="d-flex justify-content-between align-items-center mt-2">
                <Nav.Link
                  as={Link}
                  to="/perfil"
                  className="text-dark d-flex align-items-center gap-2"
                  onClick={() => setShowMenu(false)}
                >
                  <Person size={22} />
                  <span>Mi Perfil</span>
                </Nav.Link>
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
            <Button variant="light" className="rounded-pill px-4">
              Vender
            </Button>
            <div className="d-flex align-items-center ms-auto gap-4">
              <Nav.Link as={Link} to="/notificaciones" className="text-white position-relative">
                <Bell size={22} />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  2
                </span>
              </Nav.Link>
              <Nav.Link as={Link} to="/perfil" className="text-white">
                <Person size={22} />
              </Nav.Link>
              <Button variant="outline-light" className="d-flex align-items-center gap-2 rounded-pill">
                <Cart size={18} />
                <span className="fw-bold">150 Créditos</span>
              </Button>
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
              <Nav.Link as={Link} to="/ofertas" className="text-dark fw-bold">
                Ofertas
              </Nav.Link>
              <Nav.Link as={Link} to="/contacto" className="text-dark fw-bold">
                Contacto
              </Nav.Link>
            </div>

            {/* Botón de acceso/registro (visible solo en pantallas grandes) */}
            <Button
              as={Link as any}
              to="/registro"
              variant="success"
              size="sm"
              className="d-none d-md-flex align-items-center gap-2 rounded-pill px-3"
            >
              <BoxArrowInRight size={16} />
              Acceder
            </Button>
          </div>
        </Container>
      </div>

      {/* Barra Lateral */}
      <BarraLateral mostrar={showSidebar} alCerrar={() => setShowSidebar(false)} />
    </>
  )
}

