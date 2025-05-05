package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.services.ChatService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/chat")
class ChatController {

    @Autowired
    lateinit var chatService: ChatService

    @MessageMapping("/chat/{roomId}") // destino para enviar
    @SendTo("/topic/chat/{roomId}") // a quienes estén suscritos
    fun send(
        @DestinationVariable roomId: Long?,
        dto: ChatMessageDTO?
    ): ChatMessage {
        // guarda en BD
        val msg: Message = chatService.saveMessage(roomId, dto)
        return ChatMessage.fromEntity(msg)
    }
}