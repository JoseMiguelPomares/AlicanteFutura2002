import { Container, Row, Col } from "react-bootstrap"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Envelope,
  Telephone,
  GeoAlt,
  CreditCard,
  ShieldCheck,
  Award,
} from "react-bootstrap-icons"
import { Link } from "react-router-dom"
import logo from "../assets/images/logosSwapify/logoNegroLargoFondoTransp.png"

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer-section mt-5">
      {/* Main Footer */}
      <div className="main-footer pt-4">
        <Container>
          {/* Footer Links */}
          <Row className="g-4 mb-2">
            {/* Company Info */}
            <Col lg={4} md={6}>
              <div className="pe-lg-5">
                <Link to="/" className="d-inline-block mb-4">
                  <img
                    src={logo || "/placeholder.svg"}
                    alt="Swapify Logo"
                    className="footer-logo img-fluid"
                    style={{ maxWidth: "180px", filter: "brightness(0) invert(1)" }}
                  />
                </Link>
                <p className="text-white-50 mb-4">
                  Swapify es la plataforma líder de intercambio de productos y servicios. Nuestra misión es fomentar un
                  consumo más sostenible y crear una comunidad colaborativa.
                </p>
                <div className="social-links d-flex gap-3 mb-4">
                  <a href="#" className="social-link">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="social-link">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="social-link">
                    <Twitter size={20} />
                  </a>
                  <a href="#" className="social-link">
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </Col>

            {/* Quick Links */}
            <Col lg={2} md={6} sm={6}>
              <h5 className="text-white fw-bold mb-4">Explorar</h5>
              <ul className="footer-links">
                <li>
                  <Link to="/como-funciona">Cómo funciona</Link>
                </li>
                <li>
                  <Link to="/destacados">Destacados</Link>
                </li>
                <li>
                  <Link to="/recientes">Recién añadidos</Link>
                </li>
              </ul>
            </Col>

            {/* Account Links */}
            <Col lg={2} md={6} sm={6}>
              <h5 className="text-white fw-bold mb-4">Mi cuenta</h5>
              <ul className="footer-links">
                <li>
                  <Link to="/registro">Crear cuenta</Link>
                </li>
                <li>
                  <Link to="/login">Iniciar sesión</Link>
                </li>
                <li>
                  <Link to="/perfil">Mi perfil</Link>
                </li>
                <li>
                  <Link to="/mis-productos">Mis productos</Link>
                </li>
                <li>
                  <Link to="/favoritos">Favoritos</Link>
                </li>
              </ul>
            </Col>

            {/* Contact Info */}
            <Col lg={4} md={6}>
              <h5 className="text-white fw-bold mb-4">Contacto</h5>
              <ul className="contact-info">
                <li>
                  <GeoAlt className="me-2" />
                  <span>Calle Principal 123, Madrid, España</span>
                </li>
                <li>
                  <Envelope className="me-2" />
                  <a href="mailto:info@swapify.com">info@swapify.com</a>
                </li>
                <li>
                  <Telephone className="me-2" />
                  <a href="tel:+34912345678">+34 912 345 678</a>
                </li>
              </ul>

              <div className="trust-badges mt-4">
                <h6 className="text-white-50 mb-3">Garantías</h6>
                <div className="d-flex gap-4">
                  <div className="d-flex align-items-center">
                    <ShieldCheck className="text-success me-2" size={24} />
                    <span>Intercambios seguros</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <CreditCard className="text-success me-2" size={24} />
                    <span>Pagos protegidos</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Award className="text-success me-2" size={24} />
                    <span>Calidad verificada</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Bottom Footer */}
      <div className="bottom-footer py-3">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
              <p className="mb-0">© {currentYear} Swapify ~ Equipo 2002 - Todos los derechos reservados</p>
            </Col>
            <Col md={6}>
              <ul className="legal-links d-flex flex-wrap justify-content-center justify-content-md-end gap-3 mb-0">
                <li>
                  <Link to="/terminos">Términos y condiciones</Link>
                </li>
                <li>
                  <Link to="/privacidad">Política de privacidad</Link>
                </li>
                <li>
                  <a
                    href="http://localhost:5173/docs/cookies_policy_es_ES-20241120.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cookies
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  )
}

