package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.Transaction
import org.springframework.data.repository.CrudRepository

interface ITransactionDAO: CrudRepository<Transaction, Long> {
}