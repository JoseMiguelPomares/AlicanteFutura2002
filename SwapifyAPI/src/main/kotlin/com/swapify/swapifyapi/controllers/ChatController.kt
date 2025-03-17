package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.services.ChatService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/chat")
class ChatController {

    @Autowired
    lateinit var chatService: ChatService

    @GetMapping("/getAll")
    fun getChats() = chatService.getChats()
}