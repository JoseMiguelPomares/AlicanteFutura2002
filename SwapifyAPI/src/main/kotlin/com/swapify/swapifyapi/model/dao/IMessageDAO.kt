package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.Chat
import com.swapify.swapifyapi.model.entities.Message
import org.springframework.data.repository.CrudRepository

interface IMessageDAO: CrudRepository<Message, Int> {
    fun findByChat(chat: Chat): List<Message>
}