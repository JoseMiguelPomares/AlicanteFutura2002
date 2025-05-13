"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Container, Row, Col, Card, Form, Button, Badge, Image, InputGroup, Spinner, Alert } from "react-bootstrap"
import { Link, useParams, useNavigate } from "react-router-dom"
import {
  Send,
  Search,
  ArrowLeft,
  CheckCircleFill,
  Clock,
  PersonCircle,
  ChatLeftText,
  InfoCircle,
  ArrowClockwise,
  XCircle,
  CheckCircle,
} from "react-bootstrap-icons"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import { ChatService } from "../services/chatService"
import { TransactionService } from "../services/transactionService"
import { UserService } from "../services/userService"
import { useNotifications } from "../contexts/NotificationContext"

// Interfaces para los tipos de datos
interface Message {
  id: number
  chat: Chat
  sender: User
  content: string
  createdAt: string
}

interface User {
  id?: number
  name?: string
  email?: string
  passwordHash?: string
  location?: string
  credits?: number
  reputation?: number
  createdAt?: string
  socialId?: string
  imageUrl?: string
  aboutMe?: string
}

interface Category {
  id: number
  name: string
}

interface Item {
  id: number
  user: User
  title: string
  description: string
  category: Category
  imageUrl: string
  price: number
  itemCondition: string
  location: string
  status: string
  createdAt: string
}

interface Transaction {
  id: number
  item: Item
  requester: User
  owner: User
  status: string
  createdAt: string
  completedAt: string
  finalPrice: number
}

interface Chat {
  id: number
  requester: User
  owner: User
  transaction: Transaction
  createdAt: string
  lastMessageAt: string
}

