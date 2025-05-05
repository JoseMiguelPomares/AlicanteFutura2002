package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dto.ChatMessageDTO
import com.swapify.swapifyapi.model.entities.Message

interface ChatServiceInterface {
    fun saveMessage(roomId: Int, dto: ChatMessageDTO): Message
    fun findMessages(roomId: Int): List<Message>
}