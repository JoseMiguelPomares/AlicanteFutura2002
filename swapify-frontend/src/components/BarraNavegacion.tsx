"use client"

import type React from "react"
import { UserService } from "../services/userService"
import { useState } from "react"
import {
  Navbar,
  Container,
  Form,
  InputGroup,
  Button,
  Nav,
  Offcanvas,
  Image,
  Badge,
  Modal,
  Row,
  Col,
  Card,
  Alert
} from "react-bootstrap"
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
  Power,
  PencilSquare,
  Upload,
  CreditCard,
  CheckCircle,
  CurrencyEuro,
  Plus
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
  const { user, isAuthenticated, logout, refreshUserData } = useAuth()

  // Estado para controlar la visibilidad del modal de compra de créditos
  const [showCreditModal, setShowCreditModal] = useState(false)
  const [selectedCreditPack, setSelectedCreditPack] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  // Paquetes de créditos disponibles
  const creditPacks = [
    { id: 1, amount: 50, price: 5, popular: false },
    { id: 2, amount: 100, price: 9, popular: true },
    { id: 3, amount: 200, price: 15, popular: false },
    { id: 4, amount: 500, price: 30, popular: false },
  ]

  // Manejar la búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/busqueda?q=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm("")
    }
  }

  // Función para simular la compra de créditos
  const handlePurchaseCredits = async () => {
    if (!selectedCreditPack || !user) return

    setIsProcessing(true)

    try {
      // Obtener el paquete seleccionado
      const pack = creditPacks.find(p => p.id === selectedCreditPack);
      if (!pack) throw new Error("Paquete de créditos no encontrado");

      // Llamar a la API para añadir los créditos
      const userService = new UserService();
      await userService.addCredits(user.id, pack.amount);

      // Actualizar el estado local
      setPurchaseSuccess(true);

      // Refrescar los datos del usuario para mostrar los nuevos créditos
      await refreshUserData();

      // Cerrar el modal después de una compra exitosa
      setShowCreditModal(false);

      // Resetear los estados después de 3 segundos
      setTimeout(() => {
        setPurchaseSuccess(false);
        setSelectedCreditPack(null);
        setIsProcessing(false);
      }, 3000);
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      setIsProcessing(false);
    }
  }

  // Categorías destacadas para la barra secundaria
  const featuredCategories = [
    { name: "Tecnología", icon: <Laptop className="me-1" />, path: "/categoria/tecnología" },
    { name: "Ropa", icon: <Handbag className="me-1" />, path: "/categoria/ropa" },
    { name: "Hogar", icon: <House className="me-1" />, path: "/categoria/hogar" },
    { name: "Deporte", icon: <Bicycle className="me-1" />, path: "/categoria/deporte" },
  ]

  const dropdownStyles = `
  .profile-dropdown-container {
    position: relative;
  }
  
  .profile-dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    width: 220px;
    background-color: white;
    border-radius: 8px;
    padding: 10px;
    margin-top: 5px;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .profile-dropdown-container:hover .profile-dropdown-menu {
    opacity: 1;
    visibility: visible;
  }
  
  .profile-dropdown-content {
    padding: 10px;
    background-color: white;
  }

  .user-nav-link {
    transition: all 0.3s ease;
    border-radius: 20px;
    padding: 5px 10px !important;
  }
  
  .user-nav-link:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .credits-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    background-color: #f8f9fa;
    border-radius: 6px;
    margin-bottom: 15px;
    border: 1px solid #e9ecef;
  }
  
  .credits-display:hover {
    background-color: #e9f7ef;
    cursor: pointer;
  }
  
  .credits-display .credits-amount {
    font-weight: 500;
    color: #198754;
  }
  
  .credits-display .add-credits {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #198754;
    color: white;
    font-size: 12px;
    transition: transform 0.2s ease;
  }
  
  .credits-display:hover .add-credits {
    transform: scale(1.1);
  }
`

  return (
    <>
      {/* Barra Navegación PRINCIPAL con diseño mejorado */}
      <Navbar
        expand="lg"
        className="shadow py-1"
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
                      {user?.name || "Mi Perfil"}
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

                {/* Mostrar créditos justo debajo de Notificaciones */}
                {isAuthenticated && user?.credits !== undefined && (
                  <div
                    className="py-2 d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setShowMenu(false);
                      setShowCreditModal(true);
                    }}
                  >
                    <Cart className="me-2" size={18} />
                    <span className="fw-bold">{user.credits} Créditos</span>
                    <Badge bg="success" pill className="ms-2">+</Badge>
                  </div>
                )}
              </div>

              {/* Sección de enlaces secundarios */}
              <div className="border-bottom py-2">
                <Nav.Link as={Link} to="/contacto" className="py-2" onClick={() => setShowMenu(false)}>
                  <Envelope className="me-2" size={18} />
                  Contacto
                </Nav.Link>
              </div>

              {/* Sección de Cómo funciona y Ayuda con separación */}
              <div className="py-2 mt-2">
                <Nav.Link as={Link} to="/como-funciona" className="py-2 mb-2" onClick={() => setShowMenu(false)}>
                  <InfoCircle className="me-2" size={18} />
                  Cómo Funciona
                </Nav.Link>
                <Nav.Link as={Link} to="/ayuda" className="py-2" onClick={() => setShowMenu(false)}>
                  <InfoCircle className="me-2" size={18} />
                  Ayuda
                </Nav.Link>
              </div>

              {/* Botón de cerrar sesión al final */}
              {isAuthenticated && (
                <div className="mt-auto pt-3">
                  <Button
                    variant="outline-danger"
                    className="w-100 py-2 rounded-pill"
                    onClick={() => {
                      logout()
                      navigate("/") // Redirect to home page after logout
                      setShowMenu(false)
                    }}
                  >
                    <Power className="me-2" size={18} />
                    Cerrar Sesión
                  </Button>
                </div>
              )}
            </Offcanvas.Body>
          </Navbar.Offcanvas>

          {/* NAVBAR NORMAL en pantallas grandes */}
          <Navbar.Collapse id="navegacion-principal" className="d-none d-lg-flex align-items-center gap-3">
            {/* Botones y secciones adicionales */}
            <Button
              as={Link as any}
              to={isAuthenticated ? "/vender" : "/login?redirect=vender"}
              variant="outline-light"
              className="py-1 rounded-pill px-3 fw-bold btn-sm"
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
                  <div className="invisible" style={{ width: "80px" }}></div>
                  <div className="position-relative profile-dropdown-container">
                    <Nav.Link as={Link} to={`/perfil/${user?.id}`} className="user-nav-link text-white d-flex align-items-center">
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl || "/placeholder.svg"}
                          alt={user.name}
                          className="rounded-circle me-2"
                          style={{ width: "24px", height: "24px", objectFit: "cover" }}
                        />
                      ) : (
                        <Person size={22} className="me-2" />
                      )}
                      <span className="d-none d-md-inline">{user?.name}</span>
                    </Nav.Link>
                    <div className="profile-dropdown-menu">
                      <div className="profile-dropdown-content shadow rounded">
                        {user?.credits !== undefined && (
                          <div className="credits-display mb-2" onClick={() => setShowCreditModal(true)}>
                            <div className="d-flex align-items-center">
                              <Cart size={16} className="me-2 text-success" />
                              <span className="credits-amount">{user.credits} Créditos</span>
                            </div>
                            <div className="add-credits">
                              <Plus size={14} />
                            </div>
                          </div>
                        )}
                        <Button
                          as={Link as any}
                          to="/vender"
                          variant="light"
                          size="sm"
                          className="d-flex align-items-center gap-2 w-100 mb-2 text-start"
                        >
                          <Upload size={16} />
                          Subir un producto
                        </Button>
                        <Button
                          as={Link as any}
                          to={`/editar-perfil`}
                          variant="light"
                          size="sm"
                          className="d-flex align-items-center gap-2 w-100 mb-2 text-start"
                        >
                          <PencilSquare size={16} />
                          Editar perfil
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="d-flex align-items-center gap-2 w-100 text-start"
                          onClick={() => {
                            logout()
                            navigate("/")
                          }}
                        >
                          <Power size={16} />
                          Cerrar sesión
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="link"
                    className="text-white p-0 d-flex align-items-center"
                    style={{ transition: 'color 0.3s ease' }}
                    onClick={() => {
                      logout()
                      navigate("/") // Redirect to home page after logout
                    }}
                  >
                    <Power size={20} onMouseOver={(e) => e.currentTarget.style.color = '#dc3545'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'white'} />
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
          </div>
        </Container>
      </div>

      {/* Modal para comprar créditos */}
      <Modal
        show={showCreditModal}
        onHide={() => {
          if (!isProcessing) {
            setShowCreditModal(false);
            setPurchaseSuccess(false);
            setSelectedCreditPack(null);
          }
        }}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <CreditCard className="me-2 text-success" />
            Comprar Créditos
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {purchaseSuccess ? (
            <Alert variant="success" className="d-flex align-items-center">
              <CheckCircle size={24} className="me-2" />
              <div>
                <strong>¡Compra realizada con éxito!</strong>
                <p className="mb-0">Los créditos han sido añadidos a tu cuenta.</p>
              </div>
            </Alert>
          ) : (
            <>
              <p className="mb-4">
                Los créditos te permiten adquirir productos y servicios en Swapify. Elige el paquete que mejor se adapte a tus necesidades.
              </p>

              <Row xs={1} md={2} className="g-4 mb-4">
                {creditPacks.map(pack => (
                  <Col key={pack.id}>
                    <Card
                      className={`h-100 ${selectedCreditPack === pack.id ? 'border-success' : ''}`}
                      onClick={() => setSelectedCreditPack(pack.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Card.Body className="d-flex flex-column">
                        {pack.popular && (
                          <Badge bg="success" className="position-absolute top-0 end-0 m-2">
                            Popular
                          </Badge>
                        )}
                        <div className="d-flex align-items-center mb-3">
                          <div
                            className="rounded-circle bg-success bg-opacity-10 p-3 me-3 d-flex align-items-center justify-content-center"
                          >
                            <CurrencyEuro size={24} className="text-success" />
                          </div>
                          <div>
                            <h4 className="mb-0">{pack.amount} Créditos</h4>
                            <p className="text-muted mb-0">Valor: {pack.price}€</p>
                          </div>
                        </div>
                        <div className="mt-auto">
                          <Button
                            variant={selectedCreditPack === pack.id ? "success" : "outline-success"}
                            className="w-100"
                            onClick={() => setSelectedCreditPack(pack.id)}
                          >
                            {selectedCreditPack === pack.id ? (
                              <>
                                <CheckCircle className="me-2" />
                                Seleccionado
                              </>
                            ) : (
                              'Seleccionar'
                            )}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <div className="border-top pt-3">
                <h5>Métodos de pago</h5>
                <p className="text-muted small">
                  <strong>Nota:</strong> Esta es una simulación. No se realizará ningún cargo real.
                </p>
                <div className="d-flex gap-3 mb-3">
                  <Button variant="outline-secondary" size="sm" active>
                    <CreditCard className="me-1" /> Tarjeta
                  </Button>
                  <Button variant="outline-secondary" size="sm" disabled>
                    PayPal
                  </Button>
                  <Button variant="outline-secondary" size="sm" disabled>
                    Transferencia
                  </Button>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!purchaseSuccess && (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCreditModal(false);
                  setSelectedCreditPack(null);
                }}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                variant="success"
                onClick={handlePurchaseCredits}
                disabled={!selectedCreditPack || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Procesando...
                  </>
                ) : (
                  'Comprar Créditos'
                )}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Add the style tag for dropdown */}
      <style>{dropdownStyles}</style>

      {/* Barra Lateral */}
      <BarraLateral mostrar={showSidebar} alCerrar={() => setShowSidebar(false)} />
    </>
  )
}