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
  Circle,
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

// Interfaces para los tipos de datos
interface Message {
  id: number
  chatId: number
  senderId: number
  content: string
  timestamp: Date
  read: boolean
}

interface User {
  id?: number
  name?: string
  email?: string
  passwordHash?: string
  location?: string
  credits?: number
  reputation?: number
  createdAt?: Date
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
  createdAt: Date
}

interface Transaction {
  id: number
  item: Item
  requester: User
  owner: User
  status: string
  createdAt: Date
  completedAt: Date
  finalPrice: number
}

interface Chat {
  id: number
  requester: User
  owner: User
  transaction: Transaction
  createdAt: Date
  lastMessageAt: Date
}

// Servicio simulado para chats y mensajes
const chatServices = {
  getChats: async (userId: number): Promise<Chat[]> => {
    // Simulación de carga de datos
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return [
      {
        id: 1,
        transactionId: 101,
        lastMessage: "¿Todavía está disponible?",
        lastMessageTime: "2023-05-15T14:30:00",
        unreadCount: 2,
        otherUser: {
          id: 2,
          name: "María García",
          imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
          online: true,
        },
        item: {
          id: 201,
          title: "Bicicleta de montaña",
          imageUrl:
            "https://images.unsplash.com/photo-1575585269294-7d28dd912db8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJpY2ljbGV0YSUyMG1vbnRhJUMzJUIxYXxlbnwwfHwwfHx8MA%3D%3D",
          price: 150,
        },
        status: "pending",
      },
      {
        id: 2,
        transactionId: 102,
        lastMessage: "Podemos quedar mañana para el intercambio",
        lastMessageTime: "2023-05-14T10:15:00",
        unreadCount: 0,
        otherUser: {
          id: 3,
          name: "Carlos López",
          imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
          online: false,
        },
        item: {
          id: 202,
          title: "Libro de programación JavaScript",
          imageUrl:
            "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGlicm8lMjBqYXZhc2NyaXB0fGVufDB8fDB8fHwy",
          price: 25,
        },
        status: "accepted",
      },
      {
        id: 3,
        transactionId: 103,
        lastMessage: "No estoy interesado, gracias",
        lastMessageTime: "2023-05-10T18:45:00",
        unreadCount: 0,
        otherUser: {
          id: 4,
          name: "Ana Martínez",
          imageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
          online: false,
        },
        item: {
          id: 203,
          title: "Guitarra eléctrica",
          imageUrl:
            "https://images.unsplash.com/photo-1606041281659-3f2cec516ac0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmVuZGVyJTIwc3RyYXRvY2FzdGVyfGVufDB8fDB8fHwy",
          price: 200,
        },
        status: "rejected",
      },
    ]
  },

  getMessages: async (chatId: number): Promise<Message[]> => {
    // Simulación de carga de datos
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Generar mensajes de ejemplo para el chat seleccionado
    const messages: Message[] = []
    const isFirstChat = chatId === 1
    const isSecondChat = chatId === 2
    const isThirdChat = chatId === 3

    if (isFirstChat) {
      messages.push(
        {
          id: 1,
          chatId: 1,
          senderId: 2, // María
          content: "Hola, me interesa tu bicicleta de montaña. ¿Todavía está disponible?",
          timestamp: "2023-05-15T14:30:00",
          read: true,
        },
        {
          id: 2,
          chatId: 1,
          senderId: 1, // Usuario actual
          content: "¡Hola! Sí, todavía está disponible. Está en muy buen estado, apenas la he usado.",
          timestamp: "2023-05-15T14:35:00",
          read: true,
        },
        {
          id: 3,
          chatId: 1,
          senderId: 2,
          content: "¡Genial! ¿Podrías enviarme más fotos? Me gustaría ver los detalles.",
          timestamp: "2023-05-15T14:40:00",
          read: true,
        },
        {
          id: 4,
          chatId: 1,
          senderId: 1,
          content:
            "Claro, aquí tienes algunas fotos adicionales. Como puedes ver, los frenos y la transmisión están en perfecto estado.",
          timestamp: "2023-05-15T14:45:00",
          read: true,
        },
        {
          id: 5,
          chatId: 1,
          senderId: 2,
          content:
            "Se ve muy bien. ¿Estarías interesado en intercambiarla por una tablet Samsung Galaxy Tab S7? Está casi nueva y viene con funda y cargador.",
          timestamp: "2023-05-15T14:50:00",
          read: false,
        },
        {
          id: 6,
          chatId: 1,
          senderId: 2,
          content: "También podría añadir algunos créditos para compensar la diferencia de valor.",
          timestamp: "2023-05-15T14:51:00",
          read: false,
        },
      )
    } else if (isSecondChat) {
      messages.push(
        {
          id: 7,
          chatId: 2,
          senderId: 3, // Carlos
          content: "Hola, me interesa tu libro de JavaScript. ¿Podríamos hacer un intercambio?",
          timestamp: "2023-05-14T09:30:00",
          read: true,
        },
        {
          id: 8,
          chatId: 2,
          senderId: 1, // Usuario actual
          content: "Hola Carlos, claro que sí. ¿Qué ofrecerías a cambio?",
          timestamp: "2023-05-14T09:35:00",
          read: true,
        },
        {
          id: 9,
          chatId: 2,
          senderId: 3,
          content: "Tengo varios libros de programación en Python y un curso online que podría compartir contigo.",
          timestamp: "2023-05-14T09:40:00",
          read: true,
        },
        {
          id: 10,
          chatId: 2,
          senderId: 1,
          content: "Me interesa el libro de Python. ¿Podemos hacer un intercambio directo?",
          timestamp: "2023-05-14T09:45:00",
          read: true,
        },
        {
          id: 11,
          chatId: 2,
          senderId: 3,
          content:
            "¡Perfecto! Podemos quedar mañana para el intercambio. ¿Te parece bien en la biblioteca central a las 17:00?",
          timestamp: "2023-05-14T10:15:00",
          read: true,
        },
      )
    } else if (isThirdChat) {
      messages.push(
        {
          id: 12,
          chatId: 3,
          senderId: 4, // Ana
          content: "Hola, vi tu anuncio de la guitarra eléctrica. ¿Cuánto tiempo la has tenido?",
          timestamp: "2023-05-10T17:30:00",
          read: true,
        },
        {
          id: 13,
          chatId: 3,
          senderId: 1, // Usuario actual
          content: "Hola Ana, la compré hace unos 2 años, pero apenas la he usado. Está prácticamente nueva.",
          timestamp: "2023-05-10T17:35:00",
          read: true,
        },
        {
          id: 14,
          chatId: 3,
          senderId: 4,
          content: "¿Tiene algún rasguño o detalle a tener en cuenta?",
          timestamp: "2023-05-10T17:40:00",
          read: true,
        },
        {
          id: 15,
          chatId: 3,
          senderId: 1,
          content:
            "No, está en perfecto estado. Siempre ha estado guardada en su funda y en un ambiente seco. ¿Qué ofrecerías por ella?",
          timestamp: "2023-05-10T17:45:00",
          read: true,
        },
        {
          id: 16,
          chatId: 3,
          senderId: 4,
          content: "Estaba pensando en intercambiarla por un teclado MIDI y algunos créditos. ¿Te interesaría?",
          timestamp: "2023-05-10T18:00:00",
          read: true,
        },
        {
          id: 17,
          chatId: 3,
          senderId: 1,
          content:
            "Lo siento, pero estoy buscando más bien una tablet o un portátil. No me interesa mucho un teclado MIDI en este momento.",
          timestamp: "2023-05-10T18:30:00",
          read: true,
        },
        {
          id: 18,
          chatId: 3,
          senderId: 4,
          content: "No estoy interesado, gracias",
          timestamp: "2023-05-10T18:45:00",
          read: true,
        },
      )
    }

    return messages
  },

  sendMessage: async (chatId: number, senderId: number, content: string): Promise<Message> => {
    // Simulación de envío de mensaje
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      id: Math.floor(Math.random() * 1000) + 100,
      chatId,
      senderId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    }
  },

  markAsRead: async (chatId: number): Promise<void> => {
    // Simulación de marcar como leído
    await new Promise((resolve) => setTimeout(resolve, 300))
  },
}

