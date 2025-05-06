package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.model.dto.ChatMessageDTO
import com.swapify.swapifyapi.model.entities.Message
import com.swapify.swapifyapi.services.ChatService
import jakarta.persistence.EntityNotFoundException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.web.bind.annotation.*


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
}