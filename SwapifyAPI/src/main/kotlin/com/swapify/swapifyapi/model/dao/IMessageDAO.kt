package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.Message
import org.springframework.data.repository.CrudRepository

interface IMessageDAO: CrudRepository<Message, Int> {
}