"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab, ListGroup, Image, Form, Alert, ProgressBar } from "react-bootstrap"
import { CheckCircle, GeoAlt, Calendar3, StarFill, Star, Plus, Chat, Pencil, XCircle, PlusCircle, Image as ImageIcon } from "react-bootstrap-icons"
import { ItemService } from "../services/itemService"
import { UserService } from "../services/userService"
import { useAuth } from "../contexts/AuthContext"
import { ReviewService } from "../services/reviewService"
import { ProductCard } from "../components/ProductCard"
import { ImageService } from "../services/imageService"

interface User {
  id: number
  name: string
  email: string
  imageUrl?: string
  verified?: boolean
  location?: string
  joinDate?: string
  description?: string
  reputation?: number
}

interface Item {
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
}

interface Review {
  id: number
  reviewer: {
    id: number
    name: string
    imageUrl?: string
  }
  reviewed_id: number
  rating: number
  comment: string
  created_at: string
  images?: string[] // Añadir campo para imágenes
}

export const PaginaPerfil = () => {
  const { id } = useParams<{ id: string }>()
  const [userProfile, setUser] = useState<User | null>(null)
  const [userItems, setUserItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const itemService = new ItemService()
  const userService = new UserService()
  const reviewService = new ReviewService()
  const imageService = new ImageService()

  // Estados para reviews
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  })
  const [editReviewData, setEditReviewData] = useState({
    rating: 5,
    comment: "",
  })
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null)
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
  })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)

  const { user, isAuthenticated } = useAuth()
  const isOwnProfile = isAuthenticated && user?.id === Number(id)
  const [canReview, setCanReview] = useState<boolean>(true)

  // Añadir estos estados para manejar imágenes
  const [reviewImageFiles, setReviewImageFiles] = useState<File[]>([])
  const [reviewImagePreviewUrls, setReviewImagePreviewUrls] = useState<string[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [editReviewImageFiles, setEditReviewImageFiles] = useState<File[]>([])
  const [editReviewImagePreviewUrls, setEditReviewImagePreviewUrls] = useState<string[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const response = await userService.getUserById(Number(id))
        setUser(response.data)

        try {
          const itemsResponse = await itemService.getByUserId(Number(id))
          setUserItems(itemsResponse)
        } catch (error) {
          console.error("Error al cargar productos del usuario:", error)
        }
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [id])

  useEffect(() => {
    const fetchReviews = async () => {
      if (id) {
        try {
          const reviewsData = await reviewService.getReviewsByUserId(Number(id))
          setReviews(reviewsData)
          const stats = await reviewService.getUserReviewStats(Number(id))
          setReviewStats(stats)
        } catch (error) {
          console.error("Error al cargar reviews:", error)
        }
      }
    }

    fetchReviews()
  }, [id])

  useEffect(() => {
    const checkCanReview = async () => {
      if (isAuthenticated && user && id && user.id !== Number(id)) {
        const hasReviewed = await reviewService.hasUserReviewed(user.id, Number(id))
        setCanReview(!hasReviewed)
      }
    }

    checkCanReview()
  }, [isAuthenticated, user, id, reviews])

  // Añadir esta función para manejar la carga de imágenes para nuevas reviews
  const handleReviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Añadir los nuevos archivos a la lista
    const newFiles = Array.from(files)
    setReviewImageFiles([...reviewImageFiles, ...newFiles])

    // Crear URLs de vista previa para los nuevos archivos
    const newPreviewUrls = await Promise.all(
      newFiles.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
      }),
    )

    setReviewImagePreviewUrls([...reviewImagePreviewUrls, ...newPreviewUrls])
  }

  // Añadir esta función para manejar la carga de imágenes para editar reviews
  const handleEditReviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Añadir los nuevos archivos a la lista
    const newFiles = Array.from(files)
    setEditReviewImageFiles([...editReviewImageFiles, ...newFiles])

    // Crear URLs de vista previa para los nuevos archivos
    const newPreviewUrls = await Promise.all(
      newFiles.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
      }),
    )

    setEditReviewImagePreviewUrls([...editReviewImagePreviewUrls, ...newPreviewUrls])
  }

  // Añadir esta función para eliminar imágenes de nuevas reviews
  const removeReviewImage = (index: number) => {
    const newFiles = [...reviewImageFiles]
    const newPreviewUrls = [...reviewImagePreviewUrls]

    newFiles.splice(index, 1)
    newPreviewUrls.splice(index, 1)

    setReviewImageFiles(newFiles)
    setReviewImagePreviewUrls(newPreviewUrls)
  }

  // Añadir esta función para eliminar imágenes al editar reviews
  const removeEditReviewImage = (index: number) => {
    const newFiles = [...editReviewImageFiles]
    const newPreviewUrls = [...editReviewImagePreviewUrls]

    newFiles.splice(index, 1)
    newPreviewUrls.splice(index, 1)

    setEditReviewImageFiles(newFiles)
    setEditReviewImagePreviewUrls(newPreviewUrls)
  }

  // Modificar la función handleSubmitReview para incluir la carga de imágenes
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated || !user) {
      setReviewError("Debes iniciar sesión para dejar una valoración")
      return
    }

    if (user.id === Number(id)) {
      setReviewError("No puedes valorarte a ti mismo")
      return
    }

    setSubmittingReview(true)
    setReviewError(null)

    try {
      // Subir imágenes si hay alguna
      const imageUrls: string[] = []

      if (reviewImageFiles.length > 0) {
        setUploadingImage(true)

        for (let i = 0; i < reviewImageFiles.length; i++) {
          try {
            const imageUrl = await imageService.uploadImage(reviewImageFiles[i], (progress) => {
              setUploadProgress(progress)
            })
            imageUrls.push(imageUrl)
          } catch (error) {
            console.error(`Error al subir la imagen ${i + 1}:`, error)
            setReviewError(`No se pudo subir la imagen ${i + 1}. Por favor, inténtalo de nuevo.`)
            setSubmittingReview(false)
            setUploadingImage(false)
            return
          }
        }

        setUploadingImage(false)
      }

      const reviewData = {
        reviewer_id: user.id,
        reviewed_id: Number(id),
        rating: newReview.rating,
        comment: newReview.comment,
        images: imageUrls,
      }

      const createdReview = await reviewService.createReview(reviewData)

      setReviews([
        {
          ...createdReview,
          reviewer: {
            id: user.id,
            name: user.name,
            imageUrl: user.imageUrl,
          },
          images: imageUrls,
        },
        ...reviews,
      ])

      const newTotalReviews = reviewStats.totalReviews + 1
      const newAverageRating =
        (reviewStats.averageRating * reviewStats.totalReviews + newReview.rating) / newTotalReviews

      setReviewStats({
        totalReviews: newTotalReviews,
        averageRating: newAverageRating,
      })

      setNewReview({
        rating: 5,
        comment: "",
      })
      setReviewImageFiles([])
      setReviewImagePreviewUrls([])
      setCanReview(false)
    } catch (error) {
      setReviewError("Error al enviar la valoración. Inténtalo de nuevo.")
      console.error("Error al enviar review:", error)
    } finally {
      setSubmittingReview(false)
    }
  }

  // Modificar la función handleUpdateReview para incluir la carga de imágenes
  const handleUpdateReview = async (reviewId: number) => {
    try {
      setSubmittingReview(true)

      // Subir imágenes nuevas si hay alguna
      const imageUrls: string[] = []

      if (editReviewImageFiles.length > 0) {
        setUploadingImage(true)

        for (let i = 0; i < editReviewImageFiles.length; i++) {
          try {
            const imageUrl = await imageService.uploadImage(editReviewImageFiles[i], (progress) => {
              setUploadProgress(progress)
            })
            imageUrls.push(imageUrl)
          } catch (error) {
            console.error(`Error al subir la imagen ${i + 1}:`, error)
            setReviewError(`No se pudo subir la imagen ${i + 1}. Por favor, inténtalo de nuevo.`)
            setSubmittingReview(false)
            setUploadingImage(false)
            return
          }
        }

        setUploadingImage(false)
      }

      // Combinar imágenes existentes con nuevas
      const existingReview = reviews.find((r) => r.id === reviewId)
      const combinedImages = [...(existingReview?.images || []), ...imageUrls]

      const updatedReview = await reviewService.updateReview(reviewId, {
        ...editReviewData,
        images: combinedImages,
      })

      setReviews(
        reviews.map((review) =>
          review.id === reviewId
            ? {
              ...review,
              rating: updatedReview.rating,
              comment: updatedReview.comment,
              images: combinedImages,
            }
            : review,
        ),
      )

      const updatedStats = await reviewService.getUserReviewStats(Number(id))
      setReviewStats(updatedStats)

      setEditingReviewId(null)
      setEditReviewImageFiles([])
      setEditReviewImagePreviewUrls([])
    } catch (error) {
      setReviewError("Error al actualizar la valoración. Inténtalo de nuevo.")
      console.error("Error al actualizar review:", error)
    } finally {
      setSubmittingReview(false)
    }
  }

  // Modificar la función handleEditReview para inicializar las imágenes
  const handleEditReview = (review: Review) => {
    setEditingReviewId(review.id)
    setEditReviewData({
      rating: review.rating,
      comment: review.comment,
    })
    setEditReviewImageFiles([])
    setEditReviewImagePreviewUrls(review.images || [])
  }

  // Modificar la función handleCancelEdit para limpiar las imágenes
  const handleCancelEdit = () => {
    setEditingReviewId(null)
    setEditReviewImageFiles([])
    setEditReviewImagePreviewUrls([])
  }

  // Funciones de renderizado
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

  const renderRatingSelector = (rating: number, onChange: (rating: number) => void) => {
    return (
      <div className="d-flex mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} onClick={() => onChange(star)} style={{ cursor: "pointer" }}>
            {star <= rating ? (
              <StarFill className="text-warning fs-4 me-1" />
            ) : (
              <Star className="text-warning fs-4 me-1" />
            )}
          </span>
        ))}
      </div>
    )
  }

  // Funciones para manejar cambios en el rating y comentario
  const handleRatingChange = (rating: number) => {
    setNewReview({ ...newReview, rating })
  }

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReview({ ...newReview, comment: e.target.value })
  }

  const handleEditRatingChange = (rating: number) => {
    setEditReviewData({ ...editReviewData, rating })
  }

  const handleEditReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditReviewData({ ...editReviewData, comment: e.target.value })
  }

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await reviewService.deleteReview(reviewId)
      setReviews(reviews.filter((review) => review.id !== reviewId))

      const updatedStats = await reviewService.getUserReviewStats(Number(id))
      setReviewStats(updatedStats)
    } catch (error) {
      console.error("Error al eliminar la valoración:", error)
    }
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando perfil...</span>
        </div>
        <p className="mt-3">Cargando información del perfil...</p>
      </Container>
    )
  }

  if (error || !userProfile) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-danger">
          <h4>Error al cargar el perfil</h4>
          <p>No se pudo encontrar la información del usuario solicitado.</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <Row>
        {/* Columna izquierda - Información del perfil */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm rounded-4">
            {isOwnProfile && (
              <div className="bg-success text-white py-2 px-3 rounded-top text-center fw-bold">Mi Perfil</div>
            )}
            <Card.Body className="text-center p-4">
              <div className="position-relative mb-4">
                <Image
                  src={userProfile.imageUrl || "/placeholder.svg"}
                  roundedCircle
                  className="shadow-sm"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                {userProfile.verified && (
                  <Badge
                    bg="success"
                    className="position-absolute bottom-0 end-0 rounded-circle p-2"
                    title="Usuario verificado"
                  >
                    <CheckCircle size={20} />
                  </Badge>
                )}
              </div>

              <h3 className="fw-bold mb-1">{userProfile.name}</h3>
              <div className="d-flex justify-content-center align-items-center mb-2">
                <Badge bg="info" className="rounded-pill px-3 py-2">
                  <span className="fw-bold">
                    Reputación: {reviewStats.averageRating.toFixed(1)} ({reviewStats.totalReviews} valoraciones)
                  </span>
                </Badge>
              </div>

              {userProfile.location && (
                <p className="text-muted mb-3">
                  <GeoAlt className="me-1" />
                  {userProfile.location}
                </p>
              )}

              <div className="d-grid gap-2">
                {!isOwnProfile ? (
                  <Button variant="outline-success" className="rounded-pill px-4 me-2">
                    <Chat className="me-2" />
                    Contactar
                  </Button>
                ) : (
                  <Button
                    variant="outline-primary"
                    className="rounded-pill px-4 me-2"
                    as={Link as any}
                    to="/editar-perfil"
                  >
                    <Pencil className="me-2" />
                    Editar Perfil
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm rounded-4 mt-4">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-3">Información</h4>
              <ListGroup variant="flush">
                {userProfile.joinDate && (
                  <ListGroup.Item className="px-0 py-2 d-flex justify-content-between border-bottom">
                    <span className="text-muted">Miembro desde</span>
                    <span className="fw-medium">
                      <Calendar3 className="me-1" />
                      {new Date(userProfile.joinDate).toLocaleDateString()}
                    </span>
                  </ListGroup.Item>
                )}
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between border-bottom">
                  <span className="text-muted">Productos</span>
                  <span className="fw-medium">{userItems.length}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Valoraciones</span>
                  <span className="fw-medium">{reviewStats.totalReviews}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Columna derecha - Pestañas */}
        <Col lg={8}>
          <Tabs defaultActiveKey="productos" className="mb-4">
            {/* Pestaña de Productos */}
            <Tab eventKey="productos" title="Productos">
              {userItems.length > 0 ? (
                <Row xs={1} md={2} className="g-4">
                  {userItems.map((item) => (
                    <Col key={item.id}>
                      <ProductCard producto={item} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <Card className="border-0 shadow-sm rounded-4">
                  <Card.Body className="text-center py-5">
                    {isOwnProfile ? (
                      <>
                        <p className="text-muted mb-3">Todavía no has publicado ningún producto o servicio.</p>
                        <Button as={Link as any} to="/vender" variant="success" className="rounded-pill px-4">
                          <Plus className="me-2" />
                          Publicar un producto o servicio
                        </Button>
                      </>
                    ) : (
                      <p className="text-muted mb-0">Este usuario aún no ha publicado productos.</p>
                    )}
                  </Card.Body>
                </Card>
              )}
            </Tab>

            {/* Pestaña "Sobre mí" */}
            <Tab eventKey="sobre" title="Sobre mí">
              <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  {userProfile.description ? (
                    <p className="mb-0">{userProfile.description}</p>
                  ) : (
                    <p className="text-muted text-center mb-0">
                      {isOwnProfile
                        ? "Todavía no has añadido una descripción."
                        : "Este usuario aún no ha añadido una descripción."}
                    </p>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            {/* Pestaña de Valoraciones */}
            <Tab eventKey="valoraciones" title="Valoraciones">
              <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  {isAuthenticated && user?.id !== Number(id) && canReview && (
                    <div className="mb-4">
                      <h5 className="fw-bold mb-3">Deja tu valoración</h5>
                      <Form onSubmit={handleSubmitReview}>
                        {renderRatingSelector(newReview.rating, handleRatingChange)}
                        <Form.Group className="mb-3">
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Comparte tu experiencia con este usuario..."
                            value={newReview.comment}
                            onChange={handleReviewChange}
                            required
                          />
                        </Form.Group>

                        {/* Sección para subir imágenes */}
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">Imágenes (opcional)</Form.Label>

                          {reviewImagePreviewUrls.length > 0 ? (
                            <div className="mb-3">
                              <Row xs={1} sm={3} className="g-2 mb-2">
                                {reviewImagePreviewUrls.map((url, index) => (
                                  <Col key={index}>
                                    <div className="position-relative">
                                      <img
                                        src={url || "/placeholder.svg"}
                                        alt={`Vista previa ${index + 1}`}
                                        className="img-fluid rounded-3 border"
                                        style={{ width: "100%", height: "100px", objectFit: "cover" }}
                                      />
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        className="position-absolute top-0 end-0 m-1 rounded-circle p-1"
                                        onClick={() => removeReviewImage(index)}
                                      >
                                        <XCircle size={14} />
                                      </Button>
                                    </div>
                                  </Col>
                                ))}
                                <Col>
                                  <div
                                    className="border rounded-3 d-flex flex-column justify-content-center align-items-center h-100"
                                    style={{
                                      cursor: "pointer",
                                      backgroundColor: "#f8f9fa",
                                      borderStyle: "dashed",
                                      minHeight: "100px",
                                    }}
                                    onClick={() => document.getElementById("reviewImageInput")?.click()}
                                  >
                                    <PlusCircle size={24} className="text-muted mb-1" />
                                    <p className="mb-0 text-muted small">Añadir imagen</p>
                                  </div>
                                </Col>
                              </Row>

                              {uploadingImage && (
                                <div className="mb-2">
                                  <p className="small text-muted mb-1">Subiendo imagen... {uploadProgress}%</p>
                                  <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div
                              className="border rounded-3 p-3 text-center mb-3"
                              style={{
                                cursor: "pointer",
                                backgroundColor: "#f8f9fa",
                                borderStyle: "dashed",
                              }}
                              onClick={() => document.getElementById("reviewImageInput")?.click()}
                            >
                              <ImageIcon size={24} className="text-muted mb-2" />
                              <p className="mb-0 small">Haz clic para subir imágenes</p>
                            </div>
                          )}

                          <input
                            id="reviewImageInput"
                            type="file"
                            accept="image/*"
                            className="d-none"
                            onChange={handleReviewImageUpload}
                            multiple
                          />

                          <Form.Text className="text-muted">
                            Puedes añadir imágenes para complementar tu valoración (opcional).
                          </Form.Text>
                        </Form.Group>

                        {reviewError && (
                          <Alert variant="danger" className="mb-3">
                            {reviewError}
                          </Alert>
                        )}
                        <Button variant="success" type="submit" className="rounded-pill" disabled={submittingReview}>
                          {submittingReview ? "Enviando..." : "Enviar valoración"}
                        </Button>
                      </Form>
                    </div>
                  )}

                  {/* Mensaje si ya ha valorado */}
                  {isAuthenticated && user?.id !== Number(id) && !canReview && (
                    <div className="mb-4 p-3 bg-light rounded">
                      <p className="mb-0 text-center">Ya has valorado a este usuario anteriormente.</p>
                    </div>
                  )}

                  <h5 className="fw-bold mb-3">Valoraciones recibidas</h5>

                  {reviews.length > 0 ? (
                    <div>
                      {reviews.map((review) => (
                        <div key={review.id} className="mb-3 pb-3 border-bottom">
                          {editingReviewId === review.id ? (
                            <div>
                              <div className="d-flex gap-3 mb-3">
                                <div className="flex-shrink-0">
                                  <img
                                    src={review.reviewer.imageUrl || "/placeholder.svg?height=50&width=50"}
                                    className="rounded-circle"
                                    width="50"
                                    height="50"
                                    alt={review.reviewer.name}
                                  />
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-bold">{review.reviewer.name}</span>
                                    <div className="d-flex gap-2">
                                      <Button
                                        variant="outline-success"
                                        size="sm"
                                        onClick={() => handleUpdateReview(review.id)}
                                        disabled={submittingReview}
                                      >
                                        {submittingReview ? "Guardando..." : "Guardar"}
                                      </Button>
                                      <Button variant="outline-secondary" size="sm" onClick={handleCancelEdit}>
                                        Cancelar
                                      </Button>
                                    </div>
                                  </div>

                                  {renderRatingSelector(editReviewData.rating, handleEditRatingChange)}

                                  <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={editReviewData.comment}
                                    onChange={handleEditReviewChange}
                                    className="mb-3"
                                  />

                                  {/* Sección para editar imágenes */}
                                  <div className="mb-3">
                                    <Form.Label className="fw-medium small">Imágenes</Form.Label>

                                    {editReviewImagePreviewUrls.length > 0 ? (
                                      <Row xs={1} sm={3} className="g-2 mb-2">
                                        {editReviewImagePreviewUrls.map((url, index) => (
                                          <Col key={index}>
                                            <div className="position-relative">
                                              <img
                                                src={url || "/placeholder.svg"}
                                                alt={`Vista previa ${index + 1}`}
                                                className="img-fluid rounded-3 border"
                                                style={{ width: "100%", height: "80px", objectFit: "cover" }}
                                              />
                                              <Button
                                                variant="danger"
                                                size="sm"
                                                className="position-absolute top-0 end-0 m-1 rounded-circle p-1"
                                                onClick={() => removeEditReviewImage(index)}
                                              >
                                                <XCircle size={14} />
                                              </Button>
                                            </div>
                                          </Col>
                                        ))}
                                        <Col>
                                          <div
                                            className="border rounded-3 d-flex flex-column justify-content-center align-items-center h-100"
                                            style={{
                                              cursor: "pointer",
                                              backgroundColor: "#f8f9fa",
                                              borderStyle: "dashed",
                                              minHeight: "80px",
                                            }}
                                            onClick={() => document.getElementById("editReviewImageInput")?.click()}
                                          >
                                            <PlusCircle size={20} className="text-muted mb-1" />
                                            <p className="mb-0 text-muted small">Añadir</p>
                                          </div>
                                        </Col>
                                      </Row>
                                    ) : (
                                      <div
                                        className="border rounded-3 p-2 text-center mb-2"
                                        style={{
                                          cursor: "pointer",
                                          backgroundColor: "#f8f9fa",
                                          borderStyle: "dashed",
                                        }}
                                        onClick={() => document.getElementById("editReviewImageInput")?.click()}
                                      >
                                        <ImageIcon size={20} className="text-muted mb-1" />
                                        <p className="mb-0 small">Añadir imágenes</p>
                                      </div>
                                    )}

                                    <input
                                      id="editReviewImageInput"
                                      type="file"
                                      accept="image/*"
                                      className="d-none"
                                      onChange={handleEditReviewImageUpload}
                                      multiple
                                    />
                                  </div>

                                  {uploadingImage && (
                                    <div className="mb-2">
                                      <p className="small text-muted mb-1">Subiendo imagen... {uploadProgress}%</p>
                                      <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
                                    </div>
                                  )}

                                  {reviewError && (
                                    <Alert variant="danger" className="mb-2 small">
                                      {reviewError}
                                    </Alert>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="d-flex gap-3">
                              <div className="flex-shrink-0">
                                <img
                                  src={review.reviewer.imageUrl || "/placeholder.svg?height=50&width=50"}
                                  className="rounded-circle"
                                  width="50"
                                  height="50"
                                  alt={review.reviewer.name}
                                />
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <Link to={`/perfil/${review.reviewer.id}`} className="fw-bold text-decoration-none">
                                    {review.reviewer.name}
                                  </Link>
                                  {renderStars(review.rating)}
                                  <span className="text-muted ms-2 small">
                                    {new Date(review.created_at).toLocaleDateString()}
                                  </span>

                                  {/* Botones de edición/eliminación (solo para mis reviews) */}
                                  {isAuthenticated && user?.id === review.reviewer.id && (
                                    <div className="ms-auto d-flex gap-2">
                                      <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleEditReview(review)}
                                      >
                                        <Pencil size={14} />
                                      </Button>
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeleteReview(review.id)}
                                      >
                                        <XCircle size={14} />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                                <p className="mb-2">{review.comment}</p>

                                {/* Mostrar imágenes de la review */}
                                {review.images && review.images.length > 0 && (
                                  <div className="d-flex flex-wrap gap-2 mt-2 mb-2">
                                    {review.images.map((img, index) => (
                                      <img
                                        key={index}
                                        src={img || "/placeholder.svg"}
                                        alt={`Imagen ${index + 1} de la valoración`}
                                        className="img-thumbnail"
                                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                        onClick={() => window.open(img, "_blank")}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted text-center">
                      {isOwnProfile
                        ? "Todavía no has recibido valoraciones."
                        : "Este usuario aún no tiene valoraciones."}
                    </p>
                  )}
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  )
}