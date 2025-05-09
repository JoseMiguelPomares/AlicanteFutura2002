"use client"

import type React from "react"
import { Container, Row, Col, Card, Button, Accordion, Badge } from "react-bootstrap"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  PersonPlus,
  Upload,
  ArrowLeftRight,
  Star,
  CreditCard,
  CheckCircle,
  ShieldCheck,
  Search,
  ChatDots,
  GeoAlt,
  Award,
  QuestionCircle,
} from "react-bootstrap-icons"
import { useAuth } from "../contexts/AuthContext"

export const PaginaComoFunciona: React.FC = () => {
  const { isAuthenticated } = useAuth()

  // Animación para los elementos que aparecen al hacer scroll
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  // Pasos principales del proceso
  const pasos = [
    {
      icon: <PersonPlus className="text-success" size={40} />,
      title: "Regístrate",
      description: "Crea tu cuenta en Swapify y completa tu perfil con tus datos e intereses.",
      color: "success",
    },
    {
      icon: <Upload className="text-primary" size={40} />,
      title: "Publica",
      description: "Sube fotos y detalles de los productos o servicios que quieres intercambiar.",
      color: "primary",
    },
    {
      icon: <Search className="text-info" size={40} />,
      title: "Explora",
      description: "Busca productos o servicios que te interesen usando filtros y categorías.",
      color: "info",
    },
    {
      icon: <ChatDots className="text-warning" size={40} />,
      title: "Contacta",
      description: "Habla con otros usuarios para acordar los detalles del intercambio.",
      color: "warning",
    },
    {
      icon: <ArrowLeftRight className="text-danger" size={40} />,
      title: "Intercambia",
      description: "Realiza el intercambio y obtén o utiliza créditos en la plataforma.",
      color: "danger",
    },
    {
      icon: <Star className="text-success" size={40} />,
      title: "Valora",
      description: "Deja tu valoración sobre la experiencia para ayudar a la comunidad.",
      color: "success",
    },
  ]

  // Preguntas frecuentes
  const faqs = [
    {
      pregunta: "¿Qué es Swapify?",
      respuesta:
        "Swapify es una plataforma de intercambio de productos y servicios que fomenta el consumo sostenible y la economía circular. Permite a los usuarios intercambiar objetos que ya no utilizan por otros que necesitan, o por servicios, utilizando un sistema de créditos.",
    },
    {
      pregunta: "¿Cómo funciona el sistema de créditos?",
      respuesta:
        "Los créditos son la moneda virtual de Swapify. Cuando te registras, recibes créditos iniciales. Puedes ganar más créditos vendiendo tus productos o servicios, y gastarlos adquiriendo los de otros usuarios. El valor en créditos lo establece cada vendedor según considere justo.",
    },
    {
      pregunta: "¿Cómo se garantiza la seguridad en los intercambios?",
      respuesta:
        "Swapify cuenta con un sistema de valoraciones que permite conocer la reputación de los usuarios. Además, ofrecemos consejos de seguridad para los intercambios presenciales y un sistema de mensajería interno para acordar los detalles. En caso de problemas, nuestro equipo de soporte está disponible para ayudar.",
    },
    {
      pregunta: "¿Puedo vender productos en lugar de intercambiarlos?",
      respuesta:
        "Swapify está diseñado principalmente para el intercambio usando créditos, pero estos créditos tienen un valor real dentro de la plataforma. Piensa en ello como una forma alternativa de compra-venta que fomenta la reutilización y el consumo responsable.",
    },
    {
      pregunta: "¿Qué tipo de productos o servicios puedo intercambiar?",
      respuesta:
        "Puedes intercambiar casi cualquier producto legal en buen estado: ropa, tecnología, libros, muebles, etc. También servicios como clases particulares, reparaciones, asesoramiento profesional, entre otros. No se permiten productos prohibidos, falsificados o que incumplan nuestras políticas.",
    },
    {
      pregunta: "¿Cómo se realizan los intercambios físicamente?",
      respuesta:
        "Los usuarios acuerdan el lugar y momento del intercambio a través del chat de la plataforma. Recomendamos lugares públicos y seguros. También es posible acordar envíos, aunque en ese caso los gastos de envío deben ser acordados entre las partes.",
    },
  ]

  // Beneficios de usar Swapify
  const beneficios = [
    {
      icon: <CreditCard size={36} className="text-success" />,
      title: "Ahorra dinero",
      description: "Consigue lo que necesitas sin gastar dinero real, solo usando créditos de la plataforma.",
    },
    {
      icon: <ShieldCheck size={36} className="text-primary" />,
      title: "Intercambios seguros",
      description: "Sistema de valoraciones y verificación de usuarios para garantizar la confianza.",
    },
    {
      icon: <GeoAlt size={36} className="text-danger" />,
      title: "Comunidad local",
      description: "Conecta con personas de tu zona y reduce la huella de carbono en tus intercambios.",
    },
    {
      icon: <Award size={36} className="text-warning" />,
      title: "Consumo sostenible",
      description: "Contribuye a la economía circular dando nueva vida a productos que ya no utilizas.",
    },
  ]

  return (
    <>
      {/* Hero Banner */}
      <div
        className="py-5 position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9f7ef 100%)",
          minHeight: "400px",
        }}
      >
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <h1 className="display-4 fw-bold mb-3" style={{ color: "#1a3c34" }}>
                  ¿Cómo funciona <span className="text-success">Swapify</span>?
                </h1>
                <p className="fs-5 mb-4 text-dark">
                  Descubre cómo nuestra plataforma de intercambio te permite dar nueva vida a tus objetos y conseguir lo
                  que necesitas de forma sostenible.
                </p>
                {!isAuthenticated && (
                  <Button as={Link as any} to="/registro" variant="success" size="lg" className="rounded-pill px-4">
                    Únete ahora
                  </Button>
                )}
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                  alt="Intercambio sostenible"
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ width: "100%", height: "80vh", objectFit: "cover" }}
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Sección: ¿Qué es Swapify? */}
      <Container className="py-5">
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mb-4"
            >
              <Badge bg="success" className="px-3 py-2 mb-3">
                Nuestra misión
              </Badge>
              <h2 className="display-5 fw-bold mb-4">Intercambio sostenible para todos</h2>
              <p className="fs-5 text-muted">
                Swapify es una plataforma que conecta personas para intercambiar productos y servicios utilizando un
                sistema de créditos, fomentando un consumo más responsable y sostenible.
              </p>
            </motion.div>
          </Col>
        </Row>

        {/* Sistema de créditos */}
        <Row className="align-items-center mb-5">
          <Col lg={6} className="mb-4 mb-lg-0">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h3 className="fw-bold mb-3">Sistema de créditos</h3>
              <p className="mb-4">
                En lugar de usar dinero real, Swapify funciona con un sistema de créditos que facilita los intercambios
                y crea una economía circular dentro de la plataforma.
              </p>
              <ul className="list-unstyled">
                <li className="d-flex align-items-center mb-3">
                  <CheckCircle className="text-success me-2" size={20} />
                  <span>Recibe créditos iniciales al registrarte</span>
                </li>
                <li className="d-flex align-items-center mb-3">
                  <CheckCircle className="text-success me-2" size={20} />
                  <span>Gana créditos vendiendo tus productos o servicios</span>
                </li>
                <li className="d-flex align-items-center mb-3">
                  <CheckCircle className="text-success me-2" size={20} />
                  <span>Utiliza tus créditos para adquirir lo que necesitas</span>
                </li>
                <li className="d-flex align-items-center">
                  <CheckCircle className="text-success me-2" size={20} />
                  <span>Establece el valor en créditos que consideres justo</span>
                </li>
              </ul>
            </motion.div>
          </Col>
          <Col lg={6}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center"
            >
              <img
                src="https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                alt="Sistema de créditos"
                className="img-fluid rounded-4 shadow"
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* Sección: Cómo funciona (pasos) */}
      <div className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold mb-3">Proceso paso a paso</h2>
            <p className="fs-5 text-muted mx-auto" style={{ maxWidth: "700px" }}>
              Descubre lo fácil que es usar Swapify para intercambiar tus productos y servicios.
            </p>
          </motion.div>

          <Row xs={1} md={2} lg={3} className="g-4">
            {pasos.map((paso, index) => (
              <Col key={index}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  custom={index * 0.2}
                >
                  <Card className="border-0 shadow-sm h-100 rounded-4">
                    <Card.Body className="p-4 text-center">
                      <div className={`bg-${paso.color} bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3`}>
                        {paso.icon}
                      </div>
                      <h3 className="h4 fw-bold mb-2">
                        <span className={`badge bg-${paso.color} rounded-pill me-2`}>{index + 1}</span> {paso.title}
                      </h3>
                      <p className="text-muted mb-0">{paso.description}</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Sección: Beneficios */}
      <Container className="py-5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-5"
        >
          <h2 className="display-5 fw-bold mb-3">Beneficios de usar Swapify</h2>
          <p className="fs-5 text-muted mx-auto" style={{ maxWidth: "700px" }}>
            Descubre todas las ventajas que te ofrece nuestra plataforma de intercambio.
          </p>
        </motion.div>

        <Row xs={1} md={2} className="g-4">
          {beneficios.map((beneficio, index) => (
            <Col key={index}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={index * 0.2}
              >
                <Card className="border-0 shadow-sm h-100 rounded-4">
                  <Card.Body className="p-4">
                    <div className="d-flex">
                      <div className="me-3">{beneficio.icon}</div>
                      <div>
                        <h3 className="h5 fw-bold mb-2">{beneficio.title}</h3>
                        <p className="text-muted mb-0">{beneficio.description}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Sección: Preguntas frecuentes */}
      <div className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold mb-3">Preguntas frecuentes</h2>
            <p className="fs-5 text-muted mx-auto" style={{ maxWidth: "700px" }}>
              Resolvemos tus dudas sobre cómo funciona Swapify.
            </p>
          </motion.div>

          <Row className="justify-content-center">
            <Col lg={8}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <Accordion className="shadow-sm rounded-4 overflow-hidden">
                  {faqs.map((faq, index) => (
                    <Accordion.Item key={index} eventKey={index.toString()} className="border-0 border-bottom">
                      <Accordion.Header className="py-3">
                        <div className="d-flex align-items-center">
                          <QuestionCircle className="text-success me-2" />
                          <span className="fw-bold">{faq.pregunta}</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="py-3">
                        <p className="mb-0">{faq.respuesta}</p>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA Final */}
      <div
        className="py-5 position-relative overflow-hidden"
        style={{
          background: "linear-gradient(120deg, #1a3c34 0%, #20b03d 100%)",
        }}
      >
        <Container className="py-4">
          <Row className="align-items-center justify-content-center text-center">
            <Col lg={8} className="text-white">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="mb-4"
              >
                <h2 className="display-5 fw-bold mb-3">¿Listo para empezar a intercambiar?</h2>
                <p className="fs-5 mb-4 opacity-75">
                  Únete a nuestra comunidad y comienza a intercambiar tus productos y servicios de forma sostenible.
                </p>
                {!isAuthenticated ? (
                  <div className="d-flex justify-content-center gap-3">
                    <Button as={Link as any} to="/registro" variant="light" size="lg" className="fw-bold px-4">
                      Crear cuenta
                    </Button>
                    <Button as={Link as any} to="/login" variant="outline-light" size="lg" className="px-4">
                      Iniciar sesión
                    </Button>
                  </div>
                ) : (
                  <Button as={Link as any} to="/vender" variant="light" size="lg" className="fw-bold px-4">
                    Publicar producto
                  </Button>
                )}
              </motion.div>
            </Col>
          </Row>
        </Container>

        {/* Elementos decorativos */}
        <div
          className="position-absolute"
          style={{ bottom: "10%", left: "5%", width: "150px", height: "150px", opacity: 0.1 }}
        >
          <div className="rounded-circle bg-white w-100 h-100"></div>
        </div>
        <div
          className="position-absolute"
          style={{ top: "10%", right: "5%", width: "100px", height: "100px", opacity: 0.1 }}
        >
          <div className="rounded-circle bg-white w-100 h-100"></div>
        </div>
      </div>
    </>
  )
}