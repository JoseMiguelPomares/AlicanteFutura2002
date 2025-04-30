package com.swapify.swapifyapi.model.dto

import java.time.Instant

class ChatMessageDTO (
    val senderId: Long,
    val content: String,
    val timestamp: Instant? = null
){
}