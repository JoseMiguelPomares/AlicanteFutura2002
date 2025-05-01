"use client"

import { useParams, Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Breadcrumb,
  Tabs,
  Tab,
  Card,
  ListGroup,
  Alert,
  Modal,
  Carousel,
} from "react-bootstrap"
import {
  Star,
  StarFill,
  Calendar3,
  GeoAlt,
  ArrowClockwise,
  ChatLeftText,
  Share,
  Heart,
  HeartFill,
  CheckCircle,
  ShieldCheck,
  XLg,
  PlusCircle,
  Trash,
  ArrowsFullscreen,
  Pencil,
} from "react-bootstrap-icons"
import { motion } from "framer-motion"
import { ItemService } from "../services/itemService"
import { ImageService } from "../services/imageService"
import { useAuth } from "../contexts/AuthContext"
import { ProductCard } from "../components/ProductCard"

interface Producto {
  id: number
  title: string
  description: string
  price: number
  imageUrl: string
  category: {
    id: number
    name: string
  }
  status: string
  createdAt: string
  user: {
    id: number
    name: string
    email: string
    passwordHash?: string
    location?: string
    credits?: number
    reputation?: number
    createdAt?: string
    socialId?: string | null
    imageUrl?: string | null
  }
  itemCondition?: string | undefined
  location?: string
}

