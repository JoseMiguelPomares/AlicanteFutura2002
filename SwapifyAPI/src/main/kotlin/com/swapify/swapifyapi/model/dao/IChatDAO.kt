package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.Chat
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.repository.CrudRepository

interface IChatDAO: CrudRepository<Chat, Int> {

    @EntityGraph(attributePaths = ["transaction","owner","requester"])
    fun findByTransactionId(transactionId: Int): Chat?
}