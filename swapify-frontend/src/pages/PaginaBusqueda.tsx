"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup } from "react-bootstrap"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, Tag, Laptop, House, Book, Handbag, Tools, Mortarboard, Truck } from "react-bootstrap-icons"
import { ItemService } from "../services/itemService"

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
}

export const PaginaBusqueda = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchTerm, setSearchTerm] = useState(query)
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const itemService = new ItemService()

  // Cargar todos los productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true)
        const data = await itemService.getAll()
        setProductos(data)

        // Extraer categorías únicas
        const uniqueCategories = Array.from(new Set(data.map((p: Producto) => p.category?.name || "Sin categoría")))
        setCategories(uniqueCategories as string[])

        // Establecer rango de precios basado en los productos
        const prices = data.map((p: Producto) => p.price || 0)
        const minPrice = Math.min(...prices, 0)
        const maxPrice = Math.max(...prices, 1000)
        setPriceRange([minPrice, maxPrice])

        setLoading(false)
      } catch (error) {
        console.error("Error al cargar productos:", error)
        setLoading(false)
      }
    }

    fetchProductos()
  }, [])

  // Filtrar productos basados en la búsqueda y filtros
  useEffect(() => {
    if (productos.length > 0) {
      let filtered = [...productos]

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
      if (selectedCategories.length > 0) {
        filtered = filtered.filter((p) => selectedCategories.includes(p.category?.name || "Sin categoría"))
      }

      // Filtrar por rango de precio
      filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

      setFilteredProductos(filtered)
    }
  }, [query, productos, selectedCategories, priceRange])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Actualizar la URL con el nuevo término de búsqueda
    window.history.pushState({}, "", `/busqueda?q=${encodeURIComponent(searchTerm)}`)
    // Forzar una actualización de la página
    window.location.reload()
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
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

      {/* Barra de búsqueda */}
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

      <Row>
        {/* Filtros laterales */}
        <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="fw-bold mb-3">Filtros</h5>

              {/* Filtro por categoría */}
              <div className="mb-4">
                <h6 className="fw-bold mb-2">Categorías</h6>
                {categories.map((category, index) => (
                  <Form.Check
                    key={index}
                    type="checkbox"
                    id={`category-${index}`}
                    label={
                      <span className="d-flex align-items-center">
                        {getCategoryIcon(category)}
                        {category}
                      </span>
                    }
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="mb-2"
                  />
                ))}
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
          ) : filteredProductos.length > 0 ? (
            <>
              <p className="mb-4">Se encontraron {filteredProductos.length} resultados</p>
              <Row xs={1} sm={2} md={3} className="g-4">
                {filteredProductos.map((producto) => (
                  <Col key={producto.id}>
                    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                      <Link to={`/productos/${producto.id}`} className="text-decoration-none">
                        <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                          <Card.Img
                            variant="top"
                            src={producto.imageUrl || "/placeholder.svg?height=180&width=300"}
                            alt={producto.title}
                            style={{ height: "180px", objectFit: "cover" }}
                          />
                          <Card.Body className="p-3">
                            {producto.category && (
                              <Badge bg="primary" className="mb-2 rounded-pill">
                                {producto.category.name}
                              </Badge>
                            )}
                            <Card.Title className="fw-bold text-dark mb-1" style={{ fontSize: "1rem" }}>
                              {producto.title}
                            </Card.Title>
                            <Card.Text className="text-muted small mb-2" style={{ height: "40px", overflow: "hidden" }}>
                              {producto.description}
                            </Card.Text>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-bold text-success">{producto.price} Créditos</span>
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
            </>
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
  )
}