export const PaginaChat = () => {
  const { chatId } = useParams<{ chatId?: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated, loading } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loadingChats, setLoadingChats] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [offerDetails, setOfferDetails] = useState({
    itemName: "",
    itemDescription: "",
    credits: 0,
  })
  const { refreshNotifications } = useNotifications()

  // Servicios
  const chatService = new ChatService()
  const transactionService = new TransactionService()
  const userService = new UserService()

  // Verificar autenticación
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login?redirect=chat")
    }
  }, [isAuthenticated, loading, navigate])

  // Cargar transacciones y convertirlas en chats
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return

      try {
        setLoadingChats(true)
        setError(null)

        // Obtener todas las transacciones del usuario
        const transactions = await transactionService.getByUserId(user.id)

        // Convertir transacciones a formato de chat
        const chatPromises = transactions.map(async (transaction: any) => {
          // Determinar quién es el otro usuario (requester u owner)
          const isRequester = transaction.requester.id === user.id
          const otherUserId = isRequester ? transaction.owner.id : transaction.requester.id

          // Obtener información del otro usuario
          let otherUser
          try {
            const userResponse = await userService.getUserById(otherUserId)
            otherUser = userResponse.data
          } catch (error) {
            console.error(`Error al obtener usuario ${otherUserId}:`, error)
            otherUser = {
              id: otherUserId,
              name: isRequester ? "Vendedor" : "Comprador",
              imageUrl: undefined,
            }
          }

          // Obtener o crear el chat para esta transacción
          let chat
          try {
            chat = await chatService.getOrCreateChat(transaction.id, transaction.requester.id, transaction.owner.id)
          } catch (error) {
            console.error(`Error al obtener chat para transacción ${transaction.id}:`, error)
            return null
          }

          // Obtener mensajes para determinar el último mensaje
          let lastMessage = ""
          let lastMessageTime = ""
          try {
            const messagesResponse = await chatService.getMessages(chat.id)
            if (messagesResponse && messagesResponse.length > 0) {
              const lastMsg = messagesResponse[messagesResponse.length - 1]
              lastMessage = lastMsg.content || ""
              lastMessageTime = lastMsg.createdAt || ""
            }
          } catch (error) {
            console.error(`Error al obtener mensajes para chat ${chat.id}:`, error)
          }

          // Crear objeto de chat con formato adecuado
          return {
            id: chat.id,
            transaction: {
              id: transaction.id,
              status: transaction.status || "Pending",
              item: {
                id: transaction.item.id,
                title: transaction.item.title,
                imageUrl: transaction.item.imageUrl?.split("|")[0] || undefined,
                price: transaction.item.price || 0,
              },
            },
            owner: {
              id: otherUser.id,
              name: otherUser.name,
              imageUrl: otherUser.imageUrl,
              online: false, // No tenemos forma de saber si está online
            },
            lastMessage,
            lastMessageTime,
            unreadCount: 0, // No tenemos forma de saber cuántos mensajes no leídos hay
          }
        })

        // Esperar a que todas las promesas se resuelvan
        const chatResults = await Promise.all(chatPromises)
        const validChats = chatResults.filter((chat) => chat !== null) as Chat[]

        setChats(validChats)

        // Si hay un chatId en la URL, seleccionar ese chat
        if (chatId) {
          const chatIdNum = Number.parseInt(chatId)
          const chat = validChats.find((c) => c.id === chatIdNum)
          if (chat) {
            setSelectedChat(chat)
          } else {
            // Si el chat no existe, redirigir a la página de chats
            navigate("/chat")
          }
        } else if (validChats.length > 0) {
          // Si no hay chatId en la URL, seleccionar el primer chat
          setSelectedChat(validChats[0])
        }
      } catch (error) {
        console.error("Error al cargar transacciones:", error)
        setError("No se pudieron cargar las conversaciones. Por favor, inténtalo de nuevo.")
      } finally {
        setLoadingChats(false)
      }
    }

    fetchTransactions()
  }, [user, chatId, navigate])

  // Cargar mensajes cuando se selecciona un chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return

      try {
        setLoadingMessages(true)
        const messagesData = await chatService.getMessages(selectedChat.id)

        console.log("Mensajes recibidos:", messagesData) // Para depuración

        // Transformar los mensajes al formato esperado
        const formattedMessages = messagesData.map((msg: any) => {
          // Si el sender es null, usar información del chat
          const sender = msg.sender || {
            id: msg.senderId || (user?.id === selectedChat.owner.id
              ? selectedChat.owner.id
              : user?.id),
            name: msg.senderName || (user?.id === selectedChat.owner.id
              ? user?.name
              : selectedChat.owner.name),
            imageUrl: msg.senderImageUrl || (user?.id === selectedChat.owner.id
              ? user?.imageUrl
              : selectedChat.owner.imageUrl)
          };

          return {
            id: msg.id,
            sender: {
              id: sender.id,
              name: sender.name || 'Usuario desconocido',
              imageUrl: sender.imageUrl
            },
            content: msg.content,
            createdAt: msg.createdAt
          };
        });

        console.log("Mensajes formateados:", formattedMessages); // Para depuración
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error al cargar mensajes:", error);
        setError("No se pudieron cargar los mensajes. Por favor, inténtalo de nuevo.");
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();

    // Resto del código para marcar mensajes como leídos...
  }, [selectedChat, user, refreshNotifications]);

  // Scroll al último mensaje cuando se cargan nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      // Obtener el contenedor de mensajes (el elemento padre con overflow: auto)
      const messagesContainer = document.querySelector(".messages-container")
      if (messagesContainer) {
        // Hacer scroll al final del contenedor
        messagesContainer.scrollTop = messagesContainer.scrollHeight
      }
    }
  }, [messages])

  // Filtrar chats por término de búsqueda
  const filteredChats = chats.filter(
    (chat) =>
      chat.owner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.transaction.item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Manejar envío de mensaje
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedChat || !user) return

    try {
      // Optimistic update
      const optimisticMessage: Message = {
        id: -1, // ID temporal
        chat: selectedChat,
        sender: {
          id: user.id,
          name: user.name,
          imageUrl: user.imageUrl,
        },
        content: newMessage,
        createdAt: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, optimisticMessage])
      setNewMessage("")

      // Enviar mensaje al servidor
      const sentMessage = await chatService.postMessage(selectedChat.id, user.id, newMessage)

      // Transformar el mensaje recibido al formato esperado
      const formattedMessage = {
        id: sentMessage.id,
        chat: selectedChat,
        sender: {
          id: sentMessage.sender.id,
          name: sentMessage.sender.name,
          imageUrl: sentMessage.sender.imageUrl,
        },
        content: sentMessage.content,
        createdAt: sentMessage.createdAt,
      }

      // Actualizar con el mensaje real
      setMessages((prev) => prev.map((msg) => (msg.id === -1 ? formattedMessage : msg)))

      // Actualizar el último mensaje en la lista de chats
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChat.id
            ? {
              ...chat,
              lastMessage: newMessage,
              lastMessageTime: new Date().toISOString(),
            }
            : chat,
        ),
      )
    } catch (error) {
      console.error("Error al enviar mensaje:", error)
      // Revertir el mensaje optimista
      setMessages((prev) => prev.filter((msg) => msg.id !== -1))
      setError("No se pudo enviar el mensaje. Por favor, inténtalo de nuevo.")
    }
  }

  // Manejar selección de chat
  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat)
    navigate(`/chat/${chat.id}`)
  }

  // Manejar envío de oferta
  const handleSendOffer = () => {
    if (!selectedChat || !user) return

    const offerMessage = `Te propongo un intercambio: ${offerDetails.itemName}${offerDetails.itemDescription ? ` - ${offerDetails.itemDescription}` : ""}${offerDetails.credits > 0 ? ` + ${offerDetails.credits} créditos` : ""}`

    // Enviar mensaje con la oferta
    chatService
      .postMessage(selectedChat.id, user.id, offerMessage)
      .then((sentMessage) => {
        // Transformar el mensaje recibido al formato esperado
        const formattedMessage = {
          id: sentMessage.id,
          chat: selectedChat,
          sender: {
            id: sentMessage.sender.id,
            name: sentMessage.sender.name,
            imageUrl: sentMessage.sender.imageUrl,
          },
          content: sentMessage.content,
          createdAt: sentMessage.createdAt,
        }

        // Actualizar mensajes
        setMessages((prev) => [...prev, formattedMessage])

        // Actualizar el último mensaje en la lista de chats
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === selectedChat.id
              ? {
                ...chat,
                lastMessage: offerMessage,
                lastMessageTime: new Date().toISOString(),
              }
              : chat,
          ),
        )

        // Limpiar y ocultar formulario
        setOfferDetails({
          itemName: "",
          itemDescription: "",
          credits: 0,
        })
        setShowOfferForm(false)
      })
      .catch((error) => {
        console.error("Error al enviar oferta:", error)
        setError("No se pudo enviar la oferta. Por favor, inténtalo de nuevo.")
      })
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      // Hoy - mostrar hora
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 1) {
      // Ayer
      return "Ayer"
    } else if (diffDays < 7) {
      // Esta semana - mostrar día
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      // Más de una semana - mostrar fecha completa
      return date.toLocaleDateString()
    }
  }

  // Obtener estado de la transacción
  const getTransactionStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { text: "Pendiente", color: "warning", icon: <Clock className="me-1" /> }
      case "accepted":
        return { text: "Aceptado", color: "success", icon: <CheckCircle className="me-1" /> }
      case "rejected":
        return { text: "Rechazado", color: "danger", icon: <XCircle className="me-1" /> }
      case "completed":
        return { text: "Completado", color: "info", icon: <CheckCircleFill className="me-1" /> }
      default:
        return { text: status || "Desconocido", color: "secondary", icon: <InfoCircle className="me-1" /> }
    }
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Mensajes</h1>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Row>
        {/* Lista de chats */}
        <Col lg={4} className="mb-4 mb-lg-0">
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Header className="bg-white border-0 p-3">
              <InputGroup>
                <Form.Control
                  placeholder="Buscar conversaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary">
                  <Search />
                </Button>
              </InputGroup>
            </Card.Header>

            <div className="chat-list overflow-auto" style={{ height: "calc(75vh - 120px)" }}>
              {loadingChats ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="success" />
                  <p className="mt-2">Cargando conversaciones...</p>
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="text-center py-5">
                  <ChatLeftText size={40} className="text-muted mb-3" />
                  <p className="text-muted">
                    {searchTerm
                      ? "No se encontraron conversaciones que coincidan con tu búsqueda."
                      : "No tienes conversaciones activas."}
                  </p>
                  <Button as={Link as any} to="/" variant="success" className="mt-2 rounded-pill">
                    Explorar productos
                  </Button>
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    whileHover={{ backgroundColor: "#f8f9fa" }}
                    className={`chat-item p-3 border-bottom cursor-pointer ${selectedChat?.id === chat.id ? "bg-light" : ""}`}
                    onClick={() => handleSelectChat(chat)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex">
                      <div className="position-relative me-3">
                        <Image
                          src={chat.owner.imageUrl || "/placeholder.svg?height=50&width=50"}
                          roundedCircle
                          width={50}
                          height={50}
                          className="object-fit-cover"
                        />
                        {chat.owner.online && (
                          <div
                            className="position-absolute bottom-0 end-0 bg-success rounded-circle p-1"
                            style={{ width: "12px", height: "12px", border: "2px solid white" }}
                          ></div>
                        )}
                      </div>

                      <div className="flex-grow-1 min-width-0">
                        <div className="d-flex justify-content-between align-items-start">
                          <h6 className="mb-0 text-truncate">{chat.otherUser.name}</h6>
                          <small className="text-muted ms-2">
                            {chat.lastMessageTime && formatDate(chat.lastMessageTime)}
                          </small>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <p className="text-muted small mb-0 text-truncate">
                            {chat.lastMessage || "Inicia una conversación"}
                          </p>
                          {chat.unreadCount > 0 && (
                            <Badge bg="success" pill className="ms-2">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>

                        <div className="mt-1">
                          <small className="text-truncate d-block">
                            <Badge bg="light" text="dark" className="border">
                              {chat.transaction.item.title}
                            </Badge>
                          </small>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </Col>

        {/* Ventana de chat */}
        <Col lg={8}>
          {selectedChat ? (
            <Card className="border-0 shadow-sm rounded-4 h-100">
              {/* Cabecera del chat */}
              <Card.Header className="bg-white p-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Button variant="link" className="d-lg-none me-2 p-0 text-dark" onClick={() => navigate("/chat")}>
                      <ArrowLeft size={20} />
                    </Button>

                    <div className="position-relative me-3">
                      <Image
                        src={selectedChat.otherUser.imageUrl || "/placeholder.svg?height=40&width=40"}
                        roundedCircle
                        width={40}
                        height={40}
                        className="object-fit-cover"
                      />
                      {selectedChat.otherUser.online && (
                        <div
                          className="position-absolute bottom-0 end-0 bg-success rounded-circle p-1"
                          style={{ width: "10px", height: "10px", border: "2px solid white" }}
                        ></div>
                      )}
                    </div>

                    <div>
                      <h6 className="mb-0">
                        <Link to={`/perfil/${selectedChat.otherUser.id}`} className="text-decoration-none text-dark">
                          {selectedChat.otherUser.name}
                        </Link>
                      </h6>
                      <small className="text-muted">
                        {selectedChat.otherUser.online ? "En línea" : "Desconectado"}
                      </small>
                    </div>
                  </div>

                  <div>
                    {/* Estado de la transacción */}
                    <Badge
                      bg={getTransactionStatus(selectedChat.transaction.status).color}
                      className="rounded-pill px-3 py-2"
                    >
                      {getTransactionStatus(selectedChat.transaction.status).icon}
                      {getTransactionStatus(selectedChat.transaction.status).text}
                    </Badge>
                  </div>
                </div>
              </Card.Header>

              {/* Información del producto */}
              <div className="bg-light p-3 border-bottom">
                <div className="d-flex align-items-center">
                  <Image
                    src={selectedChat.transaction.item.imageUrl || "/placeholder.svg?height=60&width=60"}
                    width={60}
                    height={60}
                    className="rounded me-3 object-fit-cover"
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">
                      <Link to={`/items/${selectedChat.transaction.item.id}`} className="text-decoration-none">
                        {selectedChat.transaction.item.title}
                      </Link>
                    </h6>
                    <p className="mb-0 text-success fw-bold">{selectedChat.transaction.item.price} Créditos</p>
                  </div>
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="rounded-pill"
                    onClick={() => setShowOfferForm(!showOfferForm)}
                  >
                    <ArrowClockwise className="me-1" />
                    Proponer intercambio
                  </Button>
                </div>

                {/* Formulario de oferta */}
                {showOfferForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-3 border rounded bg-white"
                  >
                    <h6 className="mb-3">Proponer intercambio</h6>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Producto que ofreces</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nombre del producto"
                          value={offerDetails.itemName}
                          onChange={(e) => setOfferDetails({ ...offerDetails, itemName: e.target.value })}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Descripción (opcional)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Añade detalles sobre el producto"
                          value={offerDetails.itemDescription}
                          onChange={(e) => setOfferDetails({ ...offerDetails, itemDescription: e.target.value })}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Créditos adicionales</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          placeholder="0"
                          value={offerDetails.credits}
                          onChange={(e) =>
                            setOfferDetails({ ...offerDetails, credits: Number.parseInt(e.target.value) || 0 })
                          }
                        />
                      </Form.Group>

                      <div className="d-flex gap-2">
                        <Button
                          variant="success"
                          className="rounded-pill"
                          onClick={handleSendOffer}
                          disabled={!offerDetails.itemName}
                        >
                          Enviar oferta
                        </Button>
                        <Button
                          variant="outline-secondary"
                          className="rounded-pill"
                          onClick={() => setShowOfferForm(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </Form>
                  </motion.div>
                )}
              </div>

              {/* Mensajes */}
              <div className="messages-container overflow-auto p-3" style={{ height: "calc(75vh - 240px)" }}>
                {loadingMessages ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="success" />
                    <p className="mt-2">Cargando mensajes...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-5">
                    <ChatLeftText size={40} className="text-muted mb-3" />
                    <p className="text-muted">No hay mensajes en esta conversación.</p>
                    <p className="text-muted small">Envía un mensaje para comenzar a chatear.</p>
                  </div>
                ) : (
                  // Ordenar los mensajes por fecha (más antiguos primero)
                  [...messages]
                    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`d-flex mb-3 ${message.sender.id === user?.id ? "justify-content-end" : ""}`}
                      >
                        {message.sender.id !== user?.id && (
                          <Image
                            src={message.sender.imageUrl || "/placeholder.svg?height=36&width=36"}
                            roundedCircle
                            width={36}
                            height={36}
                            className="me-2 mt-1 object-fit-cover"
                          />
                        )}

                        <div
                          className={`message p-3 rounded-3 ${message.sender.id === user?.id ? "bg-success text-white" : "bg-light"
                            }`}
                          style={{ maxWidth: "75%", minWidth: "120px" }}
                        >
                          <div className="message-content">{message.content}</div>
                          <div
                            className={`message-time mt-1 text-end small ${message.sender.id === user?.id ? "text-white-50" : "text-muted"
                              }`}
                          >
                            {formatDate(message.createdAt)}
                          </div>
                        </div>

                        {message.sender.id === user?.id && (
                          <Image
                            src={message.sender.imageUrl || "/placeholder.svg?height=36&width=36"}
                            roundedCircle
                            width={36}
                            height={36}
                            className="ms-2 mt-1 object-fit-cover"
                          />
                        )}
                      </div>
                    ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Formulario de envío de mensajes */}
              <Card.Footer className="bg-white p-3 border-top">
                <Form onSubmit={handleSendMessage}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Escribe un mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={loadingMessages}
                    />
                    <Button variant="success" type="submit" disabled={!newMessage.trim() || loadingMessages}>
                      <Send />
                    </Button>
                  </InputGroup>
                </Form>
              </Card.Footer>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm rounded-4 h-100 d-flex justify-content-center align-items-center">
              <div className="text-center p-5">
                <PersonCircle size={60} className="text-muted mb-3" />
                <h4>Selecciona una conversación</h4>
                <p className="text-muted">Elige una conversación de la lista para ver los mensajes.</p>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default PaginaChat