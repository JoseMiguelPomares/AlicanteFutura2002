package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.model.dto.ChatMessageDTO
import com.swapify.swapifyapi.model.entities.Message
import com.swapify.swapifyapi.services.ChatServiceInterface
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller

@Controller
class ChatWebSocketController(
    private val chatService: ChatServiceInterface
) {

    /**
     * Recibe mensajes de los clientes en /app/chat/{roomId}
     * y los reenvía a /topic/chat/{roomId} para que todos los
     * suscriptores vean el nuevo mensaje.
     */
    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/chat/{roomId}")
    fun sendMessage(
        @DestinationVariable roomId: Int,
        @Payload dto: ChatMessageDTO
    ): Message {
        // Guarda el mensaje en la base de datos
        return chatService.saveMessage(roomId, dto)
    }
}
