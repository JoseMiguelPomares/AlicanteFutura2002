import { Link } from "react-router-dom";
import { Container, Navbar, Form, Nav, Button, Offcanvas } from "react-bootstrap";
import { Cart, Person } from "react-bootstrap-icons";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Image from "react-bootstrap/Image";
import logo from "../assets/images/logosSwapify/logoNegroLargoFondoTransp.png";
import logoPequeno from "../assets/images/logosSwapify/logoNegroTransp.png"; // Logo para móviles

export const BarraNavegacion = () => {
  const [showMenu, setShowMenu] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 640 }); // Pantallas pequeñas

  return (
    <Navbar expand="lg" className="shadow-sm px-2" style={{
      background: "linear-gradient(90deg, rgba(32,176,61,1) 0%, rgba(163,208,161,1) 80%)",
    }}>
      <Container fluid>
        {/* Sección superior (logo, búsqueda y toggle en una fila) */}
        <div className="d-flex w-100 align-items-center">
          {/* Logo dinámico */}
          <Navbar.Brand as={Link} to="/" className="me-2">
            <Image src={isMobile ? logoPequeno : logo} // Cambia el logo según el tamaño de pantalla
              alt="Swapify Logo" style={isMobile ? { height: "50px" } : { height: "50px" }} />
          </Navbar.Brand>

          {/* Barra de búsqueda */}
          <Form className="flex-grow-1 me-2">
            <Form.Control type="search" placeholder="Buscar productos, servicios o categorías..." className="form-control-lg" aria-label="Buscar"
            />
          </Form>

          {/* Toggle del menú (visible en móviles) */}
          <Navbar.Toggle onClick={() => setShowMenu(true)} aria-controls="navegacion-principal" />
        </div>

        {/* Offcanvas SOLO en móviles */}
        <Navbar.Offcanvas id="navegacion-principal" show={showMenu} onHide={() => setShowMenu(false)} placement="end" className="d-lg-none">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menú de Navegación</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column gap-3">
            {/* Botones principales */}
            <div className="d-flex flex-column gap-3">
              <Button as={Link} to="/registro" variant="outline-success" className="w-100 py-3" onClick={() => setShowMenu(false)}>
                Acceso / Registro
              </Button>
              <Button variant="outline-success" className="w-100 py-3" onClick={() => setShowMenu(false)}>
                Vender
              </Button>
            </div>

            {/* Sección de perfil y créditos */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <Nav.Link as={Link} to="/perfil" className="text-dark" onClick={() => setShowMenu(false)}>
                <Person size={30} className="hover-scale" />
              </Nav.Link>
              <Button variant="outline-light" className="d-flex align-items-center gap-2 shadow-sm">
                <Cart size={22} />
                <span className="fw-bold">150 Créditos</span>
              </Button>
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

        {/* NAVBAR NORMAL en pantallas grandes */}
        <Navbar.Collapse id="navegacion-principal" className="d-none d-lg-flex align-items-center gap-3">
          {/* Botones y secciones adicionales */}
          <Button variant="outline-success">Vender</Button>
          <Nav.Link as={Link} to="/perfil" className="text-dark">
            <Person size={26} className="hover-scale" />
          </Nav.Link>
          <Button variant="outline-light" className="d-flex align-items-center gap-2 shadow-sm">
            <Cart size={20} />
            <span className="fw-bold">150 Créditos</span>
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
