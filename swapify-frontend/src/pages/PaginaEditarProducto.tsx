"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Breadcrumb,
  Card,
  Spinner,
  ProgressBar,
  Modal,
} from "react-bootstrap"
import { ArrowLeft, PlusCircle, CheckCircle, ExclamationTriangle, Trash } from "react-bootstrap-icons"
import { ItemService } from "../services/itemService"
import { CategoryService } from "../services/categoryService"
import { ImageService } from "../services/imageService"
import { useAuth } from "../contexts/AuthContext"
import OptimizedImage from "../components/OptimizedImage"

interface Category {
  id: number
  name: string
}

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
  }
  itemCondition?: string
  location?: string
}

export const PaginaEditarProducto = () => {
  const { id } = useParams<{ id: string }>()
  const idNumber = Number(id)
  const navigate = useNavigate()
  const { user } = useAuth()

  // Servicios
  const itemService = useRef(new ItemService()).current
  const categoryService = useRef(new CategoryService()).current
  const imageService = useRef(new ImageService()).current

  // Estados para el formulario
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState(0)
  const [categoryId, setCategoryId] = useState<number | "">("")
  const [itemCondition, setItemCondition] = useState("bueno")
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState("Available")

  // Estados para las imágenes
  const [productImages, setProductImages] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [currentUploadingImage, setCurrentUploadingImage] = useState<string | null>(null)

  // Estados para categorías
  const [categories, setCategories] = useState<Category[]>([])

  // Estados para alertas y carga
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {})
  const [confirmMessage, setConfirmMessage] = useState("")

  // Cargar datos del producto y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Cargar categorías
        const categoriesData = await categoryService.getAll()
        setCategories(categoriesData)

        // Cargar datos del producto
        const response = await itemService.getItemById(idNumber)

        if (!response || !response.data) {
          throw new Error("Producto no encontrado")
        }

        const producto: Producto = response.data

        // Verificar si el usuario actual es el propietario del producto
        if (user?.id !== producto.user.id) {
          setError("No tienes permiso para editar este producto")
          navigate("/")
          return
        }

        // Establecer los valores del formulario
        setTitle(producto.title)
        setDescription(producto.description)
        setPrice(producto.price)
        setCategoryId(producto.category.id)
        setItemCondition(producto.itemCondition || "bueno")
        setLocation(producto.location || "")
        setStatus(producto.status)

        // Procesar las imágenes
        if (producto.imageUrl) {
          setProductImages(producto.imageUrl.split("|"))
        } else {
          setProductImages([])
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error)
        setError("No se pudieron cargar los datos del producto. Por favor, inténtalo de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, user, navigate])

  // Función para mostrar el modal de confirmación
  const showConfirm = (message: string, onConfirm: () => void) => {
    setConfirmMessage(message)
    setConfirmAction(() => onConfirm)
    setShowConfirmModal(true)
  }

  // Función para añadir una imagen
  const handleAddImage = () => {
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = "image/*"
    fileInput.multiple = false

    fileInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement
      const files = target.files

      if (!files || files.length === 0) return

      try {
        const file = files[0]

        // Crear una URL temporal para la vista previa
        const previewUrl = URL.createObjectURL(file)
        setCurrentUploadingImage(previewUrl)

        // Iniciar la carga con seguimiento de progreso
        setUploadProgress(0)

        // Subir la imagen usando el servicio de imágenes
        const uploadedUrl = await imageService.uploadImage(file, (progress) => {
          setUploadProgress(progress)
        })

        // Añadir la nueva imagen al array de imágenes
        setProductImages((prev) => [...prev, uploadedUrl])

        // Limpiar estados de carga
        setUploadProgress(null)
        setCurrentUploadingImage(null)
      } catch (error) {
        console.error("Error al subir la imagen:", error)
        setError("No se pudo subir la imagen. Por favor, inténtalo de nuevo.")
        setCurrentUploadingImage(null)
        setUploadProgress(null)
      }
    }

    fileInput.click()
  }

  // Función para eliminar una imagen
  const handleDeleteImage = (index: number) => {
    showConfirm("¿Estás seguro de que deseas eliminar esta imagen?", () => {
      setProductImages((prev) => {
        const newImages = [...prev]
        newImages.splice(index, 1)
        return newImages
      })
    })
  }

  // Función para guardar los cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (!title.trim()) {
      setError("El título es obligatorio")
      return
    }

    if (!description.trim()) {
      setError("La descripción es obligatoria")
      return
    }

    if (price <= 0) {
      setError("El precio debe ser mayor que cero")
      return
    }

    if (categoryId === "") {
      setError("Debes seleccionar una categoría")
      return
    }

    try {
      setSaving(true)
      setError(null)

      // Preparar los datos del producto
      const productData = {
        title,
        description,
        price,
        categoryId: Number(categoryId),
        imageUrl: productImages.join("|"),
        itemCondition,
        location,
        status,
      }

      // Actualizar el producto
      await itemService.modifyItem(idNumber, productData)

      // Mostrar mensaje de éxito
      setSuccess(true)

      // Redirigir después de un breve retraso
      setTimeout(() => {
        navigate(`/items/${idNumber}`)
      }, 2000)
    } catch (error) {
      console.error("Error al guardar los cambios:", error)
      setError("No se pudieron guardar los cambios. Por favor, inténtalo de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  // Función para cancelar la edición
  const handleCancel = () => {
    navigate(`/items/${idNumber}`)
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando datos del producto...</p>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/items/${idNumber}` }}>
          Producto
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Editar</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="mb-4">Editar Producto</h1>

      {/* Alertas */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <ExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success">
          <CheckCircle className="me-2" />
          ¡Producto actualizado correctamente! Redirigiendo...
        </Alert>
      )}

      <Card className="shadow-sm border-0 rounded-4 mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                {/* Información básica */}
                <h4 className="mb-3">Información básica</h4>

                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título del producto"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe tu producto detalladamente"
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Precio (créditos)</Form.Label>
                      <Form.Control
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Categoría</Form.Label>
                      <Form.Select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
                        required
                      >
                        <option value="">Selecciona una categoría</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Estado del producto</Form.Label>
                      <Form.Select value={itemCondition} onChange={(e) => setItemCondition(e.target.value)}>
                        <option value="nuevo">Nuevo</option>
                        <option value="como_nuevo">Como nuevo</option>
                        <option value="bueno">Buen estado</option>
                        <option value="aceptable">Estado aceptable</option>
                        <option value="necesita_reparacion">Necesita reparación</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ubicación</Form.Label>
                      <Form.Control
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ciudad, Provincia"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Estado de publicación</Form.Label>
                  <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Available">Disponible</option>
                    <option value="Reserved">Reservado</option>
                    <option value="Sold">Vendido</option>
                    <option value="Hidden">Oculto</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                {/* Gestión de imágenes */}
                <h4 className="mb-3">Imágenes</h4>

                <div className="image-manager mb-4">
                  {/* Imágenes actuales */}
                  {productImages.length > 0 ? (
                    <div className="mb-3">
                      {productImages.map((img, index) => (
                        <div key={index} className="position-relative mb-2">
                          <div className="d-flex align-items-center border rounded p-2">
                            <div style={{ width: "80px", height: "80px", overflow: "hidden" }}>
                              <OptimizedImage
                                src={img}
                                alt={`Imagen ${index + 1}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>
                            <div className="ms-3 flex-grow-1">
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Imagen {index + 1}</span>
                                <Button
                                  variant="link"
                                  className="text-danger p-0"
                                  onClick={() => handleDeleteImage(index)}
                                >
                                  <Trash size={18} />
                                </Button>
                              </div>
                              {index === 0 && <span className="badge bg-primary">Principal</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert variant="warning" className="mb-3">
                      No hay imágenes. Añade al menos una imagen.
                    </Alert>
                  )}

                  {/* Botón para añadir imágenes */}
                  <Button
                    variant="outline-primary"
                    className="w-100 d-flex align-items-center justify-content-center"
                    onClick={handleAddImage}
                    disabled={!!currentUploadingImage}
                  >
                    <PlusCircle className="me-2" />
                    Añadir imagen
                  </Button>

                  {/* Progreso de carga */}
                  {currentUploadingImage && (
                    <div className="mt-3">
                      <div className="border rounded p-2 mb-2">
                        <div style={{ width: "100%", height: "120px", overflow: "hidden" }}>
                          <img
                            src={currentUploadingImage || "/placeholder.svg"}
                            alt="Cargando imagen"
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        </div>
                        <ProgressBar now={uploadProgress || 0} label={`${uploadProgress}%`} className="mt-2" />
                      </div>
                    </div>
                  )}

                  {/* Información sobre imágenes */}
                  <div className="mt-3 small text-muted">
                    <p className="mb-1">
                      <strong>Consejos para las imágenes:</strong>
                    </p>
                    <ul className="ps-3 mb-0">
                      <li>Usa imágenes de buena calidad</li>
                      <li>La primera imagen será la principal</li>
                      <li>Muestra el producto desde diferentes ángulos</li>
                      <li>Tamaño recomendado: 800x600 píxeles</li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Botones de acción */}
            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="outline-secondary"
                onClick={handleCancel}
                disabled={saving}
                className="d-flex align-items-center"
              >
                <ArrowLeft className="me-2" />
                Cancelar
              </Button>

              <Button type="submit" variant="primary" disabled={saving} className="d-flex align-items-center">
                {saving ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="me-2" />
                    Guardar cambios
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Modal de confirmación */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar acción</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              confirmAction()
              setShowConfirmModal(false)
            }}
          >
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default PaginaEditarProducto