import React from "react"
import { Card, Badge, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { GeoAlt, Calendar3 } from "react-bootstrap-icons"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

// Definir la interfaz para el producto
export interface Producto {
  id: number
  title: string
  description?: string
  price: number
  imageUrl?: string
  category?: {
    id: number
    name: string
  }
  location?: string
  createdAt?: string
  status?: string
  user?: {
    id: number
    name: string
    location?: string
    imageUrl?: string | null
  }
  itemCondition?: string
}

interface ProductCardProps {
  producto: Producto
  showAnimation?: boolean
}

export const ProductCard: React.FC<ProductCardProps> = ({ producto, showAnimation = true }) => {

  const navigate = useNavigate()

  // Función para obtener el color de la categoría
  const getCategoryColor = (categoryName?: string): string => {
    if (!categoryName) return "secondary"

    switch (categoryName.toLowerCase()) {
      case "tecnología":
        return "primary"
      case "hogar":
        return "success"
      case "libros":
        return "info"
      case "ropa":
      case "calzado":
        return "danger"
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
      case "juguetes":
        return "danger"
      default:
        return "secondary"
    }
  }

  const handleClick = () => {
    navigate(`/items/${producto.id}`)
  }

  // Componente de tarjeta
  const cardContent = (
    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
      <div style={{ height: "180px", overflow: "hidden" }}>
        <Card.Img
          variant="top"
          src={producto.imageUrl?.split('|')[0] || "/placeholder.svg?height=180&width=300"}
          alt={producto.title}
          className="img-fluid h-100"
          style={{ objectFit: "cover" }}
        />
      </div>
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          {producto.category && (
            <Badge bg={getCategoryColor(producto.category.name)} className="rounded-pill">
              {producto.category.name}
            </Badge>
          )}
          {producto.status && (
            <Badge bg={producto.status === "Available" ? "success" : "secondary"} className="rounded-pill">
              {producto.status === "Available" ? "Disponible" : producto.status}
            </Badge>
          )}
        </div>
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
        {(producto.location || producto.user?.location) && (
          <div className="mt-2 small text-muted">
            <GeoAlt size={12} className="me-1" />
            {producto.location || producto.user?.location}
          </div>
        )}
        {producto.createdAt && (
          <div className="mt-1 small text-muted">
            <Calendar3 size={12} className="me-1" />
            {new Date(producto.createdAt).toLocaleDateString()}
          </div>
        )}

        {/* Añadir información del propietario */}
        {producto.user && (
          <div className="mt-2 d-flex justify-content-end align-items-center">
            <Link
              to={`/perfil/${producto.user.id}`}
              className="text-decoration-none d-flex align-items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="small text-muted me-2">{producto.user.name}</span>
              <img
                src={producto.user.imageUrl || "/placeholder.svg"}
                alt={producto.user.name}
                className="rounded-circle border"
                style={{ width: "24px", height: "24px", objectFit: "cover" }}
              />
            </Link>
          </div>
        )}
      </Card.Body>
    </Card>
  )

  // Si se solicita animación, envolver en motion.div
  if (showAnimation) {
    return (
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        {cardContent}
      </motion.div>
    )
  }

  // Sin animación
  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      {cardContent}
    </div>
  )
}