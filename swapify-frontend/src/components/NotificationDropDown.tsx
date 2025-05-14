"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Image, Button, Badge } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { Bell, CheckAll } from "react-bootstrap-icons"
import { useNotifications } from "../contexts/NotificationContext"

// Función para formatear la fecha en formato relativo
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "Ahora mismo"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `Hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `Hace ${hours} ${hours === 1 ? "hora" : "horas"}`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `Hace ${days} ${days === 1 ? "día" : "días"}`
  }
}

// Componente para truncar texto largo
const TruncatedText = ({ text, maxLength = 50 }: { text: string; maxLength?: number }) => {
  if (text.length <= maxLength) return <>{text}</>
  return <>{text.substring(0, maxLength)}...</>
}

export const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Cerrar el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Manejar clic en una notificación
  const handleNotificationClick = (chatId: number, notificationId: number) => {
    markAsRead(notificationId)
    navigate(`/chat/${chatId}`)
    setIsOpen(false)
  }

  // Manejar "marcar todas como leídas"
  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation()
    markAllAsRead()
  }

  return (
    <div className="position-relative" ref={dropdownRef}>
      {/* Botón de notificaciones con badge */}
      <Button
        variant="link"
        className="text-white p-0 position-relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notificaciones"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ animation: isOpen ? "none" : "pulse 2s infinite" }}
          >
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown de notificaciones */}
      {isOpen && (
        <div
          className="position-absolute end-0 mt-2 shadow rounded-3 bg-white"
          style={{
            width: "320px",
            maxHeight: "400px",
            overflowY: "auto",
            zIndex: 1050,
            border: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          {/* Encabezado */}
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h6 className="m-0 fw-bold">Notificaciones</h6>
            {unreadCount > 0 && (
              <Button
                variant="link"
                size="sm"
                className="text-decoration-none p-0 text-muted"
                onClick={handleMarkAllAsRead}
              >
                <small>Marcar todas como leídas</small>
              </Button>
            )}
          </div>

          {/* Lista de notificaciones */}
          <div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted">
                <p className="mb-0">No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-bottom cursor-pointer ${notification.read ? "" : "bg-light"}`}
                  onClick={() => handleNotificationClick(notification.chatId, notification.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex">
                    {/* Imagen del remitente */}
                    <div className="me-2">
                      <Image
                        src={notification.senderImage || "/placeholder.svg?height=40&width=40"}
                        roundedCircle
                        width={40}
                        height={40}
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    {/* Contenido de la notificación */}
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <p className="mb-0 fw-bold">{notification.senderName}</p>
                        <small className="text-muted">{formatRelativeTime(notification.timestamp)}</small>
                      </div>
                      <p className="mb-0 text-muted">
                        <TruncatedText text={notification.message} />
                      </p>
                      <div className="mt-1">
                        {notification.read ? (
                          <small className="text-muted d-flex align-items-center">
                            <CheckAll size={14} className="me-1" /> Leído
                          </small>
                        ) : (
                          <Badge bg="success" pill className="opacity-75">
                            Nuevo
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pie del dropdown */}
          <div className="p-2 text-center border-top">
            <Button
              variant="link"
              size="sm"
              className="text-decoration-none"
              onClick={() => {
                navigate("/chat")
                setIsOpen(false)
              }}
            >
              Ver todos los mensajes
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}