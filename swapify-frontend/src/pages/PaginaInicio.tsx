"use client"

import { Link } from "react-router-dom"
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ItemService } from "../services/itemService"
import { ArrowRight, Star, GraphUp, Gift, Award } from "react-bootstrap-icons"

// Define la interfaz Producto
interface Producto {
  id: number
  title: string
  description: string
  category: string
  imageUrl: string
  status: string
  createdAt: string
}

export const PaginaInicio = () => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [productosFiltrados, setProductosFiltrados] = useState<Record<string, Producto[]>>({
    destacados: [],
    recientes: [],
    populares: [],
  })
  const [categorias, setCategorias] = useState<string[]>([])
  const [categoriaActiva, setCategoriaActiva] = useState<string>("Todos")
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState<boolean>(true)
  const itemService = useRef(new ItemService()).current

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setCargando(true)
        const data = await itemService.getAll()
        setProductos(data)

        // Extraer categorías únicas con tipado correcto
        const categoriasSet = new Set(data.map((p: Producto) => p.category))
        const categoriasUnicas = ["Todos", ...Array.from(categoriasSet)] as string[]
        setCategorias(categoriasUnicas)

        // Filtrar productos para diferentes secciones
        setProductosFiltrados({
          destacados: data.slice(0, 4),
          recientes: data.slice(4, 8),
          populares: data.slice(8, 12),
        })

        setCargando(false)
      } catch (error: any) {
        setError("No se pudieron cargar los productos")
        setCargando(false)
        console.error(error)
      }
    }

    fetchProductos()
  }, [])

  const filtrarPorCategoria = (categoria: string) => {
    setCategoriaActiva(categoria)
  }

  const productosMostrados =
    categoriaActiva === "Todos" ? productos : productos.filter((p) => p.category === categoriaActiva)

  if (error)
    return (
      <Container className="text-center py-5">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h3 className="text-danger mb-3">¡Ups! Algo salió mal</h3>
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Intentar nuevamente
          </Button>
        </motion.div>
      </Container>
    )

  if (cargando)
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando productos increíbles para ti...</p>
      </Container>
    )

  return (
    <>
      {/* Hero Banner */}
      <motion.div
        className="position-relative overflow-hidden py-5 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          background: "linear-gradient(135deg, rgba(32,176,61,0.9) 0%, rgba(163,208,161,0.8) 100%)",
          minHeight: "400px",
        }}
      >
        <Container className="position-relative">
          <Row className="align-items-center">
            <Col lg={6} className="text-white">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h1 className="display-4 fw-bold mb-3 shadow-text">Intercambia, Ahorra y Conecta</h1>
                <p className="fs-5 mb-4">
                  Descubre una nueva forma de consumo sostenible. Intercambia productos y servicios con personas cerca
                  de ti.
                </p>
                <div className="d-flex gap-3">
                  <Button as={Link as any} to="/registro" variant="light" size="lg" className="fw-bold shadow-sm">
                    Únete Ahora
                  </Button>
                  <Button variant="outline-light" size="lg" as={Link as any} to="/como-funciona">
                    Cómo Funciona
                  </Button>
                </div>
              </motion.div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <motion.img
                src="/placeholder.svg?height=400&width=500"
                alt="Swapify Intercambios"
                className="img-fluid rounded-4 shadow-lg"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </Col>
          </Row>
        </Container>
      </motion.div>

      {/* Sección de Categorías */}
      <Container className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Explora por Categoría</h2>
          <Link to="/categorias" className="text-decoration-none text-success fw-bold">
            Ver todas <ArrowRight />
          </Link>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-4">
          {categorias.map((categoria, index) => (
            <Button
              key={index}
              variant={categoriaActiva === categoria ? "success" : "outline-success"}
              className="rounded-pill px-4 py-2"
              onClick={() => filtrarPorCategoria(categoria)}
            >
              {categoria}
            </Button>
          ))}
        </div>
      </Container>

      {/* Productos Destacados */}
      <Container className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">
            <Star className="text-warning me-2" /> Productos Destacados
          </h2>
          <Link to="/destacados" className="text-decoration-none text-success fw-bold">
            Ver más <ArrowRight />
          </Link>
        </div>

        <Row xs={1} sm={2} md={2} lg={4} className="g-4">
          {productosFiltrados.destacados.map((producto) => (
            <Col key={`destacado-${producto.id}`}>
              <ProductCard producto={producto} />
            </Col>
          ))}
        </Row>
      </Container>

      {/* Productos Recientes */}
      <Container className="mb-5 py-5 bg-light rounded-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">
            <GraphUp className="text-primary me-2" /> Recién Añadidos
          </h2>
          <Link to="/recientes" className="text-decoration-none text-success fw-bold">
            Ver más <ArrowRight />
          </Link>
        </div>

        <Row xs={1} sm={2} md={2} lg={4} className="g-4">
          {productosFiltrados.recientes.map((producto) => (
            <Col key={`reciente-${producto.id}`}>
              <ProductCard producto={producto} />
            </Col>
          ))}
        </Row>
      </Container>

      {/* Sección de Beneficios */}
      <Container className="mb-5">
        <h2 className="text-center fw-bold mb-4">¿Por qué elegir Swapify?</h2>
        <Row xs={1} md={3} className="g-4 text-center">
          <Col>
            <motion.div
              className="p-4 h-100 rounded-4 shadow-sm border"
              whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            >
              <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                <Gift className="text-success" size={30} />
              </div>
              <h3 className="h5 fw-bold">Ahorra Dinero</h3>
              <p className="text-muted">Intercambia en lugar de comprar y ahorra dinero mientras reduces el consumo.</p>
            </motion.div>
          </Col>
          <Col>
            <motion.div
              className="p-4 h-100 rounded-4 shadow-sm border"
              whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            >
              <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                <Award className="text-success" size={30} />
              </div>
              <h3 className="h5 fw-bold">Calidad Garantizada</h3>
              <p className="text-muted">Todos los productos son verificados por nuestra comunidad de usuarios.</p>
            </motion.div>
          </Col>
          <Col>
            <motion.div
              className="p-4 h-100 rounded-4 shadow-sm border"
              whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            >
              <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                <GraphUp className="text-success" size={30} />
              </div>
              <h3 className="h5 fw-bold">Consumo Sostenible</h3>
              <p className="text-muted">Contribuye a un mundo más sostenible reutilizando productos existentes.</p>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* Todos los Productos */}
      <Container className="mb-5">
        <h2 className="fw-bold mb-4">Todos los Productos</h2>
        <Row xs={2} sm={2} md={3} lg={4} className="g-4">
          {productosMostrados.map((producto) => (
            <Col key={producto.id}>
              <ProductCard producto={producto} />
            </Col>
          ))}
        </Row>

        {productosMostrados.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted">No hay productos disponibles en esta categoría.</p>
          </div>
        )}
      </Container>

      {/* CTA Final */}
      <Container
        fluid
        className="py-5 mb-5 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(32,176,61,0.9) 0%, rgba(163,208,161,0.8) 100%)",
        }}
      >
        <Container>
          <h2 className="text-white fw-bold mb-3">¿Tienes algo para intercambiar?</h2>
          <p className="text-white mb-4">
            Únete a nuestra comunidad y comienza a intercambiar tus productos hoy mismo.
          </p>
          <Button variant="light" size="lg" className="fw-bold shadow-sm" as={Link as any} to="/vender">
            Publicar Producto
          </Button>
        </Container>
      </Container>
    </>
  )
}

// Componente de tarjeta de producto
const ProductCard = ({ producto }: { producto: Producto }) => {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Link to={`/productos/${producto.id}`} className="text-decoration-none">
        <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="position-relative">
            <Card.Img
              variant="top"
              src={producto.imageUrl}
              alt={producto.title}
              className="img-fluid"
              style={{ height: "200px", objectFit: "cover" }}
            />
            <Badge bg="success" className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill">
              {producto.category}
            </Badge>
          </div>
          <Card.Body className="d-flex flex-column p-3">
            <Card.Title
              className="fw-bold text-dark mb-1"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {producto.title}
            </Card.Title>
            <Card.Text
              className="text-muted small mb-3"
              style={{
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                lineHeight: "1.3rem",
                height: "2.6rem",
              }}
            >
              {producto.description}
            </Card.Text>
            <div className="mt-auto d-flex justify-content-between align-items-center">
              <small className="text-muted">{new Date(producto.createdAt).toLocaleDateString()}</small>
              <Button variant="outline-success" size="sm" className="rounded-pill px-3">
                Ver más
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Link>
    </motion.div>
  )
}

