"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Accordion, ListGroup } from "react-bootstrap"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Search,
  Tag,
  Laptop,
  House,
  Book,
  Handbag,
  Tools,
  Mortarboard,
  Truck,
  GeoAlt,
  Funnel,
  FunnelFill,
  ArrowClockwise,
  XCircle,
} from "react-bootstrap-icons"
import { ItemService } from "../services/itemService"
import { CategoryService } from "../services/categoryService"
import { ProductCard } from "../components/ProductCard"
import { StableInput } from "../components/StableInput"
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
  itemCondition?: string
  location?: string
  user?: {
    id: number
    name: string
  }
}

// Interfaz para los filtros
interface Filtros {
  categorias: number[]
  ubicacion: string
  precioMin: number
  precioMax: number
  estado: string[]
  publicadoHace: string
}

// Mapeo de estados del producto para mostrar descripciones amigables
const ESTADOS_PRODUCTO = [
  { valor: "nuevo", etiqueta: "Nuevo", descripcion: "Nunca se ha usado" },
  { valor: "como_nuevo", etiqueta: "Como nuevo", descripcion: "En perfectas condiciones" },
  { valor: "bueno", etiqueta: "En buen estado", descripcion: "Bastante usado, pero bien conservado" },
  { valor: "aceptable", etiqueta: "En condiciones aceptables", descripcion: "Con evidentes signos de desgaste" },
  { valor: "usado", etiqueta: "Lo ha dado todo", descripcion: "Puede que toque repararlo" },
]

// Opciones para el filtro de tiempo
const OPCIONES_TIEMPO = [
  { valor: "todos", etiqueta: "Todos" },
  { valor: "24h", etiqueta: "24 horas" },
  { valor: "7d", etiqueta: "7 días" },
  { valor: "30d", etiqueta: "30 días" },
]

