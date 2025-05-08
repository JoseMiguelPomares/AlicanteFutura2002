import React, { useState } from "react"
import { Card, Badge, Button, Spinner } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { GeoAlt, Calendar3, Heart, HeartFill } from "react-bootstrap-icons"
import { motion } from "framer-motion"
import { useFavorites } from "../contexts/FavoritesContext"
import { useAuth } from "../contexts/AuthContext"

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
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite, getFavoritesCount, refreshFavoritesCount, loading } = useFavorites();
  const { isAuthenticated, user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const favoriteCount = getFavoritesCount(producto.id);
  
  // Verificar si el producto pertenece al usuario actual
  const isOwnProduct = user && producto.user && user.id === producto.user.id;

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

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Si el usuario no está autenticado, redirigir a la página de login
    if (!isAuthenticated) {
      navigate('/login?redirect=/favoritos');
      return;
    }

    // Evitar múltiples clics mientras se procesa
    if (isProcessing || loading) return;

    setIsProcessing(true);
    try {
      if (isFavorite(producto.id)) {
        await removeFavorite(producto.id);
        await refreshFavoritesCount(producto.id);
      } else {
        await addFavorite(producto);
        await refreshFavoritesCount(producto.id);
      }
    } catch (error) {
      console.error("Error al gestionar favorito:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Componente de tarjeta
  const cardContent = (
    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
      <div style={{ height: "180px", overflow: "hidden", position: "relative" }}>
        <Card.Img
          variant="top"
          src={producto.imageUrl?.split('|')[0] || "/placeholder.svg?height=180&width=300"}
          alt={producto.title}
          className="img-fluid h-100"
          style={{ objectFit: "cover" }}
        />
        {isAuthenticated && !isOwnProduct && (
          <Button
            variant={isFavorite(producto.id) ? "danger" : "light"}
            size="sm"
            className="position-absolute top-0 end-0 m-2 rounded-circle p-1"
            onClick={handleFavoriteClick}
            disabled={isProcessing || loading}
            style={{ width: "32px", height: "32px" }}
          >
            {isProcessing ? (
              <Spinner animation="border" size="sm" />
            ) : (
              isFavorite(producto.id) ? <HeartFill size={16} /> : <Heart size={16} />
            )}
          </Button>
        )}
        {favoriteCount > 0 && (
          <Badge
            bg="danger"
            className="position-absolute bottom-0 start-0 m-2 rounded-pill"
          >
            {favoriteCount} {favoriteCount === 1 ? 'favorito' : 'favoritos'}
          </Badge>
        )}
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