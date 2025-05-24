"use client"
  ; (window as any).global = window

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
import { ItemService } from "../services/itemService";
const API_URL = import.meta.env.VITE_API_BASE_URL


let stompClient: any = null

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
  online?: boolean
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
  unreadCount: number
  lastMessage?: string
  lastMessageTime?: string
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
    credits: ""
  })
  const [userProducts, setUserProducts] = useState<Item[]>([])

  // Servicios
  const chatService = new ChatService()
  const transactionService = new TransactionService()
  const userService = new UserService()
  const itemService = new ItemService()

  // 1) Auth: espera a que termine la comprobación antes de redirigir
  useEffect(() => {
    if (loading) return
    if (!isAuthenticated) {
      navigate("/login?redirect=chat")
    }
  }, [loading, isAuthenticated, navigate])


  // 2) Carga tus chats / transacciones y fija el primer selectedChat
  useEffect(() => {
    if (!user) return

    const fetchChats = async () => {
      setLoadingChats(true)
      setError(null)

      try {
        const transactions: any[] = await transactionService.getByUserId(user.id)

        // mapea cada transacción a tu objeto Chat
        const chatsData: Chat[] = await Promise.all(
          transactions.map(async (tx: any) => {
            const isRequester = tx.requester.id === user.id
            const otherUserId = isRequester ? tx.owner.id : tx.requester.id

            // obtén datos del otro usuario
            let otherUser: User
            try {
              const { data } = await userService.getUserById(otherUserId)
              otherUser = data
            } catch {
              otherUser = { id: otherUserId, name: isRequester ? "Vendedor" : "Comprador" }
            }

            // crea o recupera el chat
            const chat = await chatService
              .getOrCreateChat(tx.id, tx.requester.id, tx.owner.id)

            // últimos mensajes
            const msgs = await chatService.getMessages(chat.id)
            const last = msgs.length ? msgs[msgs.length - 1] : null

            return {
              id: chat.id,
              requester: chat.requester,
              owner: otherUser,
              transaction: {
                id: tx.id,
                item: {
                  id: tx.item.id,
                  user: tx.item.user,
                  title: tx.item.title,
                  description: tx.item.description,
                  category: tx.item.category,
                  imageUrl: tx.item.imageUrl,
                  price: tx.item.price,
                  itemCondition: tx.item.itemCondition,
                  location: tx.item.location,
                  status: tx.item.status,
                  createdAt: tx.item.createdAt,
                },
                requester: tx.requester,
                owner: tx.owner,
                status: tx.status,
                createdAt: tx.createdAt,
                completedAt: tx.completedAt,
                finalPrice: tx.finalPrice,
              },
              createdAt: chat.createdAt,
              lastMessageAt: last ? last.createdAt : "",
              lastMessage: last ? last.content : "",
              unreadCount: 0,
            }
          })
        )

        // filtramos sólo los válidos (no hay nulls)
        const validChats: Chat[] = chatsData.filter((c: Chat) => !!c)

        setChats(validChats)

        // selecciona por URL o el primero
        if (chatId) {
          const idNum = Number(chatId)
          const found = validChats.find((c: Chat) => c.id === idNum)
          if (found) setSelectedChat(found)
          else navigate("/chat")
        } else if (validChats.length) {
          setSelectedChat(validChats[0])
        }
      } catch (err) {
        console.error(err)
        setError("No se pudieron cargar las conversaciones.")
      } finally {
        setLoadingChats(false)
      }
    }

    fetchChats()
  }, [user, chatId, navigate])


  // 3) Carga el histórico de mensajes cuando cambie selectedChat
  const [messagesLoaded, setMessagesLoaded] = useState(false)

  useEffect(() => {
    if (!selectedChat) return

    setMessagesLoaded(false)
    setLoadingMessages(true)

    const fetchMessages = async () => {
      try {
        const raw: any[] = await chatService.getMessages(selectedChat.id)
        const formatted = raw.map((m: any) => ({
          id: m.id,
          chat: selectedChat,
          sender: {
            id: m.sender.id,
            name: m.sender.name,
            imageUrl: m.sender.imageUrl,
          },
          content: m.content,
          createdAt: m.createdAt,
        }))
        setMessages(formatted)
        setMessagesLoaded(true)
      } catch (err) {
        console.error(err)
        setError("No se pudieron cargar los mensajes.")
      } finally {
        setLoadingMessages(false)
      }
    }

    fetchMessages()
  }, [selectedChat])


  // 4) Sólo cuando selectedChat y messagesLoaded, arranca STOMP
  useEffect(() => {
    if (!selectedChat || !messagesLoaded) return

      // 1) Define global aquí de forma forzada
      ; (window as any).global = window

    // 2) Carga SockJS y StompJS *dinámicamente*
    Promise.all([
      import("sockjs-client"),
      import("@stomp/stompjs")
    ])
      .then(([SockJSmod, StompMod]) => {
        const SockJS = (SockJSmod as any).default
        const { Client } = StompMod as any

        // 3) Ahora sí, crea tu cliente STOMP
        stompClient = new Client({
          // en vez de pasar simplemente `new SockJS(url)`, 
          // damos el tercer parámetro con { withCredentials: false }
          webSocketFactory: () =>
            new SockJS(API_URL + "/ws-chat", undefined, {
              withCredentials: false,
            }),
          reconnectDelay: 5000,
          debug: (msg: string) => console.log("STOMP:", msg),
          onStompError: (frame: any) => console.error("STOMP ERR:", frame.body),
        })

        stompClient.onConnect = () => {
          console.log("STOMP conectado en room", selectedChat.id)
          stompClient.subscribe(
            `/topic/chat/${selectedChat.id}`,
            (frame: any) => {
              const newMsg: Message = JSON.parse(frame.body)
              setMessages((prev) => [...prev, newMsg])
            }
          )
        }

        stompClient.activate()
      })
      .catch((err) => {
        console.error("Error cargando SockJS/STOMP:", err)
        setError("No se pudo inicializar el chat en tiempo real.")
      })

    return () => {
      stompClient?.deactivate()
      stompClient = null
      setMessagesLoaded(false)
    }
  }, [selectedChat, messagesLoaded])


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

  // Filtrar chats por término de búsqueda y ordenar por fecha del último mensaje (más recientes primero)
  const filteredChats = chats
    .filter(
      (chat) =>
        chat.owner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.transaction.item.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      // Si no hay fecha de último mensaje, colocar al final
      if (!a.lastMessageAt) return 1;
      if (!b.lastMessageAt) return -1;
      // Ordenar de más reciente a más antiguo
      return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
    });

  // Manejar envío de mensaje
  {/* const handleSendMessage = async (e: React.FormEvent) => {
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
  } */}

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !user || !stompClient) return;

    const dto = { senderId: user.id, content: newMessage };
    stompClient.publish({
      destination: `/app/chat/${selectedChat.id}`,
      body: JSON.stringify(dto),
    });
    setNewMessage("");
  };




  // Manejar selección de chat
  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat)
    setUserProducts([])
    navigate(`/chat/${chat.id}`)
  }


  // Cargar productos del usuario cuando se abre el formulario de oferta
  const loadUserProducts = async () => {
    if (!user) return

    try {
      const products = await itemService.getByUserId(user.id)
      setUserProducts(products)
    } catch (error) {
      console.error("Error al cargar los productos del usuario:", error)
      setError("No se pudieron cargar tus productos. Por favor, inténtalo de nuevo.")
    }
  }
  // Manejar envío de oferta
  const handleSendOffer = () => {
    if (!selectedChat || !user) return

    // Permitir envío si hay producto O créditos
    if (!offerDetails.itemName && (!offerDetails.credits || offerDetails.credits === "")) {
      return // No enviar si no hay ni producto ni créditos
    }

    const offerMessage = `Te propongo un intercambio: ${offerDetails.itemName}${offerDetails.itemDescription ? ` - ${offerDetails.itemDescription}` : ""}${offerDetails.credits && offerDetails.credits !== "" ? ` + ${offerDetails.credits} créditos` : ""}`

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
          credits: "", // Cambiar de 0 a string vacío
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
                          <h6 className="mb-0 text-truncate">{chat.owner.name}</h6>
                          <small className="text-muted ms-2">
                            {chat.lastMessageAt && formatDate(chat.lastMessageAt)}
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
                          <div className="d-flex align-items-center">
                            <Image
                              src={chat.transaction.item.user.imageUrl || "/placeholder.svg?height=16&width=16"}
                              width={16}
                              height={16}
                              className="rounded-circle me-2 object-fit-cover"
                            />
                            <small className="text-truncate d-block">
                              <Badge bg="light" text="dark" className="border">
                                {chat.transaction.item.title}
                              </Badge>
                            </small>
                          </div>
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
                        src={selectedChat.owner.imageUrl || "/placeholder.svg?height=40&width=40"}
                        roundedCircle
                        width={40}
                        height={40}
                        className="object-fit-cover"
                      />
                      {selectedChat.owner.online && (
                        <div
                          className="position-absolute bottom-0 end-0 bg-success rounded-circle p-1"
                          style={{ width: "10px", height: "10px", border: "2px solid white" }}
                        ></div>
                      )}
                    </div>

                    <div>
                      <h6 className="mb-0">
                        <Link to={`/perfil/${selectedChat.owner.id}`} className="text-decoration-none text-dark">
                          {selectedChat.owner.name}
                        </Link>
                      </h6>
                      <small className="text-muted">
                        {selectedChat.owner.online ? "En línea" : "Desconectado"}
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
                    src={selectedChat.transaction.item.imageUrl.split('|')[0] || "/placeholder.svg?height=60&width=60"}
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
                    {/* Agregar información del dueño */}
                    <div className="d-flex align-items-center mt-1">
                      <Image
                        src={selectedChat.transaction.item.user.imageUrl || "/placeholder.svg?height=20&width=20"}
                        width={20}
                        height={20}
                        className="rounded-circle me-2 object-fit-cover"
                      />
                      <small className="text-muted">
                        {user?.id === selectedChat.transaction.item.user.id 
                          ? "Ofrecido por ti" 
                          : `Ofrecido por ${selectedChat.transaction.item.user.name}`}
                      </small>
                    </div>
                  </div>
                  {/* Solo mostrar el botón si el usuario no es el vendedor */}
                  {user?.id !== selectedChat.transaction.item.user.id && (
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="rounded-pill"
                      onClick={() => { loadUserProducts(), setShowOfferForm(!showOfferForm) }}
                    >
                      <ArrowClockwise className="me-1" />
                      Proponer intercambio
                    </Button>
                  )}
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
                        {userProducts.length === 0 ? (
                          <div className="d-flex align-items-center mb-2">
                            <Spinner animation="border" size="sm" className="me-2" />
                            <small>Cargando tus productos...</small>
                          </div>
                        ) : userProducts.length > 0 ? (
                          <Form.Select
                            value={offerDetails.itemName}
                            onChange={(e) => {
                              const selectedProduct = userProducts.find((p) => p.title === e.target.value)
                              setOfferDetails({
                                ...offerDetails,
                                itemName: e.target.value,
                                itemDescription: selectedProduct?.description || "",
                              })
                            }}
                            required
                          >
                            <option value="">Selecciona un producto</option>
                            {userProducts.map((product) => (
                              <option key={product.id} value={product.title}>
                                {product.title} - {product.price} créditos
                              </option>
                            ))}
                          </Form.Select>
                        ) : (
                          <div className="alert alert-warning">
                            <small>
                              No tienes productos para ofrecer. <Link to="/vender">Publica un producto</Link> primero.
                            </small>
                          </div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Añade detalles sobre el producto"
                          value={offerDetails.itemDescription}
                          onChange={(e) => setOfferDetails({ ...offerDetails, itemDescription: e.target.value })}
                          disabled={true}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Créditos propuestos:</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          placeholder="Ingresa aquí los créditos que quieres ofrecer"
                          value={offerDetails.credits}
                          onChange={(e) =>
                            setOfferDetails({ ...offerDetails, credits: e.target.value })
                          }
                        />
                      </Form.Group>

                      <div className="d-flex gap-2">
                        <Button
                          variant="success"
                          className="rounded-pill"
                          onClick={handleSendOffer}
                          disabled={!offerDetails.itemName && (!offerDetails.credits || offerDetails.credits === "")}
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
                          
                          {/* Botones de aceptar/rechazar para mensajes de oferta (SÓLO VISUAL. SIN FUNCIONALIDAD) */}
                          {message.sender.id !== user?.id && (
                            <div className="mt-2 d-flex gap-2">
                              <Button 
                                variant="primary" 
                                size="sm" 
                                disabled={selectedChat?.transaction.status !== "pending"}
                              >
                                <CheckCircle className="me-1" /> Aceptar
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm" 
                                disabled={selectedChat?.transaction.status !== "pending"}
                              >
                                <XCircle className="me-1" /> Rechazar
                              </Button>
                            </div>
                          )}
                          
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
    </Container >
  )
}

export default PaginaChat