package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.IChatDAO
import com.swapify.swapifyapi.model.entities.Chat
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ChatService {

    @Autowired
    lateinit var chatDAO: IChatDAO

    fun getChats(): MutableIterable<Chat> {
        return chatDAO.findAll()
    }
}