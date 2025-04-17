"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Container, Row, Col, Form, Button, Card, Alert, ProgressBar, Badge } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { CheckCircle, Image as ImageIcon, CurrencyDollar, GeoAlt, InfoCircle } from "react-bootstrap-icons"
import { motion } from "framer-motion"
import { ItemService } from "../services/itemService"
import { useAuth } from "../contexts/AuthContext"

// Lista de categorías disponibles
const CATEGORIAS = [
  { id: 1, name: "juguetes" },
  { id: 2, name: "ropa" },
  { id: 3, name: "calzado" },
  { id: 4, name: "tecnología" },
  { id: 5, name: "hogar" },
  { id: 6, name: "electrodomésticos" },
  { id: 7, name: "vehículos" },
  { id: 8, name: "jardinería" },
  { id: 9, name: "deporte" },
  { id: 10, name: "música" },
  { id: 11, name: "libros" },
  { id: 12, name: "otros" },
]

// Lista de condiciones disponibles
const CONDICIONES = [
  { value: "nuevo", label: "Nuevo", description: "Producto sin usar, en su embalaje original" },
  { value: "como_nuevo", label: "Como nuevo", description: "Usado pocas veces, en perfecto estado" },
  { value: "bueno", label: "Buen estado", description: "Usado pero bien conservado, funciona perfectamente" },
  { value: "aceptable", label: "Aceptable", description: "Muestra signos de uso pero funcional" },
  { value: "usado", label: "Usado", description: "Necesita reparación o tiene algún defecto" },
]

