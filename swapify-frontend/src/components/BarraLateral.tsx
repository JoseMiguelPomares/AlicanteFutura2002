"use client"

import type React from "react"
import { Offcanvas, Button, Badge } from "react-bootstrap"
import { Link } from "react-router-dom"
import { ChevronRight, Tag, Laptop, House, Book, Handbag, Tools, Mortarboard, Truck } from "react-bootstrap-icons"
import { motion } from "framer-motion"

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
  const secciones: Seccion[] = [
    {
      titulo: "Productos",
      categorias: [
        {
          nombre: "Electrónica",
          icono: <Laptop className="text-primary" />,
          badge: "Popular",
        },
        {
          nombre: "Hogar",
          icono: <House className="text-success" />,
        },
        {
          nombre: "Libros",
          icono: <Book className="text-info" />,
        },
        {
          nombre: "Moda",
          icono: <Handbag className="text-danger" />,
          subcategorias: [{ nombre: "Ropa" }, { nombre: "Calzado" }, { nombre: "Accesorios" }],
        },
      ],
    },
    {
      titulo: "Servicios",
      categorias: [
        {
          nombre: "Reparaciones",
          icono: <Tools className="text-warning" />,
        },
        {
          nombre: "Clases",
          icono: <Mortarboard className="text-primary" />,
        },
        {
          nombre: "Transporte",
          icono: <Truck className="text-success" />,
        },
      ],
    },
  ]

  const RenderizarCategoria = ({ categoria }: { categoria: Categoria }) => (
    <motion.li className="mb-2" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/categoria/${categoria.nombre.toLowerCase()}`}
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