export const PaginaBusqueda = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchTerm, setSearchTerm] = useState(query)
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([])
  const { user } = useAuth();

  // Estado para las categorías
  const [, setCategorias] = useState<{ id: number; name: string; parent_id?: number }[]>([])
  const [categoriasAgrupadas, setCategoriasAgrupadas] = useState<{ [key: string]: { id: number; name: string }[] }>({})

  // Estado para los filtros
  const [filtros, setFiltros] = useState<Filtros>({
    categorias: [],
    ubicacion: "",
    precioMin: 0,
    precioMax: 1000,
    estado: [],
    publicadoHace: "todos",
  })
  // Estado para mostrar/ocultar filtros en móvil
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  // Estado para el rango de precios disponible
  const [rangoPrecios, setRangoPrecios] = useState<[number, number]>([0, 1000])

  const [activeKeys, setActiveKeys] = useState<string[]>(["0"]);

  // Estado para ubicación y servicios cercanos
  const [ubicacionUsuario, setUbicacionUsuario] = useState<{ lat: number; lng: number } | null>(null)
  const [serviciosCercanos, setServiciosCercanos] = useState<Producto[]>([])
  const [mostrarSoloServiciosCercanos, setMostrarSoloServiciosCercanos] = useState(false)
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false)

  // Servicios
  const itemService = new ItemService()
  const categoryService = new CategoryService()

  const formatCompoundCategory = (name: string): string => {
    if (!name) return "";

    // Caso especial para "servicios" individual
    if (name.toLowerCase().trim() === "servicios") return "Servicios";

    // Divide y capitaliza cada palabra (incluyendo las separadas por "/")
    return name
      .split(/(\/|\s+)/) // Divide por slash o espacios
      .map(word => {
        if (word === '/') return '/'; // Mantiene el slash
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ') // Une con espacios
      .replace(/\s+\/\s+/g, ' / '); // Normaliza espacios alrededor del slash
  };

  // Cargar todos los productos y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Cargar productos
        const data = await itemService.getAll()
        setProductos(data)

        // Establecer rango de precios basado en los productos
        const prices = data.map((p: Producto) => p.price || 0)
        const minPrice = Math.min(...prices, 0)
        const maxPrice = Math.max(...prices, 1000)
        setRangoPrecios([minPrice, maxPrice])
        setFiltros((prev) => ({ ...prev, precioMin: minPrice, precioMax: maxPrice }))

        // Cargar categorías
        const categoriasData = await categoryService.getAll()
        setCategorias(categoriasData)

        setCategoriasAgrupadas({ "Todas las categorías": categoriasData });

        setLoading(false)
      } catch (error) {
        console.error("Error al cargar datos:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Función para obtener ubicación y servicios cercanos
  const obtenerServiciosCercanos = async () => {
    if (ubicacionUsuario) {
      // Si ya tenemos la ubicación, usar los servicios ya cargados
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

  // Filtrar productos basados en la búsqueda y filtros
  useEffect(() => {
    if (productos.length > 0) {
      let filtered = [...productos]

      // Si está activado el filtro de servicios cercanos, usar solo esos
      if (mostrarSoloServiciosCercanos) {
        filtered = [...serviciosCercanos]
      }

      // Filtrar productos del usuario autenticado
      if (user) {
        filtered = filtered.filter(p => p.user?.id !== user.id);
      }

      // Filtrar por término de búsqueda
      if (query) {
        const searchLower = query.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.title?.toLowerCase().includes(searchLower) ||
            p.description?.toLowerCase().includes(searchLower) ||
            p.category?.name?.toLowerCase().includes(searchLower),
        )
      }

      // Filtrar por categorías seleccionadas
      if (filtros.categorias.length > 0) {
        filtered = filtered.filter((p) => filtros.categorias.includes(p.category?.id))
      }

      // Filtrar por ubicación
      if (filtros.ubicacion) {
        filtered = filtered.filter((p) => p.location?.toLowerCase().includes(filtros.ubicacion.toLowerCase()))
      }

      // Filtrar por rango de precio
      filtered = filtered.filter((p) => p.price >= filtros.precioMin && p.price <= filtros.precioMax)

      // Filtrar por estado del producto
      if (filtros.estado.length > 0) {
        filtered = filtered.filter((p) => filtros.estado.includes(p.itemCondition || ""))
      }

      // Filtrar por fecha de publicación
      if (filtros.publicadoHace !== "todos") {
        const now = new Date()
        const limitDate = new Date()

        switch (filtros.publicadoHace) {
          case "24h":
            limitDate.setDate(now.getDate() - 1)
            break
          case "7d":
            limitDate.setDate(now.getDate() - 7)
            break
          case "30d":
            limitDate.setDate(now.getDate() - 30)
            break
        }

        filtered = filtered.filter((p) => {
          const createdDate = new Date(p.createdAt)
          return createdDate >= limitDate
        })
      }

      setFilteredProductos(filtered)
    }
  }, [query, productos, filtros, mostrarSoloServiciosCercanos, serviciosCercanos, user])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Actualizar la URL con el nuevo término de búsqueda
    window.history.pushState({}, "", `/busqueda?q=${encodeURIComponent(searchTerm)}`)
    // Forzar una actualización de la página
    window.location.reload()
  }

  // Manejar cambios en los filtros
  const handleFiltroChange = (tipo: keyof Filtros, valor: any) => {
    setFiltros((prev) => ({ ...prev, [tipo]: valor }))
  }

  // Manejar cambios en filtros de categoría (checkbox)
  const handleCategoriasChange = (categoriaId: number, checked: boolean) => {
    setFiltros((prev) => {
      if (checked) {
        return { ...prev, categorias: [...prev.categorias, categoriaId] }
      } else {
        return { ...prev, categorias: prev.categorias.filter((id) => id !== categoriaId) }
      }
    })
  }

  // Manejar cambios en filtros de estado (checkbox)
  const handleEstadoChange = (estado: string, checked: boolean) => {
    setFiltros((prev) => {
      if (checked) {
        return { ...prev, estado: [...prev.estado, estado] }
      } else {
        return { ...prev, estado: prev.estado.filter((e) => e !== estado) }
      }
    })
  }

  // Resetear todos los filtros
  const resetFiltros = () => {
    setFiltros({
      categorias: [],
      ubicacion: "",
      precioMin: rangoPrecios[0],
      precioMax: rangoPrecios[1],
      estado: [],
      publicadoHace: "todos",
    })
  }

  const handleAccordionToggle = (eventKey: string) => {
    // Función para determinar el icono según la categoría
    setActiveKeys((prev) => (prev.includes(eventKey) ? prev.filter((key) => key !== eventKey) : [...prev, eventKey]))
  }

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

  return (
    <Container className="py-5">
      <h1 className="mb-4">Resultados de búsqueda: "{query}"</h1>

      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="search"
            placeholder="Buscar productos, servicios o categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="success" type="submit">
            <Search size={18} className="me-1" /> Buscar
          </Button>
        </InputGroup>
      </Form>

      <div className="d-lg-none mb-3">
        <Button
          variant={mostrarFiltros ? "success" : "outline-success"}
          className="w-100 d-flex justify-content-between align-items-center"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
        >
          <span>
            {mostrarFiltros ? <FunnelFill className="me-2" /> : <Funnel className="me-2" />}
            Filtros
          </span>
          <Badge bg="light" text="dark" pill>
            {filtros.categorias.length +
              (filtros.ubicacion ? 1 : 0) +
              filtros.estado.length +
              (filtros.publicadoHace !== "todos" ? 1 : 0)}
          </Badge>
        </Button>
      </div>

      <Row>
        <Col lg={3} className={`mb-4 ${mostrarFiltros ? "d-block" : "d-none d-lg-block"}`}>
          <Card className="shadow-sm border-0 rounded-4 mb-4 sticky-top" style={{ top: "1rem" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Filtros</h5>
                <Button variant="link" className="p-0 text-muted" onClick={resetFiltros} title="Resetear filtros">
                  <ArrowClockwise size={18} />
                </Button>
              </div>

              <Accordion activeKey={activeKeys} onSelect={(e) => typeof e === 'string' && handleAccordionToggle(e)}>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Categorías</Accordion.Header>
                  <Accordion.Body className="py-2">
                    {Object.entries(categoriasAgrupadas).map(([grupo, cats], idx) => (
                      <div key={idx} className="mb-3">
                        <h6 className="fw-bold mb-2 text-muted">{grupo}</h6>
                        <ListGroup variant="flush">
                          {cats.map((categoria) => (
                            <ListGroup.Item key={categoria.id} className="px-0 py-1 border-0">
                              <Form.Check
                                type="checkbox"
                                id={`categoria-${categoria.id}`}
                                label={
                                  <span className="d-flex align-items-center">
                                    {getCategoryIcon(categoria.name)}
                                    {formatCompoundCategory(categoria.name)}
                                  </span>
                                }
                                checked={filtros.categorias.includes(categoria.id)}
                                onChange={(e) => handleCategoriasChange(categoria.id, e.target.checked)}
                              />
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    ))}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>¿Dónde?</Accordion.Header>
                  <Accordion.Body>
                    <div className="d-flex align-items-center mb-2">
                      <GeoAlt className="text-muted me-2" />
                      <StableInput
                        value={filtros.ubicacion}
                        onChange={(value) => handleFiltroChange("ubicacion", value)}
                        type="text"
                        placeholder="Ej: Madrid, España"
                        className="form-control"
                      />
                    </div>
                    {filtros.ubicacion && (
                      <div className="d-flex align-items-center mt-2">
                        <Badge bg="success" className="d-flex align-items-center">
                          {filtros.ubicacion}
                          <Button
                            variant="link"
                            className="p-0 ms-2 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFiltroChange("ubicacion", "");
                            }}
                          >
                            <XCircle size={14} />
                          </Button>
                        </Badge>
                      </div>
                    )}
                    <hr className="my-3" />
                    <Form.Check
                      type="checkbox"
                      id="servicios-cercanos"
                      className="mb-3"
                      label={
                        <div>
                          <div className="fw-medium">Mostrar sólo servicios y productos cercanos</div>
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
                      <div className="text-center">
                        <div className="spinner-border spinner-border-sm text-success me-2" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                        <small className="text-muted">Obteniendo ubicación...</small>
                      </div>
                    )}

                    {mostrarSoloServiciosCercanos &&
                      serviciosCercanos.length === 0 &&
                      !cargandoUbicacion &&
                      ubicacionUsuario && <small className="text-muted">No se encontraron servicios ni productos cercanos</small>}

                    {mostrarSoloServiciosCercanos && !ubicacionUsuario && !cargandoUbicacion && (
                      <small className="text-warning">Activa la ubicación para ver servicios cercanos</small>
                    )}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>¿Cuánto quieres pagar?</Accordion.Header>
                  <Accordion.Body>
                    <div className="mb-3">
                      <Form.Label>Rango de precio (Créditos)</Form.Label>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <StableInput
                          value={filtros.precioMin}
                          onChange={(value) => handleFiltroChange("precioMin", Number(value))}
                          type="number"
                          min={rangoPrecios[0]}
                          max={filtros.precioMax}
                          className="form-control me-2"
                        />
                        <span className="mx-2">-</span>
                        <StableInput
                          value={filtros.precioMax}
                          onChange={(value) => handleFiltroChange("precioMax", Number(value))}
                          type="number"
                          min={filtros.precioMin}
                          max={rangoPrecios[1]}
                          className="form-control ms-2"
                        />
                      </div>
                      <Form.Range
                        min={rangoPrecios[0]}
                        max={rangoPrecios[1]}
                        value={filtros.precioMax}
                        onChange={(e) => {
                          handleFiltroChange("precioMax", Number(e.target.value));
                        }}
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>Estado del producto</Accordion.Header>
                  <Accordion.Body>
                    {ESTADOS_PRODUCTO.map((estado, idx) => (
                      <Form.Check
                        key={idx}
                        type="checkbox"
                        id={`estado-${estado.valor}`}
                        className="mb-2"
                        label={
                          <div>
                            <div className="fw-medium">{estado.etiqueta}</div>
                            <small className="text-muted">{estado.descripcion}</small>
                          </div>
                        }
                        checked={filtros.estado.includes(estado.valor)}
                        onChange={(e) => handleEstadoChange(estado.valor, e.target.checked)}
                      />
                    ))}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4">
                  <Accordion.Header>Publicado hace</Accordion.Header>
                  <Accordion.Body>
                    {OPCIONES_TIEMPO.map((opcion, idx) => (
                      <Form.Check
                        key={idx}
                        type="radio"
                        name="publicadoHace"
                        id={`tiempo-${opcion.valor}`}
                        className="mb-2"
                        label={opcion.etiqueta}
                        checked={filtros.publicadoHace === opcion.valor}
                        onChange={() => handleFiltroChange("publicadoHace", opcion.valor)}
                      />
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3">Buscando productos...</p>
            </div>
          ) : filteredProductos.length > 0 ? (
            <>
              <p className="mb-4">Se encontraron {filteredProductos.length} resultados</p>
              <Row xs={1} sm={2} md={3} className="g-4">
                {filteredProductos.map((producto) => (
                  <Col key={producto.id}>
                    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                      <ProductCard producto={producto} />
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </>
          ) : mostrarSoloServiciosCercanos && cargandoUbicacion ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3">Obteniendo servicios y productos cercanos...</p>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="mb-4">
                <Search size={60} className="text-muted" />
              </div>
              <h3>No se encontraron resultados</h3>
              <p className="text-muted">Intenta con otros términos de búsqueda o filtros diferentes</p>
              <Button as={Link as any} to="/" variant="success" className="mt-3">
                Volver al inicio
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};