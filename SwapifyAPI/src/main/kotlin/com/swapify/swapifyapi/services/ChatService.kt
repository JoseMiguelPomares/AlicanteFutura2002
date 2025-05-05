package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.IChatDAO
import com.swapify.swapifyapi.model.dao.IMessageDAO
import com.swapify.swapifyapi.model.dao.IUserDAO
import com.swapify.swapifyapi.model.dto.ChatMessageDTO
import com.swapify.swapifyapi.model.entities.Chat
import com.swapify.swapifyapi.model.entities.Message
import jakarta.persistence.EntityNotFoundException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.Instant


@Service
class ChatService(
    private val roomRepo: IChatDAO,
    private val messageRepo: IMessageDAO,
    private val userRepo: IUserDAO
) : ChatServiceInterface {

    override fun saveMessage(roomId: Int, dto: ChatMessageDTO): Message {
        val chat = roomRepo.findById(roomId)
            .orElseThrow { EntityNotFoundException("ChatRoom $roomId no encontrada") }
        val sender = userRepo.findById(dto.senderId.toInt())
            .orElseThrow { EntityNotFoundException("User ${dto.senderId} no encontrado") }

        // Use createdAt to match the entity field
        val message = Message()
        message.chat = chat
        message.sender = sender
        message.content = dto.content
        message.createdAt = dto.timestamp ?: Instant.now()
        return messageRepo.save(message)
    }

    override fun findMessages(roomId: Int): List<Message> {
        val chat = roomRepo.findById(roomId)
            .orElseThrow { EntityNotFoundException("ChatRoom $roomId no encontrada") }
        return messageRepo.findByChat(chat)
    }
}