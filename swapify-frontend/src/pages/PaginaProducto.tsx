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
} from "react-bootstrap-icons"
import { motion } from "framer-motion"
import { ItemService } from "../services/itemService"

// Interfaz actualizada para coincidir con la estructura de datos de la API
interface Producto {
  id: number
  title: string
  description: string
  price: number
  imageUrl: string
  category_id: number
  category: {
    id: number
    name: string
  }
  status: string
  createdAt: string
  user?: {
    id: number
    name: string
    email: string
    imageUrl?: string
    rating?: number
    verified?: boolean
    location?: string
  }
}

// Interfaz para las reviews (para cuando se implementen en la API)
interface Review {
  id: number
  user_id: number
  item_id: number
  rating: number
  comment: string
  created_at: string
  user?: {
    id: number
    name: string
    imageUrl?: string
  }
}

export const PaginaProducto = () => {
  const { id } = useParams<{ id: string }>()
  const idNumber = Number(id)
  const [producto, setProducto] = useState<Producto | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [productosRelacionados, setProductosRelacionados] = useState<Producto[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [userRating, setUserRating] = useState<number>(5)
  const [userComment, setUserComment] = useState<string>("")
  const itemService = useRef(new ItemService()).current

  useEffect(() => {
    if (!id) {
      setError(true)
      setLoading(false)
      return
    }

    const fetchProducto = async () => {
      try {
        setLoading(true)
        // Obtener el producto por su ID
        const response = await itemService.getByItemId(idNumber)

        if (!response || !response.data) {
          throw new Error("Producto no encontrado")
        }

        console.log("Datos del producto:", response.data) // Para depuración

        // Guardar los datos del producto tal como vienen de la API
        setProducto(response.data)

        // Buscar productos relacionados (por categoría similar)
        try {
          const allProductsResponse = await itemService.getAll()
          console.log("Todos los productos:", allProductsResponse)

          // Filtrar productos de la misma categoría, excluyendo el producto actual
          const relacionados = allProductsResponse
            .filter((p: Producto) => p.category?.id === response.data.category?.id && p.id !== response.data.id)
            .slice(0, 4) // Limitar a 4 productos relacionados

          setProductosRelacionados(relacionados)
        } catch (error) {
          console.error("Error al cargar productos relacionados:", error)
          // Si falla, dejamos el array vacío
        }

        // Aquí se cargarían las reviews desde la API cuando esté implementado
        // Por ahora, dejamos el array vacío
        setReviews([])
      } catch (error) {
        console.error("Error al cargar el producto:", error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProducto()

    // Scroll al inicio cuando se carga un nuevo producto
    window.scrollTo(0, 0)
  }, [id])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Aquí se implementaría la lógica para guardar el favorito en la base de datos
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    // Aquí se implementaría la lógica para enviar la review a la API
    try {
      // Ejemplo de cómo sería la implementación:
      // const response = await fetch('/api/reviews', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     item_id: producto?.id,
      //     rating: userRating,
      //     comment: userComment
      //   })
      // });

      // if (response.ok) {
      //   const newReview = await response.json();
      //   setReviews([newReview, ...reviews]);
      // }

      alert("Funcionalidad de valoraciones en desarrollo. ¡Gracias por tu interés!")
      setUserComment("")
      setUserRating(5)
    } catch (error) {
      console.error("Error al enviar la valoración:", error)
      alert("No se pudo enviar la valoración. Inténtalo de nuevo más tarde.")
    }
  }

  // Renderizar estrellas para una valoración
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
        {producto.category && (
          <>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/categorias" }}>
              Categorías
            </Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/categorias/${producto.category?.name?.toLowerCase()}` }}>
              {producto.category?.name}
            </Breadcrumb.Item>
          </>
        )}
        <Breadcrumb.Item active>{producto.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        {/* Imagen del producto */}
        <Col lg={6} className="mb-4 mb-lg-0">
          <div className="position-relative">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <img
                src={producto.imageUrl || "/placeholder.svg?height=400&width=600"}
                alt={producto.title}
                className="img-fluid rounded-4 shadow-sm mb-3"
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
            </motion.div>

            {/* Badge de estado */}
            {producto.status && (
              <Badge bg="success" className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill">
                {producto.status}
              </Badge>
            )}
          </div>
        </Col>

        {/* Información del producto */}
        <Col lg={6}>
          <div className="d-flex justify-content-between align-items-start mb-3">
            {producto.category && (
              <Badge bg="primary" className="rounded-pill px-3 py-2 mb-2">
                {producto.category.name}
              </Badge>
            )}
            <Button
              variant={isFavorite ? "danger" : "outline-danger"}
              className="rounded-circle p-2"
              onClick={toggleFavorite}
              aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              {isFavorite ? <HeartFill size={20} /> : <Heart size={20} />}
            </Button>
          </div>

          <h1 className="fw-bold mb-3">{producto.title}</h1>

          <div className="d-flex align-items-center mb-4">
            {producto.user?.location && (
              <div className="me-4 d-flex align-items-center">
                <GeoAlt className="text-muted me-1" />
                <span className="text-muted">{producto.user.location}</span>
              </div>
            )}
            {producto.createdAt && (
              <div className="d-flex align-items-center">
                <Calendar3 className="text-muted me-1" />
                <span className="text-muted">{new Date(producto.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <h2 className="h3 fw-bold text-success mb-4">{producto.price} Créditos</h2>

          {producto.description && (
            <div className="mb-4">
              <h3 className="h5 fw-bold mb-2">Descripción</h3>
              <p className="text-muted">{producto.description}</p>
            </div>
          )}

          {/* Información del vendedor */}
          {producto.user && (
            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={producto.user.imageUrl || "/placeholder.svg?height=50&width=50"}
                    alt={producto.user.name}
                    className="rounded-circle me-3"
                    width="50"
                    height="50"
                  />
                  <div>
                    <div className="d-flex align-items-center">
                      <h4 className="h6 fw-bold mb-0 me-2">{producto.user.name}</h4>
                      {producto.user.verified && <CheckCircle className="text-success" title="Usuario verificado" />}
                    </div>
                    {producto.user.rating && (
                      <div className="d-flex align-items-center">
                        {renderStars(producto.user.rating)}
                        <span className="ms-1 small text-muted">({producto.user.rating})</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline-success"
                    className="ms-auto rounded-pill"
                    as={Link as any}
                    to={`/perfil/${producto.user.id}`}
                  >
                    Ver perfil
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}

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
                      {producto.category && (
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                          <span className="text-muted">Categoría</span>
                          <span className="fw-bold">{producto.category.name}</span>
                        </ListGroup.Item>
                      )}
                      {producto.status && (
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                          <span className="text-muted">Estado</span>
                          <span className="fw-bold">{producto.status}</span>
                        </ListGroup.Item>
                      )}
                      {producto.user?.location && (
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                          <span className="text-muted">Ubicación</span>
                          <span className="fw-bold">{producto.user.location}</span>
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </Col>
                  <Col md={6}>
                    <ListGroup variant="flush">
                      {producto.createdAt && (
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                          <span className="text-muted">Fecha de publicación</span>
                          <span className="fw-bold">{new Date(producto.createdAt).toLocaleDateString()}</span>
                        </ListGroup.Item>
                      )}
                      <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                        <span className="text-muted">ID del producto</span>
                        <span className="fw-bold">{producto.id}</span>
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
                <Alert variant="info">
                  <Alert.Heading>Información sobre políticas de intercambio</Alert.Heading>
                  <p>
                    Las políticas de intercambio específicas para este producto aún no están disponibles en el sistema.
                    Te recomendamos contactar directamente con el vendedor para conocer sus condiciones de intercambio.
                  </p>
                </Alert>
              </Card.Body>
            </Card>
          </Tab>
          <Tab eventKey="reviews" title="Reviews">
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body>
                <h4 className="h5 fw-bold mb-4">Reviews del producto</h4>

                {/* Formulario para añadir una valoración */}
                <Card className="mb-4 bg-light border-0">
                  <Card.Body>
                    <h5 className="h6 fw-bold mb-3">Deja tu valoración</h5>
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
                        Enviar valoración
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>

                {/* Lista de valoraciones */}
                {reviews.length > 0 ? (
                  <div>
                    {reviews.map((review) => (
                      <div key={review.id} className="mb-4 pb-4 border-bottom">
                        <div className="d-flex">
                          <img
                            src={review.user?.imageUrl || "/placeholder.svg?height=50&width=50"}
                            alt={review.user?.name || "Usuario"}
                            className="rounded-circle me-3"
                            width="50"
                            height="50"
                          />
                          <div>
                            <div className="d-flex align-items-center mb-2">
                              <h5 className="h6 fw-bold mb-0 me-2">{review.user?.name || "Usuario"}</h5>
                              <span className="text-muted small">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
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
                      Este producto aún no tiene valoraciones. ¡Sé el primero en opinar!
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </div>

      {/* Productos relacionados */}
      {productosRelacionados.length > 0 && (
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
                        src={prod.imageUrl || "/placeholder.svg?height=180&width=300"}
                        alt={prod.title}
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                      <Card.Body className="p-3">
                        {prod.category && (
                          <Badge bg="primary" className="mb-2 rounded-pill">
                            {prod.category.name}
                          </Badge>
                        )}
                        <Card.Title className="fw-bold text-dark mb-1" style={{ fontSize: "1rem" }}>
                          {prod.title}
                        </Card.Title>
                        <Card.Text className="text-muted small mb-2" style={{ height: "40px", overflow: "hidden" }}>
                          {prod.description}
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-success">{prod.price} Créditos</span>
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
      )}
    </Container>
  )
}

