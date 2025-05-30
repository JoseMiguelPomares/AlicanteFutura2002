"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Container, Row, Col, Card, Badge, Button, Form, Alert } from "react-bootstrap"
import {
  Search,
  Tag,
  Laptop,
  House,
  Book,
  Handbag,
  Tools,
  Controller,
  Basket,
  MusicNoteBeamed,
  Flower1,
  CarFrontFill,
  Bicycle,
  GeoAlt,
} from "react-bootstrap-icons"
import { ItemService } from "../services/itemService"
import { CategoryService } from "../services/categoryService"
import { ProductCard } from "../components/ProductCard"
import { useAuth } from "../contexts/AuthContext"

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

interface Categoria {
  id: number
  name: string
}

export const PaginaPorCategoria = () => {
  const { categoria } = useParams<{ categoria: string }>()
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productosMostrar, setProductosMostrar] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true)
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortBy, setSortBy] = useState<string>("recent")
  const [error, setError] = useState<string | null>(null)
  // Estado para ubicación y servicios cercanos
  const [ubicacionUsuario, setUbicacionUsuario] = useState<{ lat: number; lng: number } | null>(null)
  const [serviciosCercanos, setServiciosCercanos] = useState<Producto[]>([])
  const [mostrarSoloServiciosCercanos, setMostrarSoloServiciosCercanos] = useState(false)
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false)
  const itemService = new ItemService()
  const categoryService = new CategoryService()
  const { user } = useAuth();

  // Cargar categorías disponibles
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categoriasData = await categoryService.getAll()
        setCategorias(categoriasData)
      } catch (error) {
        console.error("Error al cargar categorías:", error)
      }
    }

    fetchCategorias()
  }, [])

  // Cargar productos por categoría
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true)
        setError(null)

        setProductosMostrar([]);

        if (!categoria) {
          throw new Error("Categoría no especificada")
        }

        console.log(`Buscando productos para la categoría: ${categoria}`)

        // Intentar obtener productos por categoría usando el servicio
        try {
          const response = await itemService.getByCategory(categoria)
          console.log("Productos obtenidos:", response.data)
          setProductos(response.data || [])
          setProductosMostrar(response.data || []);
        } catch (error) {
          console.error("Error al cargar productos por categoría desde API:", error)

          // Plan B: Cargar todos los productos y filtrar por categoría
          const allProducts = await itemService.getAll()
          console.log("Todos los productos:", allProducts)

          const filteredByCategory = allProducts.filter(
            (p: Producto) => p.category?.name?.toLowerCase() === categoria.toLowerCase(), // <-- Asegúrate de comparar en minúsculas
          )
          console.log("Productos filtrados por categoría:", filteredByCategory)
          setProductos(filteredByCategory);
          setProductosMostrar(filteredByCategory);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error)
        setError("No se pudieron cargar los productos. Por favor, inténtalo de nuevo.")
        setProductos([]);
        setProductosMostrar([]);
      } finally {
        setLoading(false)
      }
    }

    if (categoria) {
      fetchProductos()
    }
  }, [categoria])

  // Actualizar rango de precios cuando cambian los productos
  useEffect(() => {
    if (productos.length > 0) {
      const prices = productos.map((p) => p.price || 0)
      const minPrice = Math.min(...prices, 0)
      const maxPrice = Math.max(...prices, 1000)
      setPriceRange([minPrice, maxPrice])
    }
  }, [productos])

  // Función para obtener ubicación y servicios cercanos
  const obtenerServiciosCercanos = async () => {
    if (ubicacionUsuario) {
      return
    }

    setCargandoUbicacion(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setUbicacionUsuario({ lat: latitude, lng: longitude })

          try {
            const response = await itemService.getItemByRadius(latitude, longitude)
            const serviciosCercanosData = response.data.filter(
              (item: Producto) => item.status !== "Sold" && (!user || item.user?.id !== user.id),
            )
            setServiciosCercanos(serviciosCercanosData)
          } catch (error) {
            console.error("Error al obtener servicios y productos cercanos:", error)
          } finally {
            setCargandoUbicacion(false)
          }
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error)
          setCargandoUbicacion(false)
        },
      )
    } else {
      setCargandoUbicacion(false)
    }
  }

  // Filtrar y ordenar productos
  useEffect(() => {
    if (productos.length > 0) {
      let filtered = [...productos]

      // Si está activado el filtro de servicios cercanos, usar solo esos
      if (mostrarSoloServiciosCercanos) {
        // Filtrar servicios cercanos por la categoría actual
        filtered = serviciosCercanos.filter(
          (p) => categoria && p.category?.name?.toLowerCase() === categoria.toLowerCase(),
        )
      }

      // Filtrar productos vendidos
      filtered = filtered.filter(p => p.status !== "Sold")

      // Filtrar productos del usuario autenticado
      if (user) {
        filtered = filtered.filter(p => p.user?.id !== user.id);
      }

      // Filtrar por rango de precio
      filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

      // Ordenar productos
      switch (sortBy) {
        case "recent":
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        case "price_asc":
          filtered.sort((a, b) => a.price - b.price)
          break
        case "price_desc":
          filtered.sort((a, b) => b.price - a.price)
          break
        default:
          break
      }

      setFilteredProductos(filtered)
      setProductosMostrar(filtered)
    } else {
      setFilteredProductos([])
    }
  }, [productos, priceRange, sortBy, mostrarSoloServiciosCercanos, serviciosCercanos, categoria, user])

  // Función para determinar el icono según la categoría
  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case "juguetes":
        return <Controller className="text-danger" />
      case "ropa":
        return <Handbag className="text-primary" />
      case "calzado":
        return <Basket className="text-warning" />
      case "tecnología":
        return <Laptop className="text-info" />
      case "hogar":
        return <House className="text-success" />
      case "electrodomésticos":
        return <Tools className="text-secondary" />
      case "vehículos":
        return <CarFrontFill className="text-danger" />
      case "jardinería":
        return <Flower1 className="text-success" />
      case "deporte":
        return <Bicycle className="text-primary" />
      case "música":
        return <MusicNoteBeamed className="text-warning" />
      case "libros":
        return <Book className="text-info" />
      case "otros / servicios":
        return <Tag className="text-muted" />
      default:
        return <Tag className="text-muted" />
    }
  }

  const formatCategoryName = (name: string): string => {
    if (!name) return "";

    // Caso especial para "servicios" (individual o en combinaciones)
    const processedName = name.toLowerCase().trim();

    if (processedName === "servicios") return "Servicios";
    if (processedName.includes("servicios")) {
      return name
        .split(/(\/|\s+)/) // Divide por slash o espacios
        .map(word => {
          const lowerWord = word.toLowerCase();
          if (lowerWord === "servicios") return "Servicios";
          if (word === '/') return '/';
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ') // Une con espacios
        .replace(/\s+\/\s+/g, ' / '); // Normaliza espacios alrededor del slash
    }

    // Formato estándar para otras categorías
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Función para obtener el color de la categoría
  const getCategoryColor = (categoryName: string): string => {
    switch (categoryName.toLowerCase()) {
      case "juguetes":
        return "danger"
      case "ropa":
        return "primary"
      case "calzado":
        return "warning"
      case "tecnología":
        return "info"
      case "hogar":
        return "success"
      case "electrodomésticos":
        return "secondary"
      case "vehículos":
        return "danger"
      case "jardinería":
        return "success"
      case "deporte":
        return "primary"
      case "música":
        return "warning"
      case "libros":
        return "info"
      case "otros / servicios":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <Container className="py-5">
      <div className="d-flex align-items-center mb-4">
        {categoria && (
          <div className="me-3">
            <Badge bg={getCategoryColor(categoria)} className="p-2 rounded-pill">
              {getCategoryIcon(categoria)}
              <span className="ms-2 fs-6">{formatCategoryName(categoria)}</span>
            </Badge>
          </div>
        )}
        <h1 className="mb-0">Productos en {formatCategoryName(categoria || "")}</h1>
      </div>

      <Row>
        {/* Filtros laterales */}
        <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="fw-bold mb-3">Filtros</h5>

              {/* Ordenar por */}
              <div className="mb-4">
                <h6 className="fw-bold mb-2">Ordenar por</h6>
                <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="mb-3">
                  <option value="recent">Más recientes</option>
                  <option value="price_asc">Precio: menor a mayor</option>
                  <option value="price_desc">Precio: mayor a menor</option>
                </Form.Select>
              </div>

              {/* Filtro por precio */}
              <div>
                <h6 className="fw-bold mb-2">Precio (Créditos)</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>{priceRange[0]}</span>
                  <span>{priceRange[1]}</span>
                </div>
                <Form.Range
                  min={0}
                  max={1000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                />
              </div>
              {/* Filtro por servicios cercanos */}
              <div className="mb-4">
                <h6 className="fw-bold mb-2">
                  <GeoAlt className="me-1" />
                  Servicios y Productos cercanos
                </h6>
                <Form.Check
                  type="checkbox"
                  id="servicios-cercanos"
                  className="mb-2"
                  label={
                    <div>
                      <div className="fw-medium">Sólo servicios y productos cercanos</div>
                      <small className="text-muted">Encuentra servicios en tu área</small>
                    </div>
                  }
                  checked={mostrarSoloServiciosCercanos}
                  onChange={(e) => {
                    const checked = e.target.checked
                    setMostrarSoloServiciosCercanos(checked)
                    if (checked && !ubicacionUsuario) {
                      obtenerServiciosCercanos()
                    }
                  }}
                />

                {cargandoUbicacion && (
                  <div className="text-center mt-2">
                    <div className="spinner-border spinner-border-sm text-success me-2" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <small className="text-muted">Obteniendo ubicación...</small>
                  </div>
                )}

                {mostrarSoloServiciosCercanos &&
                  serviciosCercanos.length === 0 &&
                  !cargandoUbicacion &&
                  ubicacionUsuario && (
                    <small className="text-muted">No se encontraron servicios cercanos en esta categoría</small>
                  )}

                {mostrarSoloServiciosCercanos && !ubicacionUsuario && !cargandoUbicacion && (
                  <small className="text-warning">Activa la ubicación para ver servicios cercanos</small>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Categorías relacionadas */}
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
              <h5 className="fw-bold mb-3">Categorías</h5>
              <div className="d-flex flex-column gap-2">
                {categorias.slice(0, 12).map((cat) => (
                  <Button
                    key={cat.id}
                    as={Link as any}
                    to={`/categoria/${encodeURIComponent(cat.name.toLowerCase())}`}
                    variant={
                      cat.name.toLowerCase() === categoria?.toLowerCase()
                        ? getCategoryColor(cat.name)
                        : `outline-${getCategoryColor(cat.name)}`
                    }
                    className="text-start rounded-pill"
                    size="sm"
                  >
                    {getCategoryIcon(cat.name)} {formatCategoryName(cat.name)}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Resultados */}
        <Col md={9}>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3">Buscando productos...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : mostrarSoloServiciosCercanos && cargandoUbicacion ? (
            // Añade esta nueva condición para mostrar el estado de carga
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3">Obteniendo servicios y productos cercanos...</p>
            </div>
          ) : filteredProductos.length > 0 ? (
            <>
              <p className="mb-4">Se encontraron {filteredProductos.length} productos en esta categoría</p>
              <Row xs={1} sm={2} md={3} className="g-4">
                {productosMostrar.map((producto) => (
                  <Col key={producto.id}>
                    <ProductCard producto={producto} />
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            <div className="text-center py-5">
              <div className="mb-4">
                <Search size={60} className="text-muted" />
              </div>
              <h3>No se encontraron productos</h3>
              <p className="text-muted">No hay productos disponibles en esta categoría actualmente.</p>
              <Button as={Link as any} to="/" variant="success" className="mt-3">
                Volver al inicio
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  )
}