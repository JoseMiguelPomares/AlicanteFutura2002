"use client"

import type React from "react"
import { useState } from "react"
import { Navbar, Container, Form, InputGroup, Button, Nav, Offcanvas, Image, Badge } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import {
  Search,
  Bell,
  Person,
  BoxArrowInRight,
  Cart,
  List,
  Laptop,
  Handbag,
  House,
  Bicycle,
  InfoCircle,
  Envelope,
  Heart,
} from "react-bootstrap-icons"
import { useMediaQuery } from "react-responsive"
import logo from "../assets/images/logosSwapify/logoNegroLargoFondoTransp.png"
import logoPequeno from "../assets/images/logosSwapify/logoNegroTransp.png" // Logo para móviles
import { BarraLateral } from "./BarraLateral"
import { useAuth } from "../contexts/AuthContext"
import { useFavorites } from "../contexts/FavoritesContext"
import { useNotifications } from "../contexts/NotificationContext"
import { NotificationDropdown } from "./NotificationDropDown"

export const BarraNavegacion = () => {
  const [showSidebar, setShowSidebar] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const isMobile = useMediaQuery({ maxWidth: 640 }) // Pantallas pequeñas
  const navigate = useNavigate()
  const { favorites } = useFavorites()
  const { unreadCount } = useNotifications()

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

  // Categorías destacadas para la barra secundaria
  const featuredCategories = [
    { name: "Tecnología", icon: <Laptop className="me-1" />, path: "/categoria/tecnología" },
    { name: "Ropa", icon: <Handbag className="me-1" />, path: "/categoria/ropa" },
    { name: "Hogar", icon: <House className="me-1" />, path: "/categoria/hogar" },
    { name: "Deporte", icon: <Bicycle className="me-1" />, path: "/categoria/deporte" },
  ]

  return (
    <>
      {/* Barra Navegación PRINCIPAL con diseño mejorado */}
      <Navbar
        expand="lg"
        className="shadow py-3"
        style={{
          background: "linear-gradient(90deg, #1a3c34 0%, #20b03d 100%)",
        }}
      >
        <Container>
          {/* Sección superior (logo, búsqueda y toggle en una fila) */}
          <div className="d-flex w-100 align-items-center gap-3">
            {/* Logo dinámico */}
            <Navbar.Brand as={Link} to="/" className="me-0 me-md-3 d-flex align-items-center">
              <Image
                src={isMobile ? logoPequeno : logo}
                alt="Swapify Logo"
                className="img-fluid"
                style={
                  isMobile
                    ? { width: "70px", filter: "brightness(0) invert(1)" }
                    : { width: "120px", filter: "brightness(0) invert(1)" }
                }
              />
            </Navbar.Brand>

            {/* Barra de búsqueda mejorada */}
            <Form onSubmit={handleSearch} className="flex-grow-1 me-lg-4">
              <InputGroup>
                <Form.Control
                  type="search"
                  placeholder="Buscar productos, servicios o categorías..."
                  className="border-0 py-2 shadow-sm"
                  aria-label="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="light" className="border-0 shadow-sm" type="submit">
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
                      className="w-100 py-2 rounded-pill d-flex align-items-center justify-content-center"
                      onClick={() => setShowMenu(false)}
                    >
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl || "/placeholder.svg"}
                          alt={user.name}
                          className="rounded-circle me-2"
                          style={{ width: "18px", height: "18px", objectFit: "cover" }}
                        />
                      ) : (
                        <Person className="me-2" size={18} />
                      )}
                      Mi Perfil
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="w-100 py-2 rounded-pill"
                      onClick={() => {
                        logout()
                        navigate("/") // Redirect to home page after logout
                        setShowMenu(false)
                      }}
                    >
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <Button
                    as={Link as any}
                    to="/login"
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
                  to={isAuthenticated ? "/vender" : "/login?redirect=vender"}
                  variant="light"
                  className="rounded-pill px-4"
                  onClick={() => setShowMenu(false)}
                >
                  Vender
                </Button>
              </div>

              {/* Enlaces de navegación */}
              <div className="border-top border-bottom py-3 my-2">
                <Nav.Link
                  as={Link}
                  to="/favoritos"
                  className="py-2 d-flex align-items-center"
                  onClick={() => setShowMenu(false)}
                >
                  <Heart className="me-2" size={18} />
                  Favoritos
                  {favorites.length > 0 && (
                    <Badge bg="danger" pill className="ms-2">
                      {favorites.length}
                    </Badge>
                  )}
                </Nav.Link>
                {/* Notificaciones en el menú móvil */}
                {isAuthenticated && (
                  <Nav.Link
                    as={Link}
                    to="/chat"
                    className="py-2 d-flex align-items-center"
                    onClick={() => setShowMenu(false)}
                  >
                    <Bell className="me-2" size={18} />
                    Notificaciones
                    {unreadCount > 0 && (
                      <Badge bg="danger" pill className="ms-2">
                        {unreadCount}
                      </Badge>
                    )}
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/contacto" className="py-2" onClick={() => setShowMenu(false)}>
                  Contacto
                </Nav.Link>
                <Nav.Link as={Link} to="/como-funciona" className="py-2" onClick={() => setShowMenu(false)}>
                  Cómo Funciona
                </Nav.Link>
                <Nav.Link as={Link} to="/ayuda" className="py-2" onClick={() => setShowMenu(false)}>
                  Ayuda
                </Nav.Link>
              </div>

              {/* Sección de perfil y créditos */}
              <div className="d-flex justify-content-between align-items-center mt-2">
                {isAuthenticated && user?.credits !== undefined && (
                  <Button 
                    variant="success" 
                    size="sm"
                    className="d-flex align-items-center gap-2 rounded-pill py-1"
                  >
                    <Cart size={16} />
                    <span className="fw-bold small">{user.credits} Créditos</span>
                  </Button>
                )}
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>

          {/* NAVBAR NORMAL en pantallas grandes */}
          <Navbar.Collapse id="navegacion-principal" className="d-none d-lg-flex align-items-center gap-3">
            {/* Botones y secciones adicionales */}
            <Button
              as={Link as any}
              to={isAuthenticated ? "/vender" : "/login?redirect=vender"}
              variant="light"
              className="py-2 rounded-pill px-4 fw-bold"
              onClick={() => setShowMenu(false)}
            >
              Vender
            </Button>
            <div className="d-flex align-items-center ms-auto gap-4">
              <Nav.Link as={Link} to="/favoritos" className="text-white position-relative">
                <Heart size={22} />
                {favorites.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {favorites.length}
                  </span>
                )}
              </Nav.Link>

              {/* Reemplazamos el icono de notificaciones con nuestro componente NotificationDropdown */}
              {isAuthenticated && <NotificationDropdown />}

              {isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to={`/perfil/${user?.id}`} className="text-white d-flex align-items-center">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl || "/placeholder.svg"}
                        alt={user.name}
                        className="rounded-circle"
                        style={{ width: "24px", height: "24px", objectFit: "cover" }}
                      />
                    ) : (
                      <Person size={22} />
                    )}
                  </Nav.Link>
                  {user?.credits !== undefined && (
                    <Button variant="outline-light" className="d-flex align-items-center gap-2 rounded-pill py-1">
                      <Cart size={18} />
                      <span className="fw-bold small">{user.credits} Créditos</span>
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    className="rounded-pill"
                    onClick={() => {
                      logout()
                      navigate("/") // Redirect to home page after logout
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
                  <span className="fw-bold">Acceso / Registro</span>
                </Button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Barra secundaria mejorada */}
      <div className="py-2 border-bottom shadow-sm" style={{ backgroundColor: "#f8f9fa" }}>
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            {/* Botón para toggle de la sidebar */}
            <div className="d-flex align-items-center">
              <Button
                variant="link"
                onClick={() => setShowSidebar(!showSidebar)}
                className="text-dark fw-bold p-1 text-decoration-none d-flex align-items-center me-4 nav-button"
                aria-label="Abrir categorías"
              >
                <List size={24} className="me-2" />
                Todas las categorías
              </Button>

              {/* Categorías destacadas - solo visibles en pantallas medianas y grandes */}
              <div className="d-none d-md-flex">
                {featuredCategories.map((category, index) => (
                  <Link
                    key={index}
                    to={category.path}
                    className="text-dark fw-medium mx-3 text-decoration-none d-flex align-items-center nav-link-hover"
                  >
                    {category.icon} {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Enlaces adicionales */}
            <div className="d-none d-md-flex gap-4">
              <Nav.Link as={Link} to="/como-funciona" className="text-dark fw-medium nav-link-hover">
                <InfoCircle className="me-1" /> Cómo funciona
              </Nav.Link>
              <Nav.Link as={Link} to="/contacto" className="text-dark fw-medium nav-link-hover">
                <Envelope className="me-1" /> Contacto
              </Nav.Link>
            </div>

            {isAuthenticated && (
              <Button
                as={Link as any}
                to={`/perfil/${user?.id}`}
                variant="success"
                size="sm"
                className="d-none d-md-flex align-items-center gap-2 rounded-pill px-3"
              >
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl || "/placeholder.svg"}
                    alt={user.name}
                    className="rounded-circle"
                    style={{ width: "16px", height: "16px", objectFit: "cover" }}
                  />
                ) : (
                  <Person size={16} />
                )}
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