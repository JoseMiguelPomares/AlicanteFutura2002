"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  Table,
  Modal,
  Alert,
  Spinner,
  InputGroup,
  Toast,
  ToastContainer,
} from "react-bootstrap"
import { UserService } from "../services/userService"
import { ShieldCheck, PersonX, PersonCheck, ShieldLock, ArrowClockwise, People, Funnel, Search, Envelope, ShieldX, ExclamationTriangle, CheckCircle, ExclamationCircle, InfoCircle, Bell } from "react-bootstrap-icons"

interface User {
  id: number
  imageUrl?: string
  name: string
  email: string
  banned: boolean
  isAdmin: boolean
  createdAt?: string
  lastLogin?: string
}

interface ToastNotification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  show: boolean
}

export const PaginaAdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "banned" | "admin">("all")
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: "ban" | "unban" | "makeAdmin" | "removeAdmin"
    userId: number
    userName: string
  } | null>(null)
  const [toasts, setToasts] = useState<ToastNotification[]>([])

  const userService = new UserService()

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, filterStatus])

  const addToast = (type: "success" | "error" | "warning" | "info", title: string, message: string) => {
    const id = Date.now().toString()
    const newToast: ToastNotification = {
      id,
      type,
      title,
      message,
      show: true,
    }

    setToasts((prevToasts) => [...prevToasts, newToast])

    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      hideToast(id)
    }, 5000)
  }

  const hideToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await userService.getAll()
      const sortedUsers = [...response].sort((a, b) => a.id - b.id)
      setUsers(sortedUsers)
      addToast("success", "Usuarios cargados correctamente", `Se cargaron ${sortedUsers.length} usuarios.`)
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
      addToast("error", "Error", "No se pudieron cargar los usuarios.")
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por estado
    switch (filterStatus) {
      case "active":
        filtered = filtered.filter((user) => !user.banned)
        break
      case "banned":
        filtered = filtered.filter((user) => user.banned)
        break
      case "admin":
        filtered = filtered.filter((user) => user.isAdmin)
        break
    }

    setFilteredUsers(filtered)
  }

  const handleConfirmAction = (
    type: "ban" | "unban" | "makeAdmin" | "removeAdmin",
    userId: number,
    userName: string,
  ) => {
    setConfirmAction({ type, userId, userName })
    setShowConfirmModal(true)
  }

  const executeAction = async () => {
    if (!confirmAction) return

    try {
      setActionLoading(confirmAction.userId)
      setShowConfirmModal(false)

      if (confirmAction.type === "ban" || confirmAction.type === "unban") {
        await userService.toggleUserBan(confirmAction.userId)
        addToast(
          "success",
          confirmAction.type === "ban" ? "Usuario baneado" : "Usuario desbaneado",
          `${confirmAction.userName} ha sido ${confirmAction.type === "ban" ? "baneado" : "desbaneado"} correctamente.`,
        )
      } else {
        await userService.toggleAdminStatus(confirmAction.userId)
        addToast(
          "success",
          confirmAction.type === "makeAdmin" ? "Usuario promovido" : "Privilegios removidos",
          `${confirmAction.userName} ${confirmAction.type === "makeAdmin" ? "ahora es administrador" : "ya no es administrador"}.`,
        )
      }

      await loadUsers()
    } catch (error) {
      console.error("Error al ejecutar acción:", error)
      addToast("error", "Error", "No se pudo completar la acción.")
    } finally {
      setActionLoading(null)
      setConfirmAction(null)
    }
  }

  const getStatusBadge = (user: User) => {
    if (user.banned) {
      return (
        <Badge bg="danger" className="d-flex align-items-center gap-1">
          <PersonX size={24} className="me-2" /> Baneado
        </Badge>
      )
    }
    if (user.isAdmin) {
      return (
        <Badge bg="primary" className="d-flex align-items-center gap-1">
          <ShieldCheck size={24} className="me-2" /> Admin
        </Badge>
      )
    }
    return (
      <Badge bg="success" className="d-flex align-items-center gap-1">
        <PersonX size={24} className="me-2" /> Activo
      </Badge>
    )
  }

  const getUserStats = () => {
    const total = users.length
    const active = users.filter((u) => !u.banned).length
    const banned = users.filter((u) => u.banned).length
    const admins = users.filter((u) => u.isAdmin).length
    return { total, active, banned, admins }
  }

  const getToastVariant = (type: string) => {
    switch (type) {
      case "success":
        return "success"
      case "error":
        return "danger"
      case "warning":
        return "warning"
      case "info":
        return "info"
      default:
        return "primary"
    }
  }

  const getToastIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={18} className="me-2" />;
      case "error":
        return <ExclamationCircle size={18} className="me-2" />;
      case "warning":
        return <ExclamationTriangle size={18} className="me-2" />;
      case "info":
        return <InfoCircle size={18} className="me-2" />;
      default:
        return <Bell size={18} className="me-2" />;
    }
  };

  const stats = getUserStats()

  const getConfirmModalContent = () => {
    if (!confirmAction) return { title: "", body: "", variant: "primary" as const }

    switch (confirmAction.type) {
      case "ban":
        return {
          title: "Banear Usuario",
          body: `¿Estás seguro de que quieres banear a ${confirmAction.userName}? Esta acción impedirá que el usuario acceda al sistema.`,
          variant: "danger" as const,
        }
      case "unban":
        return {
          title: "Desbanear Usuario",
          body: `¿Estás seguro de que quieres desbanear a ${confirmAction.userName}?`,
          variant: "success" as const,
        }
      case "makeAdmin":
        return {
          title: "Otorgar Privilegios de Administrador",
          body: `¿Estás seguro de que quieres hacer administrador a ${confirmAction.userName}? Esta acción otorgará acceso completo al panel de administración.`,
          variant: "warning" as const,
        }
      case "removeAdmin":
        return {
          title: "Remover Privilegios de Administrador",
          body: `¿Estás seguro de que quieres remover los privilegios de administrador de ${confirmAction.userName}?`,
          variant: "warning" as const,
        }
    }
  }

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h4>Cargando usuarios...</h4>
        </div>
      </Container>
    )
  }

  const modalContent = getConfirmModalContent()

  return (
    <>
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-6 mb-1">
                  <ShieldLock size={24} className="me-2" />
                  Panel de Administración
                </h1>
                <p className="text-muted">Gestiona usuarios y permisos del sistema</p>
              </div>
              <Button variant="outline-primary" onClick={loadUsers} className="d-flex align-items-center gap-2">
                <ArrowClockwise size={24} />                Actualizar
              </Button>
            </div>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                  <People size={32} className="text-primary" />                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Usuarios</h6>
                  <h3 className="mb-0">{stats.total}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                  <PersonX size={24} className="fs-4 text-success" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Usuarios Activos</h6>
                  <h3 className="mb-0">{stats.active}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-danger bg-opacity-10 p-3 me-3">
                  <PersonX size={24} className="fs-4 text-danger" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Usuarios Baneados</h6>
                  <h3 className="mb-0">{stats.banned}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                  <ShieldCheck size={32} className="text-warning" />                </div>
                <div>
                  <h6 className="text-muted mb-1">Administradores</h6>
                  <h3 className="mb-0">{stats.admins}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-light">
            <h5 className="mb-0">
              <Funnel size={24} className="me-2" />              Filtros y Búsqueda
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={8} className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <Search size={24} />                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <div className="d-flex gap-2 flex-wrap">
                  <Button
                    variant={filterStatus === "all" ? "primary" : "outline-primary"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filterStatus === "active" ? "success" : "outline-success"}
                    size="sm"
                    onClick={() => setFilterStatus("active")}
                  >
                    Activos
                  </Button>
                  <Button
                    variant={filterStatus === "banned" ? "danger" : "outline-danger"}
                    size="sm"
                    onClick={() => setFilterStatus("banned")}
                  >
                    Baneados
                  </Button>
                  <Button
                    variant={filterStatus === "admin" ? "warning" : "outline-warning"}
                    size="sm"
                    onClick={() => setFilterStatus("admin")}
                  >
                    Admins
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Lista de Usuarios ({filteredUsers.length})</h5>
          </Card.Header>
          <Card.Body className="p-0">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-5">
                <People size={64} className="text-muted mb-3" />                <h4>No se encontraron usuarios</h4>
                <p className="text-muted">
                  {searchTerm || filterStatus !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "No hay usuarios registrados en el sistema"}
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "80px" }}>ID</th>
                      <th>Usuario</th>
                      <th>Email</th>
                      <th>Estado</th>
                      <th>Rol</th>
                      <th style={{ width: "200px" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="fw-bold">{user.id}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {user?.imageUrl ? (
                              <img
                                src={user.imageUrl || "/placeholder.svg"}
                                alt={user.name}
                                className="rounded-circle me-2"
                                style={{ width: "32px", height: "32px" }}
                              />
                            ) : (
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  background: "linear-gradient(45deg, #007bff, #6f42c1)",
                                  fontSize: "14px",
                                }}
                              >
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="fw-medium">{user.name}</span>
                          </div>

                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Envelope size={24} className="me-2 text-muted" />                            {user.email}
                          </div>
                        </td>
                        <td>{getStatusBadge(user)}</td>
                        <td>
                          {user.isAdmin ? (
                            <Badge bg="primary">
                              <ShieldCheck size={24} className="me-1" />                              Administrador
                            </Badge>
                          ) : (
                            <Badge bg="secondary">Usuario</Badge>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant={user.banned ? "success" : "danger"}
                              size="sm"
                              disabled={actionLoading === user.id}
                              onClick={() => handleConfirmAction(user.banned ? "unban" : "ban", user.id, user.name)}
                              className="d-flex align-items-center gap-1"
                            >
                              {actionLoading === user.id ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                user.banned ? <PersonCheck size={18} /> : <PersonX size={18} />)}
                              {user.banned ? "Desbanear" : "Banear"}
                            </Button>

                            <Button
                              variant={user.isAdmin ? "outline-warning" : "warning"}
                              size="sm"
                              disabled={actionLoading === user.id}
                              onClick={() =>
                                handleConfirmAction(user.isAdmin ? "removeAdmin" : "makeAdmin", user.id, user.name)
                              }
                              className="d-flex align-items-center gap-1"
                            >
                              {actionLoading === user.id ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                user.isAdmin ? <ShieldX size={18} /> : <ShieldCheck size={18} />)}
                              {user.isAdmin ? "Quitar Admin" : "Hacer Admin"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Confirmation Modal */}
        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <ExclamationTriangle size={24} className="me-2" />              {modalContent.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant={modalContent.variant} className="mb-0">
              {modalContent.body}
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
              Cancelar
            </Button>
            <Button variant={modalContent.variant} onClick={executeAction}>
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050 }}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            show={toast.show}
            onClose={() => hideToast(toast.id)}
            bg={getToastVariant(toast.type)}
            className="text-white"
          >
            <Toast.Header className="text-dark">
              {getToastIcon(toast.type)}
              <strong className="me-auto">{toast.title}</strong>
            </Toast.Header>
            <Toast.Body>{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </>
  )
}