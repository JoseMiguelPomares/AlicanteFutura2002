"use client"

import type React from "react"
import { Offcanvas, Button, Badge } from "react-bootstrap"
import { Link } from "react-router-dom"
import {
  ChevronRight,
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
} from "react-bootstrap-icons"
import { motion } from "framer-motion"

// Lista de categorías disponibles (debe coincidir con las de PaginaVender)
const CATEGORIAS = [
  { id: 1, name: "juguetes", icon: <Controller className="text-danger" /> },
  { id: 2, name: "ropa", icon: <Handbag className="text-primary" /> },
  { id: 3, name: "calzado", icon: <Basket className="text-warning" /> },
  { id: 4, name: "tecnología", icon: <Laptop className="text-info" /> },
  { id: 5, name: "hogar", icon: <House className="text-success" /> },
  { id: 6, name: "electrodomésticos", icon: <Tools className="text-secondary" /> },
  { id: 7, name: "vehículos", icon: <CarFrontFill className="text-danger" /> },
  { id: 8, name: "jardinería", icon: <Flower1 className="text-success" /> },
  { id: 9, name: "deporte", icon: <Bicycle className="text-primary" /> },
  { id: 10, name: "música", icon: <MusicNoteBeamed className="text-warning" /> },
  { id: 11, name: "libros", icon: <Book className="text-info" /> },
  { id: 12, name: "otros / servicios", icon: <Tag className="text-muted" /> },
]

// Función para formatear nombres de categoría compuestos
const formatCategoryName = (name: string): string => {
  if (!name) return "";

  // Caso especial para "servicios" individual
  if (name.toLowerCase().trim() === "servicios") return "Servicios";

  // Capitaliza todas las palabras (incluyendo combinaciones con "/")
  return name
    .split(/(\/|\s+)/) // Divide por slash o espacios
    .map(word => {
      if (word === '/') return '/'; // Mantiene el slash
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ') // Une con espacios
    .replace(/\s+\/\s+/g, ' / '); // Normaliza espacios alrededor del slash
};

type Categoria = {
  nombre: string
  icono?: React.ReactNode
  badge?: string
  subcategorias?: Categoria[]
}

type Seccion = {
  titulo: string
  categorias: Categoria[]
}

type BarraLateralProps = {
  mostrar: boolean
  alCerrar: () => void
}

export const BarraLateral: React.FC<BarraLateralProps> = ({ mostrar, alCerrar }) => {
  // Convertir las categorías al formato que espera el componente
  const categoriasProductos: Categoria[] = CATEGORIAS.map((cat) => ({
    nombre: formatCategoryName(cat.name),
    icono: cat.icon,
    badge: cat.id === 4 ? "Popular" : undefined, // Marcar "tecnología" como popular
  }))

  // Definir las secciones
  const secciones: Seccion[] = [
    {
      titulo: "Productos",
      categorias: categoriasProductos,
    }
  ]

  const RenderizarCategoria = ({ categoria }: { categoria: Categoria }) => (
    <motion.li className="mb-2" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/categoria/${encodeURIComponent("otros / servicios")}`}
        className="d-flex justify-content-between align-items-center py-2 px-3 rounded-pill text-decoration-none"
        style={{
          backgroundColor: categoria.subcategorias ? "transparent" : "#f8f9fa",
          color: "#333",
        }}
        onClick={categoria.subcategorias ? undefined : alCerrar}
      >
        <div className="d-flex align-items-center gap-2">
          {categoria.icono || <Tag className="text-muted" />}
          <span>{categoria.nombre}</span>
          {categoria.badge && (
            <Badge bg="danger" pill className="ms-2 px-2 py-1">
              {categoria.badge}
            </Badge>
          )}
        </div>
        {categoria.subcategorias && <ChevronRight size={16} />}
      </Link>

      {categoria.subcategorias && (
        <ul className="list-unstyled ps-4 mt-2">
          {categoria.subcategorias.map((subcategoria, i) => (
            <RenderizarCategoria key={`sub-${i}`} categoria={subcategoria} />
          ))}
        </ul>
      )}
    </motion.li>
  )

  return (
    <Offcanvas show={mostrar} onHide={alCerrar} placement="start" className="border-end" style={{ width: "320px" }}>
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="fs-4 fw-bold text-success">Categorías</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="p-0">
        {/* Categorías */}
        <div className="px-3 mt-3">
          {secciones.map((seccion, i) => (
            <section key={`sec-${i}`} className="mb-4">
              <h3 className="h6 fw-bold mb-3 text-uppercase text-muted px-3">{seccion.titulo}</h3>
              <ul className="list-unstyled">
                {seccion.categorias.map((categoria, j) => (
                  <RenderizarCategoria key={`cat-${j}`} categoria={categoria} />
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Sección de ayuda */}
        <div className="mt-4 p-3 border-top">
          <h4 className="h6 text-muted mb-3">¿Necesitas ayuda?</h4>
          <Button
            as={Link as any}
            to="/contacto"
            variant="outline-success"
            className="w-100 rounded-pill"
            onClick={alCerrar}
          >
            Contactar con soporte
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  )
}
