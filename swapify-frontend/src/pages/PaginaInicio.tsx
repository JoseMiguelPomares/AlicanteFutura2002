"use client"

import { Link } from "react-router-dom"
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ItemService } from "../services/itemService"
import { CategoryService } from "../services/categoryService"
import {
  ArrowRight,
  Star,
  GraphUp,
  Gift,
  Award,
  ArrowDownCircle,
  Tag,
  Laptop,
  House,
  Book,
  Handbag,
  Tools,
  Mortarboard,
  Truck,
} from "react-bootstrap-icons"
import { useNavigate } from "react-router-dom" // <-- Agrega esta línea

// Actualizar la interfaz Producto para reflejar la estructura de la base de datos
interface Producto {
  id: number
  title: string
  description: string
  category_id: number
  category: {
    id: number
    name: string
  }
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
  const navigate = useNavigate() // <-- Agrega esta línea

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true)

        // Cargar productos
        const data = await itemService.getAll()
        console.log("Productos cargados:", data)
        setProductos(data)

        // Cargar productos recientes
        const recentProducts = await itemService.getRecentItems()
        console.log("Productos recientes:", recentProducts)

        // Cargar categorías desde el servicio
        const categoryService = new CategoryService()
        try {
          const categoriasData = await categoryService.getAll()
          console.log("Categorías cargadas:", categoriasData)
          // Añadir "Todos" al inicio del array de categorías
          const categoriasUnicas = ["Todos", ...categoriasData.map((cat: any) => cat.name)]
          setCategorias(categoriasUnicas)
        } catch (error) {
          console.error("Error al cargar categorías:", error)
          // Fallback: extraer categorías de los productos si falla la API
          const categoriasSet = new Set(data.map((p: Producto) => p.category?.name || "otros"))
          const categoriasUnicas = ["Todos", ...Array.from(categoriasSet)] as string[]
          setCategorias(categoriasUnicas)
        }

        // Filtrar productos para diferentes secciones
        setProductosFiltrados({
          destacados: data.slice(0, 4),
          recientes: recentProducts.data.slice(0, 4), // Usar los productos recientes de la API
          populares: data.slice(8, 12),
        })

        setCargando(false)
      } catch (error: any) {
        setError("No se pudieron cargar los productos")
        setCargando(false)
        console.error(error)
      }
    }

    fetchData()
  }, [])

  const productosMostrados =
    categoriaActiva === "Todos" ? productos : productos.filter((p) => p.category?.name === categoriaActiva)

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
      {/* Hero Banner con diseño limpio */}
      <div
        className="position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9f7ef 100%)",
          minHeight: "600px",
          paddingTop: "35px",
          paddingBottom: "80px",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <span className="badge bg-success px-3 py-2 mb-3 rounded-pill">Plataforma de intercambio</span>
                <h1 className="display-4 fw-bold mb-3" style={{ color: "#1a3c34" }}>
                  Intercambia, Ahorra y <span className="text-success">Conecta</span>
                </h1>
                <p className="fs-5 mb-4 text-dark">
                  Descubre una nueva forma de consumo sostenible. Intercambia productos y servicios con personas cerca
                  de ti sin usar dinero.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Button
                    as={Link as any}
                    to="/registro"
                    variant="success"
                    size="lg"
                    className="fw-bold shadow-sm px-4 py-3"
                  >
                    Únete Ahora
                  </Button>
                  <Button
                    variant="outline-success"
                    size="lg"
                    as={Link as any}
                    to="/como-funciona"
                    className="px-4 py-3"
                  >
                    Cómo Funciona
                  </Button>
                </div>

                <div className="d-flex gap-4 mt-5">
                  <div className="text-center">
                    <h3 className="fw-bold text-success mb-0">1200+</h3>
                    <p className="text-dark">Usuarios</p>
                  </div>
                  <div className="text-center">
                    <h3 className="fw-bold text-success mb-0">3500+</h3>
                    <p className="text-dark">Productos</p>
                  </div>
                  <div className="text-center">
                    <h3 className="fw-bold text-success mb-0">98%</h3>
                    <p className="text-dark">Satisfacción</p>
                  </div>
                </div>
              </motion.div>
            </Col>
            <Col lg={6} className="position-relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="position-relative"
                style={{ zIndex: 2 }}
              >
                <div className="position-relative rounded-4 overflow-hidden shadow-lg" style={{ height: "400px" }}>
                  <img
                    src="https://images.unsplash.com/photo-1574740981348-fe6e45e9a294?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNvbmV4aW9uJTIwdHJ1ZXF1ZXxlbnwwfDB8MHx8fHwy%3D0"
                    alt="Swapify Intercambios"
                    className="img-fluid w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                  <div
                    className="position-absolute bottom-0 start-0 w-100 p-4 text-white"
                    style={{
                      background: "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                    }}
                  >
                    <h4 className="fw-bold mb-0">Intercambios sostenibles</h4>
                    <p className="mb-0">Únete a la comunidad de intercambio más grande</p>
                  </div>
                </div>

                {/* Elementos decorativos sutiles */}
                <div className="position-absolute" style={{ top: "-20px", right: "-20px", zIndex: -1 }}>
                  <div
                    className="rounded-circle bg-success bg-opacity-10"
                    style={{ width: "200px", height: "200px" }}
                  ></div>
                </div>
                <div className="position-absolute" style={{ bottom: "-30px", left: "-30px", zIndex: -1 }}>
                  <div
                    className="rounded-circle bg-primary bg-opacity-10"
                    style={{ width: "150px", height: "150px" }}
                  ></div>
                </div>
              </motion.div>
            </Col>
          </Row>

          {/* Flecha hacia abajo */}
          <div className="text-center mt-5">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
              <ArrowDownCircle size={40} className="text-success opacity-75" />
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Productos Destacados */}
      <Container className="my-5">
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
      <div className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <Container className="mb-5">
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
      </div>

      {/* Sección de Beneficios */}
      <Container className="mb-5 py-5">
        <h2 className="text-center fw-bold mb-5">¿Por qué elegir Swapify?</h2>
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

      {/* Sección de Categorías */}
      <div className="py-1" style={{ backgroundColor: "#f8f9fa" }}>
        <Container>
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
                // Cambia el onClick para navegar a la página de categoría
                onClick={() => {
                  if (categoria === "Todos") {
                    setCategoriaActiva("Todos")
                  } else {
                    navigate(`/categoria/${encodeURIComponent(categoria)}`)
                  }
                }}
              >
                {categoria}
              </Button>
            ))}
          </div>
        </Container>
      </div>
      <div className="py-3" style={{ backgroundColor: "#f8f9fa" }}>
        <Container className="mb-5">
          <h3 className="fw-bold mb-4">Productos y Servicios</h3>
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
              <h2 className="display-5 fw-bold mb-3">¿Tienes algo para intercambiar?</h2>
              <p className="fs-5 mb-4 opacity-75">
                Únete a nuestra comunidad y comienza a intercambiar tus productos hoy mismo. Más de 3,500 productos
                esperan por ti.
              </p>
              <Button variant="light" size="lg" className="fw-bold shadow-sm px-4" as={Link as any} to="/vender">
                Publicar Producto
              </Button>
            </Col>
            <Col lg={5} className="text-center mt-5 mt-md-0">
              <img
                src="https://images.unsplash.com/photo-1523495225575-104bd7a11999?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2xvYmFsfGVufDB8fDB8fHwy"
                alt="Eco-friendly"
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


