"use client"

import type React from "react"

import { Container, Row, Col, Form, Button, Card } from "react-bootstrap"
import { motion } from "framer-motion"
import { GeoAlt as MapPin, Envelope, Telephone, ShieldFill as Shield, CreditCard as CreditCard, CheckCircleFill as CheckCircle } from "react-bootstrap-icons"

export const PaginaContacto = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el formulario
    alert("Mensaje enviado correctamente")
  }

  return (
    <>
      {/* Título de la página */}
      <Container className="my-4">
        <h1 className="fw-bold">Contacto</h1>
      </Container>

      {/* Formulario de contacto */}
      <Container className="mb-5">
        <h2 className="mb-4">Envíanos un mensaje</h2>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6} className="mb-3 mb-md-0">
              <Form.Group controlId="formNombre">
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control type="text" placeholder="Tu nombre" required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control type="email" placeholder="tu@email.com" required />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formAsunto">
            <Form.Label>Asunto</Form.Label>
            <Form.Control type="text" placeholder="Asunto de tu mensaje" required />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formMensaje">
            <Form.Label>Mensaje</Form.Label>
            <Form.Control as="textarea" rows={5} placeholder="Escribe tu mensaje aquí..." required />
          </Form.Group>

          <Button variant="success" type="submit" className="px-4 py-2">
            Enviar mensaje
          </Button>
        </Form>
      </Container>

      {/* Información de contacto */}
      <div className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <Container>
          <h2 className="mb-4">Información de contacto</h2>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <motion.div
                className="p-4 h-100 bg-white rounded-4 shadow-sm border"
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              >
                <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <MapPin className="text-success" size={30} />
                </div>
                <h3 className="h5 fw-bold">Dirección</h3>
                <p className="text-muted">Calle Principal 123, Madrid, España</p>
              </motion.div>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <motion.div
                className="p-4 h-100 bg-white rounded-4 shadow-sm border"
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              >
                <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <Envelope className="text-success" size={30} />
                </div>
                <h3 className="h5 fw-bold">Email</h3>
                <p className="text-muted">info@swapify.com</p>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div
                className="p-4 h-100 bg-white rounded-4 shadow-sm border"
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              >
                <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <Telephone className="text-success" size={30} />
                </div>
                <h3 className="h5 fw-bold">Teléfono</h3>
                <p className="text-muted">+34 912 345 678</p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Mapa */}
      <Container className="my-5">
        <h2 className="mb-4">Encuéntranos</h2>
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="bg-light" style={{ height: "400px" }}>
            {/* Aquí iría el componente de mapa real */}
            <div className="d-flex justify-content-center align-items-center h-100 text-muted">
              <div className="text-center">
                <MapPin size={40} className="mb-3" />
                <h5>Calle Principal 123, Madrid, España</h5>
                <p>Mapa interactivo</p>
              </div>
            </div>
          </div>
        </Card>
      </Container>

      {/* Nuestras garantías */}
      <div className="py-5 mb-5" style={{ backgroundColor: "#f8f9fa" }}>
        <Container>
          <h2 className="mb-4">Nuestras garantías</h2>
          <Row xs={1} md={3} className="g-4">
            <Col>
              <motion.div
                className="p-4 h-100 bg-white rounded-4 shadow-sm border"
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              >
                <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <Shield className="text-success" size={30} />
                </div>
                <h3 className="h5 fw-bold">Intercambios seguros</h3>
                <p className="text-muted">Todas las transacciones están protegidas por nuestro sistema de seguridad.</p>
              </motion.div>
            </Col>
            <Col>
              <motion.div
                className="p-4 h-100 bg-white rounded-4 shadow-sm border"
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              >
                <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <CreditCard className="text-success" size={30} />
                </div>
                <h3 className="h5 fw-bold">Pagos protegidos</h3>
                <p className="text-muted">Utilizamos métodos de pago seguros y verificados para tu tranquilidad.</p>
              </motion.div>
            </Col>
            <Col>
              <motion.div
                className="p-4 h-100 bg-white rounded-4 shadow-sm border"
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              >
                <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <CheckCircle className="text-success" size={30} />
                </div>
                <h3 className="h5 fw-bold">Calidad verificada</h3>
                <p className="text-muted">
                  Todos los productos y servicios pasan por un proceso de verificación de calidad.
                </p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA Final */}
      <div
        className="py-5 mb-5 position-relative overflow-hidden"
        style={{
          background: "linear-gradient(120deg, #1a3c34 0%, #20b03d 100%)",
        }}
      >
        <Container className="py-4 position-relative" style={{ zIndex: 2 }}>
          <Row className="align-items-center">
            <Col lg={7} className="text-white">
              <h2 className="display-5 fw-bold mb-3">¿Tienes alguna pregunta?</h2>
              <p className="fs-5 mb-4 opacity-75">
                Nuestro equipo de atención al cliente está disponible para ayudarte con cualquier duda o consulta que
                tengas.
              </p>
              <Button variant="light" size="lg" className="fw-bold shadow-sm px-4" href="mailto:info@swapify.com">
                Contáctanos ahora
              </Button>
            </Col>
            <Col lg={5} className="text-center mt-5 mt-lg-0">
              <img
                src="https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                alt="Atención al cliente"
                className="img-fluid rounded-circle shadow-lg"
                style={{ maxWidth: "300px" }}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default PaginaContacto
