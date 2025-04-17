"use client"

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
  ShieldCheck,
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
  category: {
    id: number
    name: string
  }
  status: string
  createdAt: string
  user: {
    id: number
    name: string
    email: string
    passwordHash?: string
    location?: string
    credits?: number
    reputation?: number
    createdAt?: string
    socialId?: string | null
    imageUrl?: string | null
  }
  itemCondition?: string | null
  location?: string
}

export const PaginaProducto = () => {
  const { id } = useParams<{ id: string }>()
  const idNumber = Number(id)
  const [producto, setProducto] = useState<Producto | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [productosRelacionados, setProductosRelacionados] = useState<Producto[]>([])
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

        // Usar el método mejorado para obtener el item con relaciones
        const response = await itemService.getItemById(idNumber)

        if (!response || !response.data) {
          throw new Error("Producto no encontrado")
        }

        console.log("Datos del producto:", response.data) // Para depuración

        // Guardar los datos del producto
        setProducto(response.data)

        // Buscar productos relacionados usando el nuevo método optimizado
        if (response.data.category?.id) {
          const relacionados = await itemService.getRelatedProducts(idNumber, response.data.category.id)
          setProductosRelacionados(relacionados)
        }

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

  // Obtener el usuario del producto
  const user = producto.user

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
            {producto.location && (
              <div className="me-4 d-flex align-items-center">
                <GeoAlt className="text-muted me-1" />
                <span className="text-muted">{producto.location}</span>
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

          {/* Información del vendedor - Versión mejorada y robusta */}
          {user && (
            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Body>
                <h4 className="h5 fw-bold mb-3">Información del vendedor</h4>

                <div className="d-flex mb-4">
                  <div className="position-relative me-3">
                    <img
                      src={user.imageUrl || "/placeholder.svg?height=80&width=80"}
                      alt={user.name}
                      className="rounded-circle"
                      width="80"
                      height="80"
                      style={{ objectFit: "cover" }}
                    />
                    {/* Badge de verificación (podría ser basado en la reputación) */}
                    {user.reputation && user.reputation > 4.5 && (
                      <Badge
                        bg="success"
                        className="position-absolute bottom-0 end-0 rounded-circle p-1"
                        title="Usuario verificado"
                      >
                        <CheckCircle size={16} />
                      </Badge>
                    )}
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="fw-bold mb-1">{user.name}</h5>
                        {user.reputation !== undefined && (
                          <div className="d-flex align-items-center mb-2">
                            {renderStars(user.reputation)}
                            <span className="ms-2 text-muted">({user.reputation.toFixed(1)})</span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline-success"
                        className="rounded-pill"
                        as={Link as any}
                        to={`/perfil/${user.id}`}
                      >
                        Ver perfil
                      </Button>
                    </div>

                    <div className="d-flex flex-wrap gap-3 mt-2">
                      {user.createdAt && (
                        <div className="d-flex align-items-center text-muted small">
                          <Calendar3 className="me-1" />
                          <span>Miembro desde {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      {/* Podríamos añadir más información del usuario aquí */}
                    </div>
                  </div>
                </div>

                {/* Garantías */}
                <div className="mt-3 pt-3 border-top">
                  <div className="d-flex align-items-center">
                    <ShieldCheck className="text-success me-2" size={20} />
                    <span className="small">Este vendedor cumple con las políticas de Swapify</span>
                  </div>
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
                      {producto.location && (
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                          <span className="text-muted">Ubicación</span>
                          <span className="fw-bold">{producto.location}</span>
                        </ListGroup.Item>
                      )}
                      {producto.itemCondition && (
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                          <span className="text-muted">Condición</span>
                          <span className="fw-bold">{producto.itemCondition.replace("_", " ")}</span>
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
