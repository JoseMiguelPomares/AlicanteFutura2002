"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar, Image } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, PlusCircle, CheckCircle } from "react-bootstrap-icons"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import { UserService } from "../services/userService"
import { ImageService } from "../services/imageService"

export const PaginaEditarPerfil = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const userService = new UserService()
  const imageService = new ImageService()

  // Estados para el formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    aboutMe: "",
    imageUrl: "",
  })

  // Estados para la UI
  const [loading, setLoading] = useState(false)
  const [loadingImage, setLoadingImage] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validated, setValidated] = useState(false)

  // Cargar datos del usuario
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login")
      return
    }

    // Cargar datos actuales del usuario
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const response = await userService.getUserById(user.id)
        const userData = response.data

        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          location: userData.location || "",
          aboutMe: userData.aboutMe || "",
          imageUrl: userData.imageUrl || "",
        })
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error)
        setError("No se pudieron cargar tus datos. Por favor, inténtalo de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [isAuthenticated, user, navigate])

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Manejar cambio de imagen de perfil
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setLoadingImage(true)
      setError(null)

      const file = files[0]
      const imageUrl = await imageService.uploadImage(file, (progress) => {
        setUploadProgress(progress)
      })

      setFormData({ ...formData, imageUrl })
    } catch (error) {
      console.error("Error al subir la imagen:", error)
      setError("No se pudo subir la imagen. Por favor, inténtalo de nuevo.")
    } finally {
      setLoadingImage(false)
    }
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
      const userData = {
        id: user?.id,
        name: formData.name,
        email: formData.email,
        location: formData.location,
        aboutMe: formData.aboutMe,
        imageUrl: formData.imageUrl,
      }

      // Enviar datos a la API
      await userService.updateUser(userData)

      // Actualizar el usuario en el contexto de autenticación
      // Esto dependerá de cómo esté implementado tu contexto de autenticación
      // Podrías necesitar añadir un método updateUserInfo en tu AuthContext

      setSuccess(true)
      window.scrollTo(0, 0)

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        navigate(`/perfil/${user?.id}`)
      }, 2000)
    } catch (error: any) {
      console.error("Error al actualizar el perfil:", error)
      setError(error.message || "No se pudo actualizar tu perfil. Por favor, inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (loading && !formData.name) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando tus datos...</p>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Cabecera */}
            <div className="d-flex align-items-center mb-4">
              <Button variant="link" className="text-muted p-0 me-3" onClick={() => navigate(-1)}>
                <ArrowLeft size={24} />
              </Button>
              <h1 className="fw-bold mb-0">Editar perfil</h1>
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
                <Alert.Heading>¡Perfil actualizado!</Alert.Heading>
                <p>Tu perfil ha sido actualizado correctamente. Serás redirigido en unos segundos...</p>
              </Alert>
            )}

            {/* Formulario de edición */}
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  {/* Imagen de perfil */}
                  <div className="text-center mb-4">
                    <div className="position-relative d-inline-block">
                      <Image
                        src={formData.imageUrl || "/placeholder.svg"}
                        roundedCircle
                        className="border"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                      />
                      <Button
                        variant="success"
                        size="sm"
                        className="position-absolute bottom-0 end-0 rounded-circle p-2"
                        onClick={() => document.getElementById("profileImageInput")?.click()}
                        disabled={loadingImage}
                      >
                        <PlusCircle size={16} />
                      </Button>
                    </div>
                    <input
                      id="profileImageInput"
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={handleImageUpload}
                    />
                    {loadingImage && (
                      <div className="mt-2">
                        <p className="small text-muted mb-1">Subiendo imagen... {uploadProgress}%</p>
                        <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
                      </div>
                    )}
                  </div>

                  {/* Nombre */}
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      maxLength={50}
                    />
                    <Form.Control.Feedback type="invalid">Por favor, introduce tu nombre.</Form.Control.Feedback>
                  </Form.Group>

                  {/* Email (solo lectura) */}
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} readOnly disabled />
                    <Form.Text className="text-muted">El email no se puede modificar.</Form.Text>
                  </Form.Group>

                  {/* Ubicación */}
                  <Form.Group className="mb-3" controlId="formLocation">
                    <Form.Label>Ubicación</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ej: Madrid, España"
                    />
                  </Form.Group>

                  {/* Descripción */}
                  <Form.Group className="mb-4" controlId="formDescription">
                    <Form.Label>Sobre mí</Form.Label>
                    <Form.Control
                      as="textarea"
                      className="non-resizable-textarea"
                      rows={4}
                      name="aboutMe"
                      value={formData.aboutMe}
                      onChange={handleChange}
                      placeholder="Cuéntanos un poco sobre ti..."
                      maxLength={500}
                    />
                    <Form.Text className="text-muted">
                      Máximo 500 caracteres. {formData.aboutMe.length}/500
                    </Form.Text>
                  </Form.Group>

                  {/* Botones de acción */}
                  <div className="d-flex gap-3">
                    <Button variant="outline-secondary" onClick={() => navigate(-1)} disabled={loading}>
                      Cancelar
                    </Button>
                    <Button variant="success" type="submit" className="flex-grow-1" disabled={loading}>
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Guardando...
                        </>
                      ) : (
                        "Guardar cambios"
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Consejos */}
            <Card className="border-0 shadow-sm rounded-4 mt-4 bg-light">
              <Card.Body className="p-4">
                <h3 className="h5 fw-bold mb-3">
                  <CheckCircle className="text-success me-2" />
                  Consejos para tu perfil
                </h3>
                <ul className="mb-0">
                  <li className="mb-2">Una foto de perfil clara ayuda a generar confianza.</li>
                  <li className="mb-2">Incluye tu ubicación para facilitar los intercambios locales.</li>
                  <li>Una buena descripción personal aumenta las posibilidades de intercambio.</li>
                </ul>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  )
}