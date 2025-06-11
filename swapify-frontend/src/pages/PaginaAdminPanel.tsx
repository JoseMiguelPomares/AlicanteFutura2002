/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
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
  Tab,
  Tabs,
} from "react-bootstrap"
import { UserService } from "../services/userService"
import { ItemService } from "../services/itemService"
import { useAuth } from "../contexts/AuthContext"
import {
  ShieldCheck,
  PersonX,
  PersonCheck,
  ShieldLock,
  ArrowClockwise,
  People,
  Funnel,
  Search,
  Envelope,
  ShieldX,
  ExclamationTriangle,
  CheckCircle,
  ExclamationCircle,
  InfoCircle,
  Bell,
  Trash,
  Eye,
  Award,
} from "react-bootstrap-icons"

interface User {
  id: number
  imageUrl?: string
  name: string
  email: string
  banned: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  createdAt?: string
  lastLogin?: string
}

interface Product {
  id: number
  title: string
  description: string
  price: number
  imageUrl: string
  location: string
  user: {
    id: number
    name: string
    email: string
  }
  category: {
    id: number
    name: string
  }
  createdAt: string
  sold: boolean
}

interface ToastNotification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  show: boolean
}

export const PaginaAdminPanel: React.FC = () => {
  const { isSuperAdmin } = useAuth()

  // Estados para usuarios
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [userLoading, setUserLoading] = useState(true)
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [userFilterStatus, setUserFilterStatus] = useState<"all" | "active" | "banned" | "admin">("all")

  // Estados para productos
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [productLoading, setProductLoading] = useState(true)
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [productFilterStatus, setProductFilterStatus] = useState<"all" | "active" | "sold">("all")

  // Estados generales
  const [actionLoading, setActionLoading] = useState<{ userId: number | null; actionType: "ban" | "unban" | "makeAdmin" | "removeAdmin" | "deleteProduct" | null }>({ userId: null, actionType: null })
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: "ban" | "unban" | "makeAdmin" | "removeAdmin" | "deleteProduct"
    id: number
    name: string
  } | null>(null)
  const [toasts, setToasts] = useState<ToastNotification[]>([])
  const [activeTab, setActiveTab] = useState("users")

  const userService = new UserService()
  const itemService = new ItemService()

  useEffect(() => {
    loadUsers()
    loadProducts()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, userSearchTerm, userFilterStatus])

  useEffect(() => {
    filterProducts()
  }, [products, productSearchTerm, productFilterStatus])

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
      setUserLoading(true)
      const response = await userService.getAll()
      const sortedUsers = [...response].sort((a, b) => a.id - b.id)
      setUsers(sortedUsers)
      addToast("success", "Usuarios cargados correctamente", `Se cargaron ${sortedUsers.length} usuarios.`)
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
      addToast("error", "Error", "No se pudieron cargar los usuarios.")
    } finally {
      setUserLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      setProductLoading(true)
      const response = await itemService.getAll()
      setProducts(response)
      addToast("success", "Productos cargados correctamente", `Se cargaron ${response.length} productos.`)
    } catch (error) {
      console.error("Error al cargar productos:", error)
      addToast("error", "Error", "No se pudieron cargar los productos.")
    } finally {
      setProductLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (userSearchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearchTerm.toLowerCase()),
      )
    }

    switch (userFilterStatus) {
      case "active":
        filtered = filtered.filter((user) => !user.banned)
        break
      case "banned":
        filtered = filtered.filter((user) => user.banned)
        break
      case "admin":
        filtered = filtered.filter((user) => user.isAdmin || user.isSuperAdmin)
        break
    }

    setFilteredUsers(filtered)
  }

  const filterProducts = () => {
    let filtered = products

    if (productSearchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
          product.user.name.toLowerCase().includes(productSearchTerm.toLowerCase()),
      )
    }

    switch (productFilterStatus) {
      case "active":
        filtered = filtered.filter((product) => !product.sold)
        break
      case "sold":
        filtered = filtered.filter((product) => product.sold)
        break
    }

    setFilteredProducts(filtered)
  }

  const handleConfirmAction = (
    type: "ban" | "unban" | "makeAdmin" | "removeAdmin" | "deleteProduct",
    id: number,
    name: string,
  ) => {
    setConfirmAction({ type, id, name })
    setShowConfirmModal(true)
  }

  const executeAction = async () => {
    if (!confirmAction) return

    try {
      setActionLoading({ userId: confirmAction.id, actionType: confirmAction.type })
      setShowConfirmModal(false)

      switch (confirmAction.type) {
        case "ban":
        case "unban":
          await userService.toggleUserBan(confirmAction.id)
          addToast(
            "success",
            confirmAction.type === "ban" ? "Usuario baneado" : "Usuario desbaneado",
            `${confirmAction.name} ha sido ${confirmAction.type === "ban" ? "baneado" : "desbaneado"} correctamente.`,
          )
          await loadUsers()
          break

        case "makeAdmin":
        case "removeAdmin":
          await userService.toggleAdminStatus(confirmAction.id)
          addToast(
            "success",
            confirmAction.type === "makeAdmin" ? "Usuario promovido" : "Privilegios removidos",
            `${confirmAction.name} ${confirmAction.type === "makeAdmin" ? "ahora es administrador" : "ya no es administrador"}.`,
          )
          await loadUsers()
          break

        case "deleteProduct":
          await itemService.deleteItem(confirmAction.id)
          addToast(
            "success",
            "Producto eliminado",
            `El producto "${confirmAction.name}" ha sido eliminado correctamente.`,
          )
          await loadProducts()
          break
      }
    } catch (error) {
      console.error("Error al ejecutar acción:", error)
      addToast("error", "Error", "No se pudo completar la acción.")
    } finally {
      setActionLoading({ userId: null, actionType: null })
      setConfirmAction(null)
    }
  }

  const getUserStatusBadge = (user: User) => {
    if (user.isSuperAdmin) {
      return (
        <Badge bg="warning" className="d-flex align-items-center gap-1">
          <Award size={14} /> SuperAdmin
        </Badge>
      )
    }
    if (user.banned) {
      return (
        <Badge bg="danger" className="d-flex align-items-center gap-1">
          <PersonX size={14} /> Baneado
        </Badge>
      )
    }
    if (user.isAdmin) {
      return (
        <Badge bg="primary" className="d-flex align-items-center gap-1">
          <ShieldCheck size={14} /> Admin
        </Badge>
      )
    }
    return (
      <Badge bg="success" className="d-flex align-items-center gap-1">
        <PersonCheck size={14} /> Activo
      </Badge>
    )
  }

  const getProductStatusBadge = (product: Product) => {
    if (product.sold) {
      return <Badge bg="secondary">Vendido</Badge>
    }
    return <Badge bg="success">Disponible</Badge>
  }

  const getUserStats = () => {
    const total = users.length
    const active = users.filter((u) => !u.banned).length
    const banned = users.filter((u) => u.banned).length
    const admins = users.filter((u) => u.isAdmin || u.isSuperAdmin).length
    return { total, active, banned, admins }
  }

  const getProductStats = () => {
    const total = products.length
    const active = products.filter((p) => !p.sold).length
    const sold = products.filter((p) => p.sold).length
    return { total, active, sold }
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
        return <CheckCircle size={18} className="me-2" />
      case "error":
        return <ExclamationCircle size={18} className="me-2" />
      case "warning":
        return <ExclamationTriangle size={18} className="me-2" />
      case "info":
        return <InfoCircle size={18} className="me-2" />
      default:
        return <Bell size={18} className="me-2" />
    }
  }

  const getConfirmModalContent = () => {
    if (!confirmAction) return { title: "", body: "", variant: "primary" as const }

    switch (confirmAction.type) {
      case "ban":
        return {
          title: "Banear Usuario",
          body: `¿Estás seguro de que quieres banear a ${confirmAction.name}? Esta acción impedirá que el usuario acceda al sistema.`,
          variant: "danger" as const,
        }
      case "unban":
        return {
          title: "Desbanear Usuario",
          body: `¿Estás seguro de que quieres desbanear a ${confirmAction.name}?`,
          variant: "success" as const,
        }
      case "makeAdmin":
        return {
          title: "Otorgar Privilegios de Administrador",
          body: `¿Estás seguro de que quieres hacer administrador a ${confirmAction.name}? Esta acción otorgará acceso al panel de administración.`,
          variant: "warning" as const,
        }
      case "removeAdmin":
        return {
          title: "Remover Privilegios de Administrador",
          body: `¿Estás seguro de que quieres remover los privilegios de administrador de ${confirmAction.name}?`,
          variant: "warning" as const,
        }
      case "deleteProduct":
        return {
          title: "Eliminar Producto",
          body: `¿Estás seguro de que quieres eliminar el producto "${confirmAction.name}"? Esta acción no se puede deshacer.`,
          variant: "danger" as const,
        }
    }
  }

  if (userLoading && productLoading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h4>Cargando panel de administración...</h4>
        </div>
      </Container>
    )
  }

  const userStats = getUserStats()
  const productStats = getProductStats()
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
                  <ShieldLock size={32} className="me-2" />
                  Panel de Administración
                  {isSuperAdmin && <Award size={24} className="ms-2 text-warning" />}
                </h1>
                <p className="text-muted">
                  Gestiona usuarios, productos y permisos del sistema
                  {isSuperAdmin && <span className="text-warning fw-bold"> - SuperAdministrador</span>}
                </p>
              </div>
              <div className="d-flex gap-2">
                <Button variant="outline-primary" onClick={loadUsers} className="d-flex align-items-center gap-2">
                  <ArrowClockwise size={16} />
                  Usuarios
                </Button>
                <Button variant="outline-success" onClick={loadProducts} className="d-flex align-items-center gap-2">
                  <ArrowClockwise size={16} />
                  Productos
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Tabs */}
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || "users")} className="mb-4">
          {/* Tab de Usuarios */}
          <Tab eventKey="users" title={`Usuarios (${userStats.total})`}>
            {/* Stats Cards - Usuarios */}
            <Row className="mb-4">
              <Col md={3} className="mb-3">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                      <People size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Total Usuarios</h6>
                      <h3 className="mb-0">{userStats.total}</h3>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                      <PersonCheck size={24} className="text-success" />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Usuarios Activos</h6>
                      <h3 className="mb-0">{userStats.active}</h3>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle bg-danger bg-opacity-10 p-3 me-3">
                      <PersonX size={24} className="text-danger" />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Usuarios Baneados</h6>
                      <h3 className="mb-0">{userStats.banned}</h3>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                      <ShieldCheck size={24} className="text-warning" />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Administradores</h6>
                      <h3 className="mb-0">{userStats.admins}</h3>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Filters - Usuarios */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <Funnel size={20} className="me-2" />
                  Filtros de Usuarios
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={8} className="mb-3">
                    <InputGroup>
                      <InputGroup.Text>
                        <Search size={16} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button
                        variant={userFilterStatus === "all" ? "primary" : "outline-primary"}
                        size="sm"
                        onClick={() => setUserFilterStatus("all")}
                      >
                        Todos
                      </Button>
                      <Button
                        variant={userFilterStatus === "active" ? "success" : "outline-success"}
                        size="sm"
                        onClick={() => setUserFilterStatus("active")}
                      >
                        Activos
                      </Button>
                      <Button
                        variant={userFilterStatus === "banned" ? "danger" : "outline-danger"}
                        size="sm"
                        onClick={() => setUserFilterStatus("banned")}
                      >
                        Baneados
                      </Button>
                      <Button
                        variant={userFilterStatus === "admin" ? "warning" : "outline-warning"}
                        size="sm"
                        onClick={() => setUserFilterStatus("admin")}
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
              <Card.Header className="bg-light">
                <h5 className="mb-0">Lista de Usuarios ({filteredUsers.length})</h5>
              </Card.Header>
              <Card.Body className="p-0">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-5">
                    <People size={64} className="text-muted mb-3" />
                    <h4>No se encontraron usuarios</h4>
                    <p className="text-muted">
                      {userSearchTerm || userFilterStatus !== "all"
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
                                <Envelope size={16} className="me-2 text-muted" />
                                {user.email}
                              </div>
                            </td>
                            <td>{getUserStatusBadge(user)}</td>
                            <td>
                              {user.isSuperAdmin ? (
                                <Badge bg="warning">
                                  <Award size={14} className="me-1" />
                                  SuperAdministrador
                                </Badge>
                              ) : user.isAdmin ? (
                                <Badge bg="primary">
                                  <ShieldCheck size={14} className="me-1" />
                                  Administrador
                                </Badge>
                              ) : (
                                <Badge bg="secondary">Usuario</Badge>
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                {/* Solo mostrar botón de ban/unban si no es superadmin */}
                                {!user.isSuperAdmin && (
                                  <Button
                                    variant={user.banned ? "success" : "danger"}
                                    size="sm"
                                    disabled={actionLoading.userId === user.id}
                                    onClick={() => handleConfirmAction(user.banned ? "unban" : "ban", user.id, user.name)}
                                    className="d-flex align-items-center gap-1"
                                  >
                                    {actionLoading.userId === user.id && (actionLoading.actionType === "ban" || actionLoading.actionType === "unban") ? (
                                      <Spinner animation="border" size="sm" />
                                    ) : user.banned ? (
                                      <PersonCheck size={14} />
                                    ) : (
                                      <PersonX size={14} />
                                    )}
                                    {user.banned ? "Desbanear" : "Banear"}
                                  </Button>
                                )}

                                {/* Solo el superadmin puede hacer/quitar admins */}
                                {isSuperAdmin && !user.isSuperAdmin && (
                                  <Button
                                    variant={user.isAdmin ? "outline-warning" : "warning"}
                                    size="sm"
                                    disabled={actionLoading.userId === user.id}
                                    onClick={() =>
                                      handleConfirmAction(
                                        user.isAdmin ? "removeAdmin" : "makeAdmin",
                                        user.id,
                                        user.name,
                                      )
                                    }
                                    className="d-flex align-items-center gap-1"
                                  >
                                    {actionLoading.userId === user.id && (actionLoading.actionType === "makeAdmin" || actionLoading.actionType === "removeAdmin") ? (
                                      <Spinner animation="border" size="sm" />
                                    ) : user.isAdmin ? (
                                      <ShieldX size={14} />
                                    ) : (
                                      <ShieldCheck size={14} />
                                    )}
                                    {user.isAdmin ? "Quitar Admin" : "Hacer Admin"}
                                  </Button>
                                )}
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
          </Tab>

          {/* Tab de Productos */}
          <Tab eventKey="products" title={`Productos (${productStats.total})`}>
            {/* Stats Cards - Productos */}
            <Row className="mb-4">
              <Col md={4} className="mb-3">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                      <i className="bi bi-box fs-4 text-primary"></i>
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Total Productos</h6>
                      <h3 className="mb-0">{productStats.total}</h3>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                      <i className="bi bi-check-circle fs-4 text-success"></i>
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Disponibles</h6>
                      <h3 className="mb-0">{productStats.active}</h3>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle bg-secondary bg-opacity-10 p-3 me-3">
                      <i className="bi bi-archive fs-4 text-secondary"></i>
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Vendidos</h6>
                      <h3 className="mb-0">{productStats.sold}</h3>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Filters - Productos */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <Funnel size={20} className="me-2" />
                  Filtros de Productos
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={8} className="mb-3">
                    <InputGroup>
                      <InputGroup.Text>
                        <Search size={16} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Buscar por título o usuario..."
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button
                        variant={productFilterStatus === "all" ? "primary" : "outline-primary"}
                        size="sm"
                        onClick={() => setProductFilterStatus("all")}
                      >
                        Todos
                      </Button>
                      <Button
                        variant={productFilterStatus === "active" ? "success" : "outline-success"}
                        size="sm"
                        onClick={() => setProductFilterStatus("active")}
                      >
                        Disponibles
                      </Button>
                      <Button
                        variant={productFilterStatus === "sold" ? "secondary" : "outline-secondary"}
                        size="sm"
                        onClick={() => setProductFilterStatus("sold")}
                      >
                        Vendidos
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Products Table */}
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Lista de Productos ({filteredProducts.length})</h5>
              </Card.Header>
              <Card.Body className="p-0">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-box display-1 text-muted mb-3"></i>
                    <h4>No se encontraron productos</h4>
                    <p className="text-muted">
                      {productSearchTerm || productFilterStatus !== "all"
                        ? "Intenta ajustar los filtros de búsqueda"
                        : "No hay productos registrados en el sistema"}
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: "80px" }}>ID</th>
                          <th>Producto</th>
                          <th>Usuario</th>
                          <th>Precio</th>
                          <th>Categoría</th>
                          <th>Estado</th>
                          <th style={{ width: "150px" }}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr key={product.id}>
                            <td className="fw-bold">{product.id}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={product.imageUrl?.split("|")[0] || "/placeholder.svg"}
                                  alt={product.title}
                                  className="rounded me-2"
                                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                />
                                <div>
                                  <div className="fw-medium">{product.title}</div>
                                  <small className="text-muted">{product.location}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="fw-medium">{product.user.name}</div>
                              <small className="text-muted">{product.user.email}</small>
                            </td>
                            <td className="fw-bold">{product.price}€</td>
                            <td>
                              <Badge bg="info">{product.category.name}</Badge>
                            </td>
                            <td>{getProductStatusBadge(product)}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => window.open(`/items/${product.id}`, "_blank")}
                                  className="d-flex align-items-center gap-1"
                                >
                                  <Eye size={14} />
                                  Ver
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  disabled={actionLoading.userId === product.id}
                                  onClick={() => handleConfirmAction("deleteProduct", product.id, product.title)}
                                  className="d-flex align-items-center gap-1"
                                >
                                  {actionLoading.userId === product.id && actionLoading.actionType == "deleteProduct" ? (
                                    <Spinner animation="border" size="sm" />
                                  ) : (
                                    <Trash size={14} />
                                  )}
                                  Eliminar
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
          </Tab>
        </Tabs>

        {/* Confirmation Modal */}
        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <ExclamationTriangle size={20} className="me-2" />
              {modalContent.title}
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