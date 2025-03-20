import { Container, Row, Col, Nav, Stack } from "react-bootstrap";
import { Instagram, Facebook, Twitter, Envelope } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import Image from "react-bootstrap/Image";
import logo from "../assets/images/logosSwapify/logoNegroLargoFondoTransp.png";

export const Footer = () => {
    return (
        <footer className="text-white mt-5 py-4" style={{
            background: "linear-gradient(60deg, rgba(32,176,133,1) 0%, rgba(163,208,161,1) 80%)"
        }}>
            <Container>
                <Row xs={1} sm={2} md={3} lg={4} className="g-4 text-center">
                    {/* Sección Descubre */}
                    <Col>
                        <Nav as="ul" className="flex-column">
                            <Nav.Item as="li" className="mb-2">
                                <span className="text-white fw-bold fs-5">Descubre</span>
                            </Nav.Item>
                            <Nav.Item as="li">
                                <Link to="#" className="nav-link text-white-50 hover-underline p-0">
                                    Categorías
                                </Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="my-1">
                                <Link to="#" className="nav-link text-white-50 hover-underline p-0">
                                    Novedades
                                </Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                                <Link to="#" className="nav-link text-white-50 hover-underline p-0">
                                    Top Usuarios
                                </Link>
                            </Nav.Item>
                        </Nav>
                    </Col>

                    {/* Contacto y Redes */}
                    <Col md={3}>
                        <Stack gap={3}>
                            <div className="fw-bold fs-5 text-center text-sm-start">Contacto</div>

                            <Nav.Item className="d-flex align-items-center gap-2 justify-content-center justify-content-sm-start">
                                <Envelope className="text-white-50" />
                                <Nav.Link href="#" className="text-white-50 p-0 hover-underline">
                                    soporte@swapify.com
                                </Nav.Link>
                            </Nav.Item>

                            <div className="d-flex gap-3 justify-content-center justify-content-sm-start">
                                <Nav.Link href="#" className="p-0 text-white-50 hover-scale">
                                    <Instagram size={24} />
                                </Nav.Link>
                                <Nav.Link href="#" className="p-0 text-white-50 hover-scale">
                                    <Facebook size={24} />
                                </Nav.Link>
                                <Nav.Link href="#" className="p-0 text-white-50 hover-scale">
                                    <Twitter size={24} />
                                </Nav.Link>
                            </div>
                        </Stack>
                    </Col>
                </Row>

                {/* Copyright con Logo */}
                <Row className="mt-4 border-top pt-4 mx-0 align-items-center">
                    <Col xs={12} md={6} className="text-center text-md-start px-0">
                        <small className="opacity-75">
                            © {new Date().getFullYear()} Swapify ~ Equipo 2002 - Todos los derechos reservados
                        </small>
                    </Col>

                    <Col xs={12} md={6} className="text-center text-md-end px-0 mt-3 mt-md-0">
                        <Link to="/" className="d-inline-block">
                            <img
                                src={logo}
                                alt="Swapify Logo"
                                className="img-fluid"
                                style={{ maxWidth: "150px", filter: "brightness(0) invert(1)" }}
                            />
                        </Link>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};