"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab, ListGroup, Image, Form, Alert } from "react-bootstrap"
import { CheckCircle, GeoAlt, Calendar3, StarFill, Star, Plus, Chat, Pencil } from "react-bootstrap-icons"
import { ItemService } from "../services/itemService"
import { UserService } from "../services/userService"
import { useAuth } from "../contexts/AuthContext"
import { ReviewService } from "../services/reviewService"

interface User {
  id: number
  name: string
  email: string
  imageUrl?: string
  verified?: boolean
  location?: string
  joinDate?: string
  description?: string
  reputation?: number // Añadimos el campo reputation
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

// Añadir esta interfaz para las reviews
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
}

export const PaginaPerfil = () => {
  const { id } = useParams<{ id: string }>()
  const [userProfile, setUser] = useState<User | null>(null)
  const [userItems, setUserItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const itemService = new ItemService()
  const userService = new UserService()

  // Dentro de la función PaginaPerfil, añadir estos estados
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  })
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
  })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const { user, isAuthenticated } = useAuth()
  const reviewService = new ReviewService()
  // Comprobar si es mi propia página de usuario o es la de un tercero
  const isOwnProfile = isAuthenticated && user?.id === Number(id)
  // Añadir estado para controlar si el usuario puede dejar una reseña
  const [canReview, setCanReview] = useState<boolean>(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)

        // Obtener datos del usuario desde la API
        const response = await userService.getUserById(Number(id))
        const userData = response.data
        setUser(userData)

        // Obtener los productos del usuario
        try {
          const itemsResponse = await itemService.getByUserId(Number(id))
          // La API ya devuelve solo los items del usuario, no es necesario filtrar
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

  // Añadir este useEffect para cargar las reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (id) {
        try {
          // Obtener las reviews del usuario
          const reviewsData = await reviewService.getReviewsByUserId(Number(id))
          setReviews(reviewsData)

          // Obtener estadísticas de reviews
          const stats = await reviewService.getUserReviewStats(Number(id))
          setReviewStats(stats)
        } catch (error) {
          console.error("Error al cargar reviews:", error)
        }
      }
    }

    fetchReviews()
  }, [id])

  // Añadir este effect para verificar si el usuario puede dejar una reseña
  useEffect(() => {
    const checkCanReview = async () => {
      if (isAuthenticated && user && id && user.id !== Number(id)) {
        const hasReviewed = await reviewService.hasUserReviewed(user.id, Number(id))
        setCanReview(!hasReviewed)
      }
    }
    
    checkCanReview()
  }, [isAuthenticated, user, id])

  // Añadir estas funciones para manejar las reviews
  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReview({ ...newReview, comment: e.target.value })
  }

  const handleRatingChange = (rating: number) => {
    setNewReview({ ...newReview, rating })
  }

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
      const reviewData = {
        reviewer_id: user.id,
        reviewed_id: Number(id),
        rating: newReview.rating,
        comment: newReview.comment,
      }

      const createdReview = await reviewService.createReview(reviewData)

      // Añadir la nueva review al estado
      setReviews([
        {
          ...createdReview,
          reviewer: {
            id: user.id,
            name: user.name,
            imageUrl: user.imageUrl,
          },
        },
        ...reviews,
      ])

      // Actualizar estadísticas
      const newTotalReviews = reviewStats.totalReviews + 1
      const newAverageRating =
        (reviewStats.averageRating * reviewStats.totalReviews + newReview.rating) / newTotalReviews

      setReviewStats({
        totalReviews: newTotalReviews,
        averageRating: newAverageRating,
      })

      // Limpiar el formulario
      setNewReview({
        rating: 5,
        comment: "",
      })
    } catch (error) {
      setReviewError("Error al enviar la valoración. Inténtalo de nuevo.")
      console.error("Error al enviar review:", error)
    } finally {
      setSubmittingReview(false)
    }
  }

  // Función para renderizar estrellas
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

  // Función para renderizar selector de estrellas
  const renderRatingSelector = () => {
    return (
      <div className="d-flex mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} onClick={() => handleRatingChange(star)} style={{ cursor: "pointer" }}>
            {star <= newReview.rating ? (
              <StarFill className="text-warning fs-4 me-1" />
            ) : (
              <Star className="text-warning fs-4 me-1" />
            )}
          </span>
        ))}
      </div>
    )
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
        {/* Información del perfil */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm rounded-4">
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

              {/* En la sección donde se muestra el nombre del usuario, añadir la reputación */}
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
                  <Button variant="outline-primary" className="rounded-pill px-4 me-2" as={Link as any} to="/editar-perfil">
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

        {/* Pestañas con contenido */}
        <Col lg={8}>
          <Tabs defaultActiveKey="productos" className="mb-4">
            <Tab eventKey="productos" title="Productos">
              {userItems.length > 0 ? (
                <Row xs={1} md={2} className="g-4">
                  {userItems.map((item) => (
                    <Col key={item.id}>
                      <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                        <div style={{ height: "180px", overflow: "hidden" }}>
                          <Card.Img
                            variant="top"
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.title}
                            style={{ objectFit: "cover", height: "100%", width: "100%" }}
                          />
                        </div>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            {item.category && (
                              <Badge bg="primary" className="rounded-pill">
                                {item.category.name}
                              </Badge>
                            )}
                            <Badge bg={item.status === "Available" ? "success" : "secondary"} className="rounded-pill">
                              {item.status === "Available" ? "Disponible" : item.status}
                            </Badge>
                          </div>
                          <Card.Title className="fw-bold">{item.title}</Card.Title>
                          <Card.Text className="text-muted small mb-3" style={{ height: "40px", overflow: "hidden" }}>
                            {item.description}
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold text-success">{item.price} Créditos</span>
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="rounded-pill"
                              href={`/productos/${item.id}`}
                            >
                              Ver detalles
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Card className="border-0 shadow-sm rounded-4">
                  <Card.Body className="text-center py-5">
                    {isOwnProfile ? (
                      <>
                        <p className="text-muted mb-3">Todavía no has publicado ningún producto o servicio.</p>
                        <Button
                          as={Link as any}
                          to="/vender"
                          variant="success"
                          className="rounded-pill px-4"
                        >
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

            <Tab eventKey="valoraciones" title="Valoraciones">
              <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  {isAuthenticated && user?.id !== Number(id) && canReview ? (
                    <div className="mb-4">
                      <h5 className="fw-bold mb-3">Deja tu valoración</h5>
                      <Form onSubmit={handleSubmitReview}>
                        {renderRatingSelector()}
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
                  ) : isAuthenticated && user?.id !== Number(id) && !canReview ? (
                    <div className="mb-4 p-3 bg-light rounded">
                      <p className="mb-0 text-center">Ya has valorado a este usuario anteriormente.</p>
                    </div>
                  ) : null}

                  <h5 className="fw-bold mb-3">Valoraciones recibidas</h5>

                  {reviews.length > 0 ? (
                    <div>
                      {reviews.map((review) => (
                        <div key={review.id} className="mb-3 pb-3 border-bottom">
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
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <Link to={`/perfil/${review.reviewer.id}`} className="fw-bold text-decoration-none">
                                  {review.reviewer.name}
                                </Link>
                                <div className="ms-2">{renderStars(review.rating)}</div>
                                <span className="text-muted ms-2 small">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="mb-0">{review.comment}</p>
                            </div>
                          </div>
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

