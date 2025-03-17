package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.Transaction
import com.swapify.swapifyapi.model.entities.User
import org.springframework.data.repository.CrudRepository

interface ITransactionDAO: CrudRepository<Transaction, Long> {
    fun findByOwnerId(userId: Long): MutableList<Transaction>
    fun findByOwner(user: User): MutableList<Transaction>
}