export const PaginaVender = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const itemService = new ItemService()

  // Estados para el formulario
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    condition: "",
    location: "",
    price: "",
    imageUrl: "",
  })

  // Estados para la UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validated, setValidated] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [step, setStep] = useState(1)

  // Comprobar si el usuario está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/vender")
    }
  }, [isAuthenticated, navigate])

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Simular la carga de una imagen
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Simular progreso de carga
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Crear URL para previsualización
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
      // Simular URL de imagen subida (en producción, esto vendría del backend)
      setFormData((prev) => ({
        ...prev,
        imageUrl: "https://source.unsplash.com/random/800x600/?product",
      }))
    }
    reader.readAsDataURL(file)
  }

  // Avanzar al siguiente paso
  const handleNextStep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    setStep(2)
    window.scrollTo(0, 0)
  }

  // Volver al paso anterior
  const handlePrevStep = () => {
    setStep(1)
    window.scrollTo(0, 0)
  }

  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Preparar datos para enviar a la API
      const itemData = {
        title: formData.title,
        description: formData.description,
        categoryId: Number.parseInt(formData.category_id),
        itemCondition: formData.condition,
        status: "Available",
        price: Number.parseFloat(formData.price),
        imageUrl: formData.imageUrl || "https://source.unsplash.com/random/800x600/?product", // Cambiado de image_url a imageUrl
        userId: user?.id,
        location: formData.location,
      }

      console.log("Enviando datos del producto:", itemData)

      // Enviar datos a la API
      const response = await itemService.addItem(itemData)
      console.log("Respuesta del servidor:", response)

      setSuccess(true)

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        navigate(`/perfil/${user?.id}`) // Redirigir al perfil del usuario en lugar de a un producto específico
      }, 2000)
    } catch (error: any) {
      console.error("Error al publicar el producto:", error)

      // Mostrar mensaje de error más detallado
      if (error.response && error.response.data) {
        setError(`Error: ${error.response.data.message || JSON.stringify(error.response.data)}`)
      } else {
        setError("No se pudo publicar el producto. Por favor, inténtalo de nuevo.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Cabecera */}
            <div className="text-center mb-5">
              <h1 className="fw-bold mb-2">Publica tu producto</h1>
              <p className="text-muted">Comparte lo que ya no necesitas y gana créditos para intercambiar</p>
            </div>

            {/* Indicador de progreso */}
            <div className="mb-5">
              <div className="d-flex justify-content-between mb-2">
                <span className={step >= 1 ? "fw-bold text-success" : "text-muted"}>1. Información básica</span>
                <span className={step >= 2 ? "fw-bold text-success" : "text-muted"}>2. Detalles y publicación</span>
              </div>
              <ProgressBar now={step === 1 ? 50 : 100} variant="success" style={{ height: "8px" }} />
            </div>

            {/* Mensajes de éxito o error */}
            {error && (
              <Alert variant="danger" className="mb-4">
                <Alert.Heading>Error</Alert.Heading>
                <p>{error}</p>
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="mb-4">
                <Alert.Heading>¡Producto publicado con éxito!</Alert.Heading>
                <p>Tu producto ha sido publicado correctamente. Serás redirigido en unos segundos...</p>
              </Alert>
            )}

            {/* Formulario paso 1: Información básica */}
            {step === 1 && (
              <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <h2 className="h4 fw-bold mb-4">Información básica</h2>

                  <Form noValidate validated={validated} onSubmit={handleNextStep}>
                    {/* Título del producto */}
                    <Form.Group className="mb-4" controlId="formTitle">
                      <Form.Label className="fw-medium">
                        Título del producto <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ej: Smartphone Samsung Galaxy S21 128GB"
                        required
                        maxLength={100}
                      />
                      <Form.Control.Feedback type="invalid">
                        Por favor, introduce un título para tu producto.
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Un buen título ayuda a que tu producto sea más visible (máx. 100 caracteres).
                      </Form.Text>
                    </Form.Group>

                    {/* Categoría */}
                    <Form.Group className="mb-4" controlId="formCategory">
                      <Form.Label className="fw-medium">
                        Categoría <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange as any}
                        required
                      >
                        <option value="">Selecciona una categoría</option>
                        {CATEGORIAS.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">Por favor, selecciona una categoría.</Form.Control.Feedback>
                    </Form.Group>

                    {/* Imagen del producto */}
                    <Form.Group className="mb-4" controlId="formImage">
                      <Form.Label className="fw-medium">
                        Imagen del producto <span className="text-danger">*</span>
                      </Form.Label>

                      {imagePreview ? (
                        <div className="position-relative mb-3">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Vista previa"
                            className="img-fluid rounded-3 w-100"
                            style={{ maxHeight: "300px", objectFit: "cover" }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-2 rounded-circle"
                            onClick={() => {
                              setImagePreview(null)
                              setFormData({ ...formData, imageUrl: "" })
                            }}
                          >
                            &times;
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="border rounded-3 p-5 text-center mb-3"
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#f8f9fa",
                            borderStyle: "dashed",
                          }}
                          onClick={() => document.getElementById("fileInput")?.click()}
                        >
                          <ImageIcon size={48} className="text-muted mb-3" />
                          <p className="mb-1">Haz clic para subir una imagen</p>
                          <p className="text-muted small">O arrastra y suelta aquí</p>
                          <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            className="d-none"
                            onChange={handleImageUpload}
                          />
                        </div>
                      )}

                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mb-3" />
                      )}

                      <Form.Control type="hidden" name="imageUrl" value={formData.imageUrl} required />
                      <Form.Control.Feedback type="invalid">
                        Por favor, sube una imagen de tu producto.
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Sube una imagen clara y representativa de tu producto. Formatos: JPG, PNG (máx. 5MB).
                      </Form.Text>
                    </Form.Group>

                    {/* Botón para continuar */}
                    <div className="d-grid mt-4">
                      <Button variant="success" type="submit" size="lg" className="rounded-pill">
                        Continuar
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            )}

            {/* Formulario paso 2: Detalles y publicación */}
            {step === 2 && (
              <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <h2 className="h4 fw-bold mb-4">Detalles del producto</h2>

                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    {/* Descripción */}
                    <Form.Group className="mb-4" controlId="formDescription">
                      <Form.Label className="fw-medium">
                        Descripción <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe tu producto, menciona características, estado, razón de venta..."
                        required
                        maxLength={1000}
                      />
                      <Form.Control.Feedback type="invalid">
                        Por favor, añade una descripción para tu producto.
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Una buena descripción aumenta las posibilidades de intercambio (máx. 1000 caracteres).
                      </Form.Text>
                    </Form.Group>

                    {/* Estado del producto */}
                    <Form.Group className="mb-4" controlId="formCondition">
                      <Form.Label className="fw-medium">
                        Estado del producto <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="mb-3">
                        {CONDICIONES.map((condicion) => (
                          <Form.Check
                            key={condicion.value}
                            type="radio"
                            id={`condition-${condicion.value}`}
                            label={
                              <div>
                                <span className="fw-medium">{condicion.label}</span>
                                <span className="text-muted ms-2 small">({condicion.description})</span>
                              </div>
                            }
                            name="condition"
                            value={condicion.value}
                            checked={formData.condition === condicion.value}
                            onChange={handleChange}
                            className="mb-2"
                            required
                          />
                        ))}
                      </div>
                      <Form.Control.Feedback type="invalid">
                        Por favor, selecciona el estado de tu producto.
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Precio */}
                    <Form.Group className="mb-4" controlId="formPrice">
                      <Form.Label className="fw-medium">
                        Precio (en créditos) <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <CurrencyDollar className="text-muted" />
                        </span>
                        <Form.Control
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="Ej: 50"
                          min="1"
                          max="10000"
                          required
                        />
                        <span className="input-group-text bg-light">Créditos</span>
                      </div>
                      <Form.Control.Feedback type="invalid">
                        Por favor, introduce un precio válido (entre 1 y 10000 créditos).
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Establece un precio justo en créditos para facilitar el intercambio.
                      </Form.Text>
                    </Form.Group>

                    {/* Ubicación */}
                    <Form.Group className="mb-4" controlId="formLocation">
                      <Form.Label className="fw-medium">
                        Ubicación <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <GeoAlt className="text-muted" />
                        </span>
                        <Form.Control
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Ej: Madrid, España"
                          required
                        />
                      </div>
                      <Form.Control.Feedback type="invalid">
                        Por favor, indica la ubicación del producto.
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Indica dónde se encuentra el producto para facilitar el intercambio.
                      </Form.Text>
                    </Form.Group>

                    {/* Términos y condiciones */}
                    <Alert variant="light" className="mb-4 border">
                      <div className="d-flex">
                        <div className="me-3">
                          <InfoCircle size={24} className="text-primary" />
                        </div>
                        <div>
                          <p className="mb-0 small">
                            Al publicar este producto, aceptas nuestros{" "}
                            <a href="/terminos" target="_blank" rel="noopener noreferrer">
                              Términos y Condiciones
                            </a>{" "}
                            y confirmas que el producto cumple con nuestras{" "}
                            <a href="/politicas" target="_blank" rel="noopener noreferrer">
                              Políticas de Publicación
                            </a>
                            .
                          </p>
                        </div>
                      </div>
                    </Alert>

                    {/* Botones de acción */}
                    <div className="d-flex gap-3 mt-4">
                      <Button variant="outline-secondary" onClick={handlePrevStep} className="px-4" disabled={loading}>
                        Volver
                      </Button>
                      <Button variant="success" type="submit" className="flex-grow-1 rounded-pill" disabled={loading}>
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Publicando...
                          </>
                        ) : (
                          "Publicar producto"
                        )}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            )}

            {/* Consejos para una buena publicación */}
            <Card className="border-0 shadow-sm rounded-4 mt-4 bg-light">
              <Card.Body className="p-4">
                <h3 className="h5 fw-bold mb-3">
                  <CheckCircle className="text-success me-2" />
                  Consejos para una buena publicación
                </h3>
                <Row xs={1} md={3} className="g-4">
                  <Col>
                    <div className="d-flex">
                      <div className="me-2">
                        <Badge bg="success" className="rounded-circle p-2">
                          1
                        </Badge>
                      </div>
                      <div>
                        <h4 className="h6 fw-bold">Sé detallado</h4>
                        <p className="small text-muted mb-0">
                          Incluye todas las características relevantes y el estado real del producto.
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <div className="d-flex">
                      <div className="me-2">
                        <Badge bg="success" className="rounded-circle p-2">
                          2
                        </Badge>
                      </div>
                      <div>
                        <h4 className="h6 fw-bold">Usa buenas fotos</h4>
                        <p className="small text-muted mb-0">
                          Imágenes claras y desde varios ángulos aumentan el interés.
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <div className="d-flex">
                      <div className="me-2">
                        <Badge bg="success" className="rounded-circle p-2">
                          3
                        </Badge>
                      </div>
                      <div>
                        <h4 className="h6 fw-bold">Precio justo</h4>
                        <p className="small text-muted mb-0">Un precio razonable facilita el intercambio rápido.</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  )
}