export const PaginaChat = () => {
  const { 
    chatId, 
    transactionId, 
    buyerId, 
    sellerId 
  } = useParams<{
    chatId?: string;
    transactionId?: string;
    buyerId?: string;
    sellerId?: string;
  }>();
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
  const chatService = useRef(new ChatService()).current
  

  // Verificar autenticación
  useEffect(() => {
    if (!loading && !isAuthenticated) { // Ahora espera a que loading sea false antes de verificar isAuthenticated
      navigate("/login?redirect=/chat")
    }
    if (transactionId && buyerId && sellerId) {
      // Evito bucles—solo si no tengo ya un chatId en la URL
      if (!chatId) {
        (async () => {
          try {
            const newChatId = await chatService.getOrCreateChat(
              Number(transactionId),
              Number(buyerId),
              Number(sellerId)
            );
            // Reemplazamos la URL para cargar el chat “normal”
            navigate(`/chat/${newChatId.id}`, { replace: true });
          } catch (err) {
            console.error("No se pudo crear/recuperar chat:", err);
          }
        })();
      }
    }
  }, [isAuthenticated, loading, navigate])

  // Cargar chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return

      try {
        setLoadingChats(true)
        setError(null)
        const chatsData = await chatService.getChats(user.id)
        setChats(chatsData)

        // Si hay un chatId en la URL, seleccionar ese chat
        if (chatId) {
          const chat = chatsData.find((c) => c.id === Number.parseInt(chatId))
          if (chat) {
            setSelectedChat(chat)
          } else {
            // Si el chat no existe, redirigir a la página de chats
            navigate("/chat")
          }
        } else if (chatsData.length > 0) {
          // Si no hay chatId en la URL, seleccionar el primer chat
          setSelectedChat(chatsData[0])
        }
      } catch (error) {
        console.error("Error al cargar chats:", error)
        setError("No se pudieron cargar las conversaciones. Por favor, inténtalo de nuevo.")
      } finally {
        setLoadingChats(false)
      }
    }

    fetchChats()
  }, [user, chatId, navigate])

  // Cargar mensajes cuando se selecciona un chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return

      try {
        setLoadingMessages(true)
        const messagesData = await chatService.getMessages(selectedChat.id)
        setMessages(messagesData)

        // Marcar mensajes como leídos
        if (selectedChat.unreadCount > 0) {
          await chatService.markAsRead(selectedChat.id)

          // Actualizar el contador de mensajes no leídos
          setChats((prevChats) =>
            prevChats.map((chat) => (chat.id === selectedChat.id ? { ...chat, unreadCount: 0 } : chat)),
          )
        }
      } catch (error) {
        console.error("Error al cargar mensajes:", error)
      } finally {
        setLoadingMessages(false)
      }
    }

    fetchMessages()
  }, [selectedChat])

  // Scroll al último mensaje cuando se cargan nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Filtrar chats por término de búsqueda
  const filteredChats = chats.filter(
    (chat) =>
      chat.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Manejar envío de mensaje
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedChat || !user) return

    try {
      // Optimistic update
      const optimisticMessage: Message = {
        id: -1, // ID temporal
        chatId: selectedChat.id,
        senderId: user.id,
        content: newMessage,
        timestamp: new Date().toISOString(),
        read: false,
      }

      setMessages((prev) => [...prev, optimisticMessage])
      setNewMessage("")

      // Enviar mensaje al servidor
      const sentMessage = await chatService.sendMessage(selectedChat.id, user.id, newMessage)

      // Actualizar con el mensaje real
      setMessages((prev) => prev.map((msg) => (msg.id === -1 ? sentMessage : msg)))

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
      .sendMessage(selectedChat.id, user.id, offerMessage)
      .then((sentMessage) => {
        // Actualizar mensajes
        setMessages((prev) => [...prev, sentMessage])

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
    switch (status) {
      case "pending":
        return { text: "Pendiente", color: "warning", icon: <Clock className="me-1" /> }
      case "accepted":
        return { text: "Aceptado", color: "success", icon: <CheckCircle className="me-1" /> }
      case "rejected":
        return { text: "Rechazado", color: "danger", icon: <XCircle className="me-1" /> }
      case "completed":
        return { text: "Completado", color: "info", icon: <CheckCircleFill className="me-1" /> }
      default:
        return { text: "Desconocido", color: "secondary", icon: <InfoCircle className="me-1" /> }
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
                  >
                    <div className="d-flex">
                      <div className="position-relative me-3">
                        <Image
                          src={chat.otherUser.imageUrl || "/placeholder.svg?height=50&width=50"}
                          roundedCircle
                          width={50}
                          height={50}
                          className="object-fit-cover"
                        />
                        {chat.otherUser.online && (
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
                              {chat.item.title}
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
                    <Badge bg={getTransactionStatus(selectedChat.status).color} className="rounded-pill px-3 py-2">
                      {getTransactionStatus(selectedChat.status).icon}
                      {getTransactionStatus(selectedChat.status).text}
                    </Badge>
                  </div>
                </div>
              </Card.Header>

              {/* Información del producto */}
              <div className="bg-light p-3 border-bottom">
                <div className="d-flex align-items-center">
                  <Image
                    src={selectedChat.item.imageUrl || "/placeholder.svg?height=60&width=60"}
                    width={60}
                    height={60}
                    className="rounded me-3 object-fit-cover"
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">
                      <Link to={`/productos/${selectedChat.item.id}`} className="text-decoration-none">
                        {selectedChat.item.title}
                      </Link>
                    </h6>
                    <p className="mb-0 text-success fw-bold">{selectedChat.item.price} Créditos</p>
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
              <div
                className="chat-messages p-3 overflow-auto"
                style={{ height: showOfferForm ? "calc(75vh - 400px)" : "calc(100vh - 300px)" }}
              >
                {loadingMessages ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="success" />
                    <p className="mt-2">Cargando mensajes...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-5">
                    <ChatLeftText size={40} className="text-muted mb-3" />
                    <p className="text-muted">No hay mensajes en esta conversación.</p>
                    <p className="text-muted">¡Envía un mensaje para comenzar!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => {
                      const isCurrentUser = user && message.senderId === user.id

                      return (
                        <div
                          key={message.id}
                          className={`d-flex mb-3 ${isCurrentUser ? "justify-content-end" : "justify-content-start"}`}
                        >
                          {!isCurrentUser && (
                            <Image
                              src={selectedChat.otherUser.imageUrl || "/placeholder.svg?height=32&width=32"}
                              roundedCircle
                              width={32}
                              height={32}
                              className="me-2 align-self-end"
                            />
                          )}

                          <div
                            className={`message-bubble p-3 rounded-4 ${
                              isCurrentUser ? "bg-success text-white" : "bg-light border"
                            }`}
                            style={{ maxWidth: "75%" }}
                          >
                            <p className="mb-1">{message.content}</p>
                            <div className="d-flex justify-content-end align-items-center gap-1">
                              <small
                                className={isCurrentUser ? "text-white-50" : "text-muted"}
                                style={{ fontSize: "0.7rem" }}
                              >
                                {formatDate(message.timestamp)}
                              </small>

                              {isCurrentUser && (
                                <span>
                                  {message.read ? (
                                    <CheckCircleFill size={12} className="text-white-50" />
                                  ) : (
                                    <Circle size={12} className="text-white-50" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
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