"use client"

import { Link } from "react-router-dom"
import { Container, Row, Col, Button, Alert } from "react-bootstrap"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ItemService } from "../services/itemService"
import { CategoryService } from "../services/categoryService"
import React, { Suspense } from "react"
import {
  ArrowRight,
  Star,
  GraphUp,
  Gift,
  Award,
  ArrowDownCircle,
  GeoAlt,
} from "react-bootstrap-icons"
import { useNavigate } from "react-router-dom" // <-- Agrega esta línea
import { useAuth } from "../contexts/AuthContext"
import { useFavorites } from "../contexts/FavoritesContext"

const ProductCard = React.lazy(() => import("../components/ProductCard"))

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
  price: number
  user?: {
    id: number
    name: string
    location?: string
  }
  location?: string
  itemCondition?: string
}

export const PaginaInicio = () => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [categoriaActiva, setCategoriaActiva] = useState<string>("Todos")
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState<boolean>(true)
  const [esPantallaPequena, setEsPantallaPequena] = useState<boolean>(window.innerWidth < 768)
  const [mostrarTodasCategorias, setMostrarTodasCategorias] = useState<boolean>(false)

  const { getFavoritesCount, loading: favoritesLoading } = useFavorites()
  const itemService = useRef(new ItemService()).current
  const navigate = useNavigate()
  const { user } = useAuth();

  // Función para obtener productos más favoritos con memoización
  const getProductosMasFavoritos = useCallback((productos: Producto[]) => {
    return [...productos]
      .map(p => ({
        ...p,
        favoritos: getFavoritesCount(p.id)
      }))
      .sort((a, b) => b.favoritos - a.favoritos)
      .slice(0, 4)
  }, [getFavoritesCount])

  const shouldHideProduct = (producto: Producto) => {
    // No ocultar nada mientras auth está en progreso (undefined)
    if (user === undefined) return false;

    // Ocultar SOLO si hay un usuario logueado y es el dueño
    return user !== null && producto.user?.id === user.id;
  };

  // Productos filtrados con memoización
  const [serviciosCercanos, setServiciosCercanos] = useState<Producto[]>([]);
  const productosFiltrados = useMemo(() => {
    if (productos.length === 0) return {
      destacados: [],
      recientes: [],
      populares: [],
      servicios: [],
      serviciosCercanos: []
    }

    const productosDisponibles = productos.filter(p => p.status !== "Sold" && !shouldHideProduct(p))
    const servicios = productosDisponibles.filter(p => p.category?.name?.toLowerCase() === "otros")

    return {
      destacados: getProductosMasFavoritos(productosDisponibles),
      recientes: [...productosDisponibles]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4),
      populares: productosDisponibles
        .filter(p => p.category?.name?.toLowerCase() !== "otros")
        .slice(8, 12),
      servicios: servicios.slice(0, 4),
      serviciosCercanos: serviciosCercanos.slice(0, 4) // Usamos el estado ya filtrado
    }
  }, [productos, user, serviciosCercanos, getProductosMasFavoritos])

  const [ubicacionUsuario, setUbicacionUsuario] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if (user === undefined) return; // Espera a que auth se resuelva

    const obtenerUbicacion = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUbicacionUsuario({ lat: latitude, lng: longitude });

            try {
              const response = await itemService.getItemByRadius(latitude, longitude);
              const serviciosCercanos = response.data.filter(
                (item: Producto) => item.category?.name?.toLowerCase() === 'otros' && item.status !== 'Sold' && !shouldHideProduct(item)
              );
              setServiciosCercanos(serviciosCercanos);
            } catch (error) {
              console.error('Error al obtener servicios cercanos:', error);
            }
          },
          (error) => {
            console.error('Error al obtener la ubicación:', error);
          }
        );
      }
    };

    obtenerUbicacion();
  }, [user]);

  // Productos mostrados según categoría activa
  const productosMostrados = useMemo(() => {
    return categoriaActiva === "Todos"
      ? productos.filter(p => p.status !== "Sold" && !shouldHideProduct(p))
      : productos.filter(p => p.status !== "Sold" && p.category?.name === categoriaActiva && !shouldHideProduct(p))
  }, [categoriaActiva, productos, user])

  // Productos aleatorios
  const productosAleatorios = useMemo(() => {
    const shuffled = [...productosMostrados].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 20)
  }, [productosMostrados])

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setEsPantallaPequena(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true)
        const data = await itemService.getAll()
        setProductos(data)

        // Cargar categorías
        const categoryService = new CategoryService()
        try {
          const categoriasData = await categoryService.getAll()
          setCategorias(["Todos", ...categoriasData.map((cat: any) => cat.name)])
        } catch (error) {
          console.error("Error al cargar categorías:", error)
          const categoriasSet = new Set(data.map((p: Producto) => p.category?.name || "otros"))
          setCategorias(["Todos", ...Array.from(categoriasSet) as string[]])
        }
      } catch (error: any) {
        setError("No se pudieron cargar los productos")
        console.error(error)
      } finally {
        setCargando(false)
      }
    }

    fetchData()
  }, [itemService, user])

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

  if (cargando || favoritesLoading)
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

      {/* Servicios cercanos */}
      <section className="my-5">
        <Container>
          {serviciosCercanos.length > 0 ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">
                  <GeoAlt className="me-2 text-danger" />
                  Servicios cerca de mí
                </h2>
              </div>

              <Row xs={1} sm={2} md={2} lg={4} className="g-4">
                {serviciosCercanos.map((producto) => (
                  <Col key={`cercano-${producto.id}`}>
                    <Suspense fallback={<div>Cargando tarjeta...</div>}>
                      <ProductCard producto={producto} />
                    </Suspense>
                  </Col>
                ))}
              </Row>
            </>
          ) : ubicacionUsuario ? (
            <Alert variant="info" className="mt-3" dismissible>
              No se encontraron servicios cercanos en tu ubicación.
            </Alert>
          ) : user ? (
            <Alert variant="info" className="mt-3" dismissible>
              Activa la ubicación para ver servicios cercanos a ti.
            </Alert>
          ) : null}
        </Container>
      </section>

      {/* Productos Destacados */}
      <Container className="my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">
            <Star className="text-warning me-2" /> Productos Destacados
          </h2>
        </div>

        <Row xs={1} sm={2} md={2} lg={4} className="g-4">
          {productosFiltrados.destacados.map((producto) => (
            <Col key={`destacado-${producto.id}`}>
              <Suspense fallback={<div>Cargando tarjeta...</div>}>
                <ProductCard producto={producto} />
              </Suspense>
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
          </div>

          <Row xs={1} sm={2} md={2} lg={4} className="g-4">
            {productosFiltrados.recientes.map((producto) => (
              <Col key={`reciente-${producto.id}`}>
                <Suspense fallback={<div>Cargando tarjeta...</div>}>
                  <ProductCard producto={producto} />
                </Suspense>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Sección: Servicios disponibles */}
      {productosFiltrados.servicios.length > 0 && (
        <Container className="py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 fw-bold mb-0">Servicios disponibles</h2>
            <Button
              as={Link as any}
              to="/categoria/otros"
              variant="link"
              className="text-decoration-none text-success"
            >
              Ver todos <ArrowRight />
            </Button>
          </div>

          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {productosFiltrados.servicios.map((producto) => (
              <Col key={producto.id}>
                <Suspense fallback={<div className="card shadow-sm" style={{ height: "300px" }}></div>}>
                  <ProductCard producto={producto} />
                </Suspense>
              </Col>
            ))}
          </Row>
        </Container>
      )}
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
          </div>
          <div className="d-flex flex-wrap gap-2 mb-4">
            {categorias
              .slice(0, esPantallaPequena && !mostrarTodasCategorias ? 4 : categorias.length)
              .map((categoria, index) => (
                <Button
                  key={index}
                  variant={categoriaActiva === categoria ? "success" : "outline-success"}
                  className="rounded-pill px-4 py-2"
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
            {esPantallaPequena && categorias.length > 4 && (
              <Button
                variant="outline-primary"
                className="rounded-pill btn-sm btn-fixed"
                onClick={() => setMostrarTodasCategorias(!mostrarTodasCategorias)}
              >
                {mostrarTodasCategorias ? "Ver menos" : "Ver más..."}
              </Button>
            )}
          </div>
        </Container>
      </div>
      <div className="py-3" style={{ backgroundColor: "#f8f9fa" }}>
        <Container className="mb-5">
          <h3 className="fw-bold mb-4">Productos y Servicios</h3>
          <Row xs={2} sm={2} md={3} lg={4} className="g-4">
            {productosAleatorios.map((producto) => (
              <Col key={producto.id}>
                <Suspense fallback={<div>Cargando tarjeta...</div>}>
                  <ProductCard producto={producto} />
                </Suspense>
              </Col>
            ))}
          </Row>
          {productosAleatorios.length === 0 && (
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
