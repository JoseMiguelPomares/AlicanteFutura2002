"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab, ListGroup, Image } from "react-bootstrap"
import { CheckCircle, GeoAlt, Calendar3 } from "react-bootstrap-icons"
import { ItemService } from "../services/itemService"
import { UserService } from "../services/userService"

// Actualizar la interfaz User para incluir el campo reputation
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

export const PaginaPerfil = () => {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [userItems, setUserItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const itemService = new ItemService()
  const userService = new UserService()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)

        // Obtener datos del usuario desde la API
        const response = await userService.getById(Number(id))
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

  if (error || !user) {
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
                  src={user.imageUrl || "/placeholder.svg"}
                  roundedCircle
                  className="shadow-sm"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                {user.verified && (
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
              <h3 className="fw-bold mb-1">{user.name}</h3>
              {user.reputation !== undefined && (
                <div className="d-flex justify-content-center align-items-center mb-2">
                  <Badge bg="info" className="rounded-pill px-3 py-2">
                    <span className="fw-bold">Reputación: {user.reputation.toFixed(1)}</span>
                  </Badge>
                </div>
              )}


              {user.location && (
                <p className="text-muted mb-3">
                  <GeoAlt className="me-1" />
                  {user.location}
                </p>
              )}

              <div className="d-grid gap-2">
                <Button variant="success" className="rounded-pill">
                  Contactar
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm rounded-4 mt-4">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-3">Información</h4>
              <ListGroup variant="flush">
                {user.joinDate && (
                  <ListGroup.Item className="px-0 py-2 d-flex justify-content-between border-bottom">
                    <span className="text-muted">Miembro desde</span>
                    <span className="fw-medium">
                      <Calendar3 className="me-1" />
                      {new Date(user.joinDate).toLocaleDateString()}
                    </span>
                  </ListGroup.Item>
                )}
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between border-bottom">
                  <span className="text-muted">Productos</span>
                  <span className="fw-medium">{userItems.length}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Valoraciones</span>
                  <span className="fw-medium">0</span>
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
                    <p className="text-muted mb-0">Este usuario aún no ha publicado productos.</p>
                  </Card.Body>
                </Card>
              )}
            </Tab>

            <Tab eventKey="sobre" title="Sobre mí">
              <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  {user.description ? (
                    <p className="mb-0">{user.description}</p>
                  ) : (
                    <p className="text-muted text-center mb-0">Este usuario aún no ha añadido una descripción.</p>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="valoraciones" title="Valoraciones">
              <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <p className="text-muted text-center mb-0">
                    Las valoraciones de usuarios estarán disponibles próximamente.
                  </p>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  )
}