const ProductCard = ({ producto }: { producto: Producto }) => {
  // Función para determinar el icono según la categoría
  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case "electrónica":
      case "tecnología":
        return <Laptop className="me-1" />
      case "hogar":
        return <House className="me-1" />
      case "libros":
        return <Book className="me-1" />
      case "moda":
      case "ropa":
      case "calzado":
        return <Handbag className="me-1" />
      case "reparaciones":
        return <Tools className="me-1" />
      case "clases":
        return <Mortarboard className="me-1" />
      case "transporte":
      case "vehículos":
        return <Truck className="me-1" />
      default:
        return <Tag className="me-1" />
    }
  }

  // Función para determinar el color del badge según la categoría
  const getCategoryColor = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case "electrónica":
      case "tecnología":
        return "primary"
      case "hogar":
        return "success"
      case "libros":
        return "info"
      case "moda":
      case "ropa":
      case "calzado":
        return "danger"
      case "reparaciones":
        return "warning"
      case "clases":
        return "primary"
      case "transporte":
        return "success"
      case "vehículos":
        return "success"
      default:
        return "secondary"
    }
  }

  // Obtener el nombre de la categoría de forma segura
  const categoryName = producto.category?.name || "otros"

  // Determinar si es un producto o servicio
  const isService = ["reparaciones", "clases", "transporte"].includes(categoryName.toLowerCase())

  // Imagen por defecto en caso de que no haya imagen de producto
  const defaultImage = "https://images.unsplash.com/photo-1699645522859-512f53d4a4bf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZmFsbG98ZW58MHx8MHx8fDI%3D"

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Link to={`/productos/${producto.id}`} className="text-decoration-none">
        <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="position-relative" style={{ height: "200px" }}>
            <Card.Img
              variant="top"
              src={producto.imageUrl || defaultImage}
              alt={producto.title}
              className="img-fluid h-100"
              style={{ objectFit: "cover" }}
            />
            <Badge
              bg={getCategoryColor(categoryName)}
              className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill"
            >
              {getCategoryIcon(categoryName)}
              {categoryName}
            </Badge>

            {isService && (
              <div
                className="position-absolute bottom-0 start-0 w-100 p-2 text-white"
                style={{
                  background: "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                }}
              >
                <span className="badge bg-warning text-dark rounded-pill">Servicio</span>
              </div>
            )}
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

