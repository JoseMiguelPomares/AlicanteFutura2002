"use client"

import type React from "react"

import { useParams, Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Breadcrumb,
  Tabs,
  Tab,
  Card,
  Form,
  ListGroup,
  Alert,
} from "react-bootstrap"
import {
  Star,
  StarFill,
  Calendar3,
  GeoAlt,
  ArrowClockwise,
  ChatLeftText,
  Share,
  Heart,
  HeartFill,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons"
import { motion } from "framer-motion"
import { ItemService } from "../services/itemService"

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  imagen: string
  categoria?: string
  ubicacion?: string
  fechaPublicacion?: string
  estado?: string
  vendedor?: {
    id: number
    nombre: string
    avatar: string
    valoracion: number
    verificado: boolean
  }
}

// Interfaz para las reviews
interface Review {
  id: number
  reviewer: {
    id: number
    name: string
    avatar: string
  }
  rating: number
  comment: string
  date: string
}

export const PaginaProducto = () => {
  const { id } = useParams<{ id: string }>()
  const idNumber = Number(id)
  const [producto, setProducto] = useState<Producto | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [productosRelacionados, setProductosRelacionados] = useState<Producto[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [userRating, setUserRating] = useState<number>(5)
  const [userComment, setUserComment] = useState<string>("")
  const itemService = useRef(new ItemService()).current

  // Imágenes de ejemplo para la galería (URLs simplificadas)
  const imagenes = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  ]

  useEffect(() => {
    if (!id) {
      setError(true)
      setLoading(false)
      return
    }

    const fetchProducto = async () => {
      try {
        setLoading(true)
        const response = await itemService.getByUserId(idNumber)

        if (!response.ok) throw new Error("Producto no encontrado")

        const data = await response.json()

        // Enriquecer los datos con información adicional de ejemplo
        const productoEnriquecido = {
          ...data,
          categoria: "Electrónica",
          ubicacion: "Madrid, España",
          fechaPublicacion: "2023-05-15",
          estado: "Como nuevo",
          vendedor: {
            id: 123,
            nombre: "María García",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            valoracion: 4.8,
            verificado: true,
          },
        }

        setProducto(productoEnriquecido)

        // Simular productos relacionados
        setProductosRelacionados([
          {
            id: 101,
            nombre: "Auriculares Bluetooth",
            descripcion: "Auriculares inalámbricos con cancelación de ruido",
            precio: 80,
            imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500",
            categoria: "Electrónica",
          },
          {
            id: 102,
            nombre: "Smartwatch deportivo",
            descripcion: "Reloj inteligente con monitor cardíaco",
            precio: 120,
            imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500",
            categoria: "Electrónica",
          },
          {
            id: 103,
            nombre: "Altavoz portátil",
            descripcion: "Altavoz Bluetooth resistente al agua",
            precio: 65,
            imagen: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=500",
            categoria: "Electrónica",
          },
        ])

        // Simular reviews
        setReviews([
          {
            id: 1,
            reviewer: {
              id: 201,
              name: "Carlos Rodríguez",
              avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            rating: 5,
            comment:
              "Excelente producto, llegó en perfectas condiciones y funciona muy bien. El vendedor fue muy amable y respondió rápidamente a todas mis preguntas.",
            date: "2023-06-15",
          },
          {
            id: 2,
            reviewer: {
              id: 202,
              name: "Laura Martínez",
              avatar: "https://randomuser.me/api/portraits/women/28.jpg",
            },
            rating: 4,
            comment:
              "Buen producto, aunque tardó un poco más de lo esperado en llegar. La calidad es buena y el precio justo.",
            date: "2023-06-10",
          },
          {
            id: 3,
            reviewer: {
              id: 203,
              name: "Miguel Sánchez",
              avatar: "https://randomuser.me/api/portraits/men/45.jpg",
            },
            rating: 5,
            comment:
              "Muy satisfecho con la compra. El producto es tal como se describe y el vendedor fue muy profesional.",
            date: "2023-05-28",
          },
        ])
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProducto()

    // Simular scroll al inicio cuando se carga un nuevo producto
    window.scrollTo(0, 0)
  }, [id])

  const handleThumbnailClick = (index: number) => {
    setActiveImage(index)
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()

    // Simular añadir una nueva review
    const newReview: Review = {
      id: reviews.length + 1,
      reviewer: {
        id: 999, // ID del usuario actual (simulado)
        name: "Usuario Actual", // Nombre del usuario actual (simulado)
        avatar: "https://randomuser.me/api/portraits/women/68.jpg", // Avatar del usuario actual (simulado)
      },
      rating: userRating,
      comment: userComment,
      date: new Date().toISOString().split("T")[0],
    }

    setReviews([newReview, ...reviews])
    setUserComment("")
    setUserRating(5)

    // Aquí iría la lógica para enviar la review al backend
    alert("¡Gracias por tu review!")
  }

  // Renderizar estrellas para un review
  const renderStars = (rating: number) => {
    return (
      <div className="d-flex">
        {[...Array(5)].map((_, i) =>
          i < Math.floor(rating) ? (
            <StarFill key={i} className="text-warning" />
          ) : (
            <Star key={i} className="text-warning" />
          ),
        )}
      </div>
    )
  }

  // Renderizar estrellas interactivas para el formulario
  const renderRatingSelector = () => {
    return (
      <div className="d-flex mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} onClick={() => setUserRating(star)} style={{ cursor: "pointer" }}>
            {star <= userRating ? (
              <StarFill className="text-warning fs-4 me-1" />
            ) : (
              <Star className="text-warning fs-4 me-1" />
            )}
          </span>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando producto...</span>
        </div>
        <p className="mt-3">Cargando detalles del producto...</p>
      </Container>
    )
  }

  if (error || !producto) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Producto no encontrado</Alert.Heading>
          <p>Lo sentimos, no pudimos encontrar el producto que estás buscando.</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button as={Link as any} to="/" variant="outline-danger">
              Volver al inicio
            </Button>
          </div>
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/categorias" }}>
          Categorías
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/categorias/${producto.categoria?.toLowerCase()}` }}>
          {producto.categoria}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{producto.nombre}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        {/* Galería de imágenes */}
        <Col lg={6} className="mb-4 mb-lg-0">
          <div className="position-relative">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <img
                src={imagenes[activeImage] || "/placeholder.svg"}
                alt={producto.nombre}
                className="img-fluid rounded-4 shadow-sm mb-3"
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
            </motion.div>

            {/* Controles de navegación */}
            <Button
              variant="light"
              className="position-absolute top-50 start-0 translate-middle-y rounded-circle p-2 ms-2 shadow-sm"
              onClick={() => setActiveImage((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1))}
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="light"
              className="position-absolute top-50 end-0 translate-middle-y rounded-circle p-2 me-2 shadow-sm"
              onClick={() => setActiveImage((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1))}
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={20} />
            </Button>

            {/* Badge de estado */}
            <Badge bg="success" className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill">
              {producto.estado}
            </Badge>
          </div>

          {/* Miniaturas */}
          <Row className="g-2">
            {imagenes.map((img, index) => (
              <Col xs={3} key={index}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`Miniatura ${index + 1}`}
                    className={`img-fluid rounded cursor-pointer ${activeImage === index ? "border border-success border-3" : "opacity-75"}`}
                    style={{ height: "80px", width: "100%", objectFit: "cover", cursor: "pointer" }}
                    onClick={() => handleThumbnailClick(index)}
                  />
                </motion.div>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Información del producto */}
        <Col lg={6}>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <Badge bg="primary" className="rounded-pill px-3 py-2 mb-2">
              {producto.categoria}
            </Badge>
            <Button
              variant={isFavorite ? "danger" : "outline-danger"}
              className="rounded-circle p-2"
              onClick={toggleFavorite}
              aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              {isFavorite ? <HeartFill size={20} /> : <Heart size={20} />}
            </Button>
          </div>

          <h1 className="fw-bold mb-3">{producto.nombre}</h1>

          <div className="d-flex align-items-center mb-4">
            <div className="me-4 d-flex align-items-center">
              <GeoAlt className="text-muted me-1" />
              <span className="text-muted">{producto.ubicacion}</span>
            </div>
            <div className="d-flex align-items-center">
              <Calendar3 className="text-muted me-1" />
              <span className="text-muted">{new Date(producto.fechaPublicacion || "").toLocaleDateString()}</span>
            </div>
          </div>

          <h2 className="h3 fw-bold text-success mb-4">{producto.precio} Créditos</h2>

          <div className="mb-4">
            <h3 className="h5 fw-bold mb-2">Descripción</h3>
            <p className="text-muted">{producto.descripcion}</p>
          </div>

          {/* Información del vendedor */}
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <img
                  src={producto.vendedor?.avatar || "/placeholder.svg"}
                  alt={producto.vendedor?.nombre}
                  className="rounded-circle me-3"
                  width="50"
                  height="50"
                />
                <div>
                  <div className="d-flex align-items-center">
                    <h4 className="h6 fw-bold mb-0 me-2">{producto.vendedor?.nombre}</h4>
                    {producto.vendedor?.verificado && (
                      <CheckCircle className="text-success" title="Usuario verificado" />
                    )}
                  </div>
                  <div className="d-flex align-items-center">
                    {[...Array(5)].map((_, i) =>
                      i < Math.floor(producto.vendedor?.valoracion || 0) ? (
                        <StarFill key={i} className="text-warning" size={14} />
                      ) : (
                        <Star key={i} className="text-warning" size={14} />
                      ),
                    )}
                    <span className="ms-1 small text-muted">({producto.vendedor?.valoracion})</span>
                  </div>
                </div>
                <Button
                  variant="outline-success"
                  className="ms-auto rounded-pill"
                  as={Link as any}
                  to={`/perfil/${producto.vendedor?.id}`}
                >
                  Ver perfil
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Botones de acción */}
          <div className="d-grid gap-2">
            <Button variant="success" size="lg" className="rounded-pill">
              <ChatLeftText className="me-2" />
              Contactar con el vendedor
            </Button>
            <div className="d-flex gap-2">
              <Button variant="outline-success" className="w-100 rounded-pill">
                <ArrowClockwise className="me-2" />
                Proponer intercambio
              </Button>
              <Button variant="outline-secondary" className="rounded-pill px-3">
                <Share />
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Pestañas de información adicional */}
      <div className="mt-5">
        <Tabs defaultActiveKey="detalles" className="mb-4">
          <Tab eventKey="detalles" title="Detalles">
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                        <span className="text-muted">Categoría</span>
                        <span className="fw-bold">{producto.categoria}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                        <span className="text-muted">Estado</span>
                        <span className="fw-bold">{producto.estado}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                        <span className="text-muted">Ubicación</span>
                        <span className="fw-bold">{producto.ubicacion}</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                  <Col md={6}>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                        <span className="text-muted">Fecha de publicación</span>
                        <span className="fw-bold">
                          {new Date(producto.fechaPublicacion || "").toLocaleDateString()}
                        </span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                        <span className="text-muted">ID del producto</span>
                        <span className="fw-bold">{producto.id}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                        <span className="text-muted">Visitas</span>
                        <span className="fw-bold">243</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab>
          <Tab eventKey="politicas" title="Políticas de intercambio">
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body>
                <h4 className="h5 fw-bold mb-3">Políticas de intercambio</h4>
                <p>El vendedor acepta los siguientes tipos de intercambio:</p>
                <ul className="mb-4">
                  <li>Intercambio directo por productos de valor similar</li>
                  <li>Intercambio parcial (producto + créditos)</li>
                  <li>Intercambio por servicios</li>
                </ul>

                <h4 className="h5 fw-bold mb-3">Condiciones</h4>
                <ul>
                  <li>El intercambio debe realizarse en persona</li>
                  <li>El vendedor prefiere intercambios en su zona</li>
                  <li>Se debe acordar el lugar y hora del intercambio previamente</li>
                </ul>
              </Card.Body>
            </Card>
          </Tab>
          <Tab eventKey="reviews" title="Reviews">
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body>
                <h4 className="h5 fw-bold mb-4">Reviews del producto</h4>

                {/* Formulario para añadir un review */}
                <Card className="mb-4 bg-light border-0">
                  <Card.Body>
                    <h5 className="h6 fw-bold mb-3">Deja tu review</h5>
                    <Form onSubmit={handleSubmitReview}>
                      {renderRatingSelector()}
                      <Form.Group className="mb-3">
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Comparte tu experiencia con este producto..."
                          value={userComment}
                          onChange={(e) => setUserComment(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Button variant="success" type="submit" className="rounded-pill">
                        Enviar review
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>

                {/* Lista de reviews */}
                {reviews.length > 0 ? (
                  <div>
                    {reviews.map((review) => (
                      <div key={review.id} className="mb-4 pb-4 border-bottom">
                        <div className="d-flex">
                          <img
                            src={review.reviewer.avatar || "/placeholder.svg"}
                            alt={review.reviewer.name}
                            className="rounded-circle me-3"
                            width="50"
                            height="50"
                          />
                          <div>
                            <div className="d-flex align-items-center mb-2">
                              <h5 className="h6 fw-bold mb-0 me-2">{review.reviewer.name}</h5>
                              <span className="text-muted small">{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                            <div className="mb-2">{renderStars(review.rating)}</div>
                            <p className="mb-0">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted mb-0">
                      Este producto aún no tiene reviews. ¡Sé el primero en opinar!
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </div>

      {/* Productos relacionados */}
      <div className="mt-5">
        <h3 className="fw-bold mb-4">Productos relacionados</h3>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {productosRelacionados.map((prod) => (
            <Col key={prod.id}>
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Link to={`/productos/${prod.id}`} className="text-decoration-none">
                  <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                    <Card.Img
                      variant="top"
                      src={prod.imagen}
                      alt={prod.nombre}
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <Card.Body className="p-3">
                      <Badge bg="primary" className="mb-2 rounded-pill">
                        {prod.categoria}
                      </Badge>
                      <Card.Title className="fw-bold text-dark mb-1" style={{ fontSize: "1rem" }}>
                        {prod.nombre}
                      </Card.Title>
                      <Card.Text className="text-muted small mb-2" style={{ height: "40px", overflow: "hidden" }}>
                        {prod.descripcion}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-success">{prod.precio} Créditos</span>
                        <Button variant="outline-success" size="sm" className="rounded-pill">
                          Ver
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  )
}

