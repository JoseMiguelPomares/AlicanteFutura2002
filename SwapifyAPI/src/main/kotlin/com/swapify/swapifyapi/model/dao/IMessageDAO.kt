package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.Chat
import com.swapify.swapifyapi.model.entities.Message
import org.springframework.data.repository.CrudRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface IMessageDAO: CrudRepository<Message, Int> {
    @Query("""
    SELECT m FROM Message m
    LEFT JOIN FETCH m.sender
    LEFT JOIN FETCH m.chat
    WHERE m.chat.id = :chatId
    ORDER BY m.createdAt ASC
""")
fun findMessagesByChatId(@Param("chatId") chatId: Int): List<Message>
    
    fun findByChat(chat: Chat): List<Message>
}