export const PaginaProducto = () => {
  const { id } = useParams<{ id: string }>()
  const idNumber = Number(id)
  const [producto, setProducto] = useState<Producto | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [productosRelacionados, setProductosRelacionados] = useState<Producto[]>([])
  const itemService = useRef(new ItemService()).current

  // Dentro de la función PaginaProducto, añadir estos estados para el lightbox y manejo de múltiples imágenes
  const [showLightbox, setShowLightbox] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [productImages, setProductImages] = useState<string[]>([])
  const { user: currentUser } = useAuth() // Añadir esta línea para obtener el usuario actual

  useEffect(() => {
    if (!id) {
      setError(true)
      setLoading(false)
      return
    }

    const fetchProducto = async () => {
      try {
        setLoading(true)

        const response = await itemService.getItemById(idNumber)

        if (!response || !response.data) {
          throw new Error("Producto no encontrado")
        }

        console.log("Datos del producto:", response.data) // Para depuración

        // Guardar los datos del producto
        setProducto(response.data)

        // Buscar productos relacionados
        if (response.data.category?.id) {
          const relacionados = await itemService.getRelatedProducts(idNumber, response.data.category.id)
          setProductosRelacionados(relacionados)
        }
      } catch (error) {
        console.error("Error al cargar el producto:", error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProducto()

    // Scroll al inicio cuando se carga un nuevo producto
    window.scrollTo(0, 0)
  }, [id])

  // Añadir este useEffect para inicializar las imágenes del producto
  useEffect(() => {
    if (producto) {
      // Inicializar con la imagen principal o múltiples imágenes separadas por '|'
      let images = []
      if (producto.imageUrl) {
        // Dividir la cadena de URLs por el separador '|'
        images = producto.imageUrl.split("|")
      } else {
        images = ["/placeholder.svg?height=600&width=800"]
      }
      setProductImages(images)
    }
  }, [producto])

  // Función para abrir el lightbox
  const openLightbox = (index = 0) => {
    setCurrentImageIndex(index)
    setShowLightbox(true)
  }

  // Función para añadir una imagen (implementación real)
  const handleAddImage = () => {
    // Crear un input de tipo file invisible
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = "image/*" // Solo aceptar imágenes
    fileInput.multiple = false // Una imagen a la vez

    // Cuando el usuario seleccione un archivo
    fileInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement
      const files = target.files

      if (!files || files.length === 0) return

      try {
        setLoading(true)
        const file = files[0]

        // Crear una URL temporal para la vista previa
        const previewUrl = URL.createObjectURL(file)
        const newImages = [...productImages, previewUrl]
        setProductImages(newImages)

        // Subir la imagen usando el servicio de imágenes
        const imageService = new ImageService()
        const uploadedUrl = await imageService.uploadImage(file, (progress) => {
          console.log(`Progreso de carga: ${progress}%`)
        })

        // Reemplazar la URL temporal con la URL real pero manteniendo todas las imágenes
        // Encontrar el índice de la URL temporal (la última añadida)
        const tempIndex = productImages.length
        // Crear un nuevo array con todas las imágenes, reemplazando la temporal por la real
        const finalImages = [...productImages]
        finalImages[tempIndex] = uploadedUrl
        setProductImages(finalImages)

        // Actualizar el producto en la base de datos con la nueva imagen
        if (producto && producto.id) {
          // Asegurarse de que estamos usando las URLs finales correctas
          const allImageUrls = finalImages.join("|")

          // Antes de la llamada a modifyItem
          console.log("Enviando actualización de imágenes:", {
            productId: producto.id,
            imageUrl: allImageUrls,
          })

          // Crear un objeto completo con todos los campos requeridos
          const itemData = {
            title: producto.title,
            description: producto.description,
            categoryId: producto.category.id,
            imageUrl: allImageUrls,
            price: producto.price,
            itemCondition: producto.itemCondition || "bueno", // Valor por defecto si no existe
            location: producto.location || "",
          }

          await itemService.modifyItem(producto.id, itemData)

          // Actualizar el producto local con la nueva URL de imagen
          setProducto((prev) => {
            if (!prev) return null
            return { ...prev, imageUrl: allImageUrls }
          })
        }
      } catch (error) {
        console.error("Error al subir la imagen:", error)
        // Eliminar la última imagen añadida si hay error
        setProductImages((prevImages) => prevImages.slice(0, -1))
        alert("No se pudo subir la imagen. Por favor, inténtalo de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    // Simular clic en el input para abrir el selector de archivos
    fileInput.click()
  }

  // Función para eliminar una imagen
  const handleDeleteImage = async (index: number) => {
    try {
      setLoading(true)

      // Crear una copia del array de imágenes y eliminar la imagen seleccionada
      const newImages = [...productImages]
      newImages.splice(index, 1)

      // Actualizar el estado local con las imágenes restantes o una imagen de placeholder
      const finalImages = newImages.length > 0 ? newImages : ["/placeholder.svg?height=600&width=800"]
      setProductImages(finalImages)

      // Solo actualizar en el backend si el producto existe
      if (producto && producto.id) {
        // Convertir el array de imágenes a una cadena separada por '|'
        const allImageUrls = finalImages.join("|")

        console.log("Enviando actualización después de eliminar imagen:", {
          productId: producto.id,
          imageUrl: allImageUrls,
        })

        // Crear un objeto completo con todos los campos requeridos
        const itemData = {
          title: producto.title,
          description: producto.description,
          categoryId: producto.category.id,
          imageUrl: allImageUrls,
          price: producto.price,
          itemCondition: producto.itemCondition || "bueno",
          location: producto.location || "",
        }

        // Enviar la actualización al backend
        await itemService.modifyItem(producto.id, itemData)

        // Actualizar el producto local con la nueva URL de imagen
        setProducto((prev) => {
          if (!prev) return null
          return { ...prev, imageUrl: allImageUrls }
        })
      }
    } catch (error) {
      console.error("Error al eliminar la imagen:", error)
      alert("No se pudo eliminar la imagen. Por favor, inténtalo de nuevo.")

      // Restaurar las imágenes originales en caso de error
      if (producto && producto.imageUrl) {
        setProductImages(producto.imageUrl.split("|"))
      }
    } finally {
      setLoading(false)
    }
  }

  // Verificar si el producto pertenece al usuario actual
  const isOwner = currentUser && producto && producto.user && currentUser.id === producto.user.id

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Aquí se implementaría la lógica para guardar el favorito en la base de datos
  }

  // Renderizar estrellas para una valoración
  const renderStars = (rating: number) => {
    return (
      <div className="d-flex">
        {[...Array(5)].map((_, i) =>
          i < Math.floor(rating) ? (
            <StarFill key={i} className="text-warning" />
          ) : (
            <Star key={i} className="text-warning" />
          ),
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando producto...</span>
        </div>
        <p className="mt-3">Cargando detalles del producto...</p>
      </Container>
    )
  }

  if (error || !producto) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Producto no encontrado</Alert.Heading>
          <p>Lo sentimos, no pudimos encontrar el producto que estás buscando.</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button as={Link as any} to="/" variant="outline-danger">
              Volver al inicio
            </Button>
          </div>
        </Alert>
      </Container>
    )
  }

  // Obtener el usuario del producto
  const user = producto.user

  return (
    <Container className="py-5">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Inicio
        </Breadcrumb.Item>
        {producto.category && (
          <>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/categorias" }}>
              Categorías
            </Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/categorias/${producto.category?.name?.toLowerCase()}` }}>
              {producto.category?.name}
            </Breadcrumb.Item>
          </>
        )}
        <Breadcrumb.Item active>{producto.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        {/* Imagen del producto */}
        <Col lg={6} className="mb-4 mb-lg-0">
          <div className="position-relative">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <div
                className="product-image-container position-relative"
                style={{ cursor: "pointer" }}
                onClick={() => openLightbox(0)}
              >
                <img
                  src={productImages[0] || "/placeholder.svg?height=600&width=800"}
                  alt={producto.title}
                  className="img-fluid rounded-4 shadow-sm mb-3"
                  style={{ width: "100%", height: "400px", objectFit: "contain" }}
                />
                <div className="position-absolute top-0 end-0 m-2">
                  <Button
                    variant="light"
                    size="sm"
                    className="rounded-circle p-1 shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      openLightbox(0)
                    }}
                  >
                    <ArrowsFullscreen size={18} />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Badge de estado */}
            {producto.status && (
              <Badge bg="success" className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill">
                {producto.status}
              </Badge>
            )}

            {/* Miniaturas de imágenes adicionales */}
            {productImages.length > 1 && (
              <div className="d-flex mt-2 overflow-auto pb-2">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail-container me-2 position-relative ${index === 0 ? "border border-primary" : ""}`}
                    style={{ width: "80px", height: "80px" }}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="img-thumbnail"
                      style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
                      onClick={() => openLightbox(index)}
                    />
                    {isOwner && (
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 p-0 rounded-circle"
                        style={{ width: "20px", height: "20px", fontSize: "10px" }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteImage(index)
                        }}
                      >
                        <XLg size={10} />
                      </Button>
                    )}
                  </div>
                ))}

                {/* Botón para añadir más imágenes si es el propietario */}
                {isOwner && (
                  <div
                    className="d-flex justify-content-center align-items-center bg-light rounded"
                    style={{ width: "80px", height: "80px", cursor: "pointer" }}
                    onClick={handleAddImage}
                  >
                    <PlusCircle size={24} className="text-primary" />
                  </div>
                )}
              </div>
            )}

            {/* Botón para añadir la primera imagen adicional si solo hay una */}
            {productImages.length === 1 && isOwner && (
              <Button
                variant="outline-primary"
                size="sm"
                className="mt-2 d-flex align-items-center"
                onClick={handleAddImage}
              >
                <PlusCircle size={16} className="me-1" />
                Añadir más imágenes
              </Button>
            )}
          </div>
        </Col>

        {/* Información del producto */}
        <Col lg={6}>
          <div className="d-flex justify-content-between align-items-start mb-3">
            {producto.category && (
              <Badge bg="primary" className="rounded-pill px-3 py-2 mb-2">
                {producto.category.name}
              </Badge>
            )}
            <Button
              variant={isFavorite ? "danger" : "outline-danger"}
              className="rounded-circle p-2"
              onClick={toggleFavorite}
              aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              {isFavorite ? <HeartFill size={20} /> : <Heart size={20} />}
            </Button>
          </div>

          <h1 className="fw-bold mb-3">{producto.title}</h1>

          <div className="d-flex align-items-center mb-4">
            {producto.location && (
              <div className="me-4 d-flex align-items-center">
                <GeoAlt className="text-muted me-1" />
                <span className="text-muted">{producto.location}</span>
              </div>
            )}
            {producto.createdAt && (
              <div className="d-flex align-items-center">
                <Calendar3 className="text-muted me-1" />
                <span className="text-muted">{new Date(producto.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <h2 className="h3 fw-bold text-success mb-4">{producto.price} Créditos</h2>

          {producto.description && (
            <div className="mb-4">
              <h3 className="h5 fw-bold mb-2">Descripción</h3>
              <p className="text-muted">{producto.description}</p>
            </div>
          )}

          {/* Información del vendedor - Versión mejorada y robusta */}
          {user && (
            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Body>
                <h4 className="h5 fw-bold mb-3">Información del vendedor</h4>

                <div className="d-flex mb-4">
                  <div className="position-relative me-3">
                    <img
                      src={user.imageUrl || "/placeholder.svg?height=80&width=80"}
                      alt={user.name}
                      className="rounded-circle"
                      width="80"
                      height="80"
                      style={{ objectFit: "cover" }}
                    />
                    {/* Badge de verificación (podría ser basado en la reputación) */}
                    {user.reputation && user.reputation > 4.5 && (
                      <Badge
                        bg="success"
                        className="position-absolute bottom-0 end-0 rounded-circle p-1"
                        title="Usuario verificado"
                      >
                        <CheckCircle size={16} />
                      </Badge>
                    )}
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="fw-bold mb-1">{user.name}</h5>
                        {user.reputation !== undefined && (
                          <div className="d-flex align-items-center mb-2">
                            {renderStars(user.reputation)}
                            <span className="ms-2 text-muted">({user.reputation.toFixed(1)})</span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline-success"
                        className="rounded-pill"
                        as={Link as any}
                        to={`/perfil/${user.id}`}
                      >
                        Ver perfil
                      </Button>
                    </div>

                    <div className="d-flex flex-wrap gap-3 mt-2">
                      {user.createdAt && (
                        <div className="d-flex align-items-center text-muted small">
                          <Calendar3 className="me-1" />
                          <span>Miembro desde {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      {/* Podríamos añadir más información del usuario aquí */}
                    </div>
                  </div>
                </div>

                {/* Garantías */}
                <div className="mt-3 pt-3 border-top">
                  <div className="d-flex align-items-center">
                    <ShieldCheck className="text-success me-2" size={20} />
                    <span className="small">Este vendedor cumple con las políticas de Swapify</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Botones de acción */}
          <div className="d-grid gap-2">
            {!isOwner ? (
              <>
                <Button variant="success" size="lg" className="rounded-pill">
                  <ChatLeftText className="me-2" />
                  Contactar con el vendedor
                </Button>
                <div className="d-flex gap-2">
                  <Button variant="outline-success" className="w-100 rounded-pill">
                    <ArrowClockwise className="me-2" />
                    Proponer intercambio
                  </Button>
                  <Button variant="outline-secondary" className="rounded-pill px-3">
                    <Share />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="primary" size="lg" className="rounded-pill">
                  <Pencil className="me-2" />
                  Editar producto
                </Button>
                <div className="d-flex gap-2">
                  <Button variant="outline-danger" className="w-100 rounded-pill" onClick={async () => {
                    if (!producto) return;
                    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.")) return;
                    try {
                      setLoading(true);
                      await itemService.deleteItem(producto.id);
                      alert("Producto eliminado correctamente.");
                      window.location.href = "/";
                    } catch (error) {
                      alert("No se pudo eliminar el producto. Inténtalo de nuevo más tarde.");
                    } finally {
                      setLoading(false);
                    }
                  }}>
                    <Trash className="me-2" />
                    Eliminar producto
                  </Button>
                  <Button variant="outline-secondary" className="rounded-pill px-3">
                    <Share />
                  </Button>
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>

      {/* Pestañas de información adicional */}
      <div className="mt-5">
        <Tabs defaultActiveKey="detalles" className="mb-4">
          <Tab eventKey="detalles" title="Detalles">
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <ListGroup variant="flush">
                      {producto.category && (
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                          <span className="text-muted">Categoría</span>
                          <span className="fw-bold">{producto.category.name}</span>
                        </ListGroup.Item>
                      )}
                      {producto.status && (
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                          <span className="text-muted">Estado</span>
                          <span className="fw-bold">{producto.status}</span>
                        </ListGroup.Item>
                      )}
                      {producto.location && (
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                          <span className="text-muted">Ubicación</span>
                          <span className="fw-bold">{producto.location}</span>
                        </ListGroup.Item>
                      )}
                      {producto.itemCondition && (
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                          <span className="text-muted">Condición</span>
                          <span className="fw-bold">{producto.itemCondition.replace("_", " ")}</span>
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </Col>
                  <Col md={6}>
                    <ListGroup variant="flush">
                      {producto.createdAt && (
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                          <span className="text-muted">Fecha de publicación</span>
                          <span className="fw-bold">{new Date(producto.createdAt).toLocaleDateString()}</span>
                        </ListGroup.Item>
                      )}
                      <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                        <span className="text-muted">ID del producto</span>
                        <span className="fw-bold">{producto.id}</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab>
          <Tab eventKey="politicas" title="Políticas de intercambio">
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body>
                <Alert variant="info">
                  <Alert.Heading>Información sobre políticas de intercambio</Alert.Heading>
                  <p>
                    Las políticas de intercambio específicas para este producto aún no están disponibles en el sistema.
                    Te recomendamos contactar directamente con el vendedor para conocer sus condiciones de intercambio.
                  </p>
                </Alert>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </div>

      {/* Productos relacionados */}
      {productosRelacionados.length > 0 && (
        <div className="mt-5">
          <h3 className="fw-bold mb-4">Productos relacionados</h3>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {productosRelacionados.map((producto) => (
              <Col key={producto.id}>
                <ProductCard producto={producto} />
              </Col>
            ))}
          </Row>
        </div>
      )}
      {/* Lightbox Modal */}
      <Modal show={showLightbox} onHide={() => setShowLightbox(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>{producto.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Carousel activeIndex={currentImageIndex} onSelect={(index) => setCurrentImageIndex(index)} interval={null}>
            {productImages.map((img, index) => (
              <Carousel.Item key={index}>
                <div className="d-flex justify-content-center align-items-center bg-dark" style={{ height: "70vh" }}>
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`${producto.title} - Imagen ${index + 1}`}
                    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <span className="text-muted">
            Imagen {currentImageIndex + 1} de {productImages.length}
          </span>
          {isOwner && (
            <div>
              <Button
                variant="outline-danger"
                size="sm"
                className="me-2"
                onClick={() => handleDeleteImage(currentImageIndex)}
                disabled={productImages.length <= 1}
              >
                <Trash size={16} className="me-1" />
                Eliminar imagen
              </Button>
              <Button variant="outline-primary" size="sm" onClick={handleAddImage}>
                <PlusCircle size={16} className="me-1" />
                Añadir imagen
              </Button>
            </div>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  )
}