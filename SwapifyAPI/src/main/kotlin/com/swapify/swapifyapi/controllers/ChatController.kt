package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.model.dto.ChatMessageDTO
import com.swapify.swapifyapi.model.entities.Chat
import com.swapify.swapifyapi.model.entities.Message
import com.swapify.swapifyapi.services.ChatService
import jakarta.persistence.EntityNotFoundException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException


@RestController
@RequestMapping("/chat")
class ChatController {

    @Autowired
    lateinit var chatService: ChatService

    @GetMapping("/{roomId}/messages")
    fun getMessages(@PathVariable roomId: Int): ResponseEntity<List<Message>> {
        return try {
            val messages = chatService.findMessages(roomId)
            ResponseEntity.ok(messages)
        } catch (ex: EntityNotFoundException) {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/{roomId}/messages")
    fun postMessage(
        @PathVariable roomId: Int,
        @RequestBody dto: ChatMessageDTO
    ): ResponseEntity<Message> {
        return try {
            val saved = chatService.saveMessage(roomId, dto)
            ResponseEntity.ok(saved)
        } catch (ex: EntityNotFoundException) {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/{transactionId}/{requesterId}/{ownerId}")
    fun getOrCreateChat(
        @PathVariable transactionId: Int,
        @PathVariable requesterId: Int,
        @PathVariable ownerId: Int
    ): ResponseEntity<Chat> {
        return try {
            // Si ya existía, devuelve su id
            val existing = chatService.findChatByTransactionId(transactionId)
            if (existing != null) {
                ResponseEntity.ok(existing)
            } else {
                // Si no existía, lo crea y devuelve 201
                val created = chatService.getOrCreateChat(transactionId, requesterId, ownerId)
                ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(created)
            }
        } catch (ex: EntityNotFoundException) {
            // aquí capturas “transacción no encontrada” o “usuario no encontrado”
            throw ResponseStatusException(HttpStatus.NOT_FOUND, ex.message)
        }
    }
}