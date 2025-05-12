package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.IChatDAO
import com.swapify.swapifyapi.model.dao.IMessageDAO
import com.swapify.swapifyapi.model.dao.ITransactionDAO
import com.swapify.swapifyapi.model.dao.IUserDAO
import com.swapify.swapifyapi.model.dto.ChatMessageDTO
import com.swapify.swapifyapi.model.entities.Chat
import com.swapify.swapifyapi.model.entities.Message
import com.swapify.swapifyapi.model.entities.Transaction
import com.swapify.swapifyapi.model.entities.User
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.Instant


@Service
class ChatService(
    private val roomRepo: IChatDAO,
    private val messageRepo: IMessageDAO,
    private val userRepo: IUserDAO,
    private val transactionRepo: ITransactionDAO
) : ChatServiceInterface {

    // Función para guardar un mensaje en un chat
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

    // Función para obtener mensajes de un chat
    override fun findMessages(roomId: Int): List<Message> {
        val chat = roomRepo.findById(roomId)
            .orElseThrow { EntityNotFoundException("ChatRoom $roomId no encontrada") }
        return messageRepo.findMessagesByChatId(roomId)
    }

    //Función para encontrar por id de transaccion
    fun findChatByTransactionId(transactionId: Int): Chat? {
        roomRepo.findByTransactionId(transactionId)?.let { return it }
        return null
    }

    //Función para encontrar por id de transaccion
    fun findChatByTransactionId(transactionId: Int): Chat? {
        roomRepo.findByTransactionId(transactionId)?.let { return it }
        return null
    }

    // Función para obtener o crear un chat
    fun getOrCreateChat(transactionId: Int, buyerId: Int, sellerId: Int): Chat {
        val optionalBuyer = userRepo.findById(buyerId)
        val optionalSeller = userRepo.findById(sellerId)
        if (optionalBuyer.isEmpty || optionalSeller.isEmpty) {
            throw EntityNotFoundException("User no encontrado")
        }
        val transaction = transactionRepo.findById(transactionId)
            .orElseThrow { EntityNotFoundException("Transacción no encontrada: $transactionId") }

        val chat = Chat()
        chat.transaction = transaction
        chat.owner = optionalSeller.get()
        chat.requester = optionalBuyer.get()
        return roomRepo.save(chat)
    }
}