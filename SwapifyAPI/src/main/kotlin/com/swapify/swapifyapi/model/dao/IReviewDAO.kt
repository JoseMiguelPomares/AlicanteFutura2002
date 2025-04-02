package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.Chat
import org.springframework.data.repository.CrudRepository

interface IReviewDAO: CrudRepository<Chat, Int> {
}