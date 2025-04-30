package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.IChatDAO
import com.swapify.swapifyapi.model.dao.IMessageDAO
import com.swapify.swapifyapi.model.dao.IUserDAO
import com.swapify.swapifyapi.model.dto.ChatMessageDTO
import com.swapify.swapifyapi.model.entities.Chat
import com.swapify.swapifyapi.model.entities.Message
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ChatService (
    private val roomRepo: IChatDAO,
    private val messageRepo: IMessageDAO,
    private val userRepo: IUserDAO
) : ChatServiceInterface {

    override fun saveMessage(roomId: Long, dto: ChatMessageDTO): Message {
        val room = roomRepo.findById(roomId.toInt())
            .orElseThrow { EntityNotFoundException("ChatRoom $roomId no encontrada") }
        val sender = userRepo.findById(dto.senderId.toInt())
            .orElseThrow { EntityNotFoundException("User ${dto.senderId} no encontrado") }

        val message = Message(
            room = room,
            sender = sender,
            content = dto.content,
            timestamp = dto.timestamp ?: Instant.now()
        )
        return messageRepo.save(message)
    }

    override fun findMessages(roomId: Long): List<Message> {
        val room = roomRepo.findById(roomId)
            .orElseThrow { EntityNotFoundException("ChatRoom $roomId no encontrada") }
        return messageRepo.findByRoomOrderByTimestampAsc(room)
    }
}