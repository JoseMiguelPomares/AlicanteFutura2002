package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.ITransactionDAO
import com.swapify.swapifyapi.model.entities.Transaction
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service

@Service
class TransactionService {

    @Autowired
    lateinit var transactionDAO: ITransactionDAO

    //Función para obtener transacciones por la id del usuario
    fun getTransactionByUserId(userId: Long): ResponseEntity<List<Transaction>> {
        return if (userId != null) {
            val transactions = transactionDAO.findByOwnerId(userId)
            ResponseEntity.ok(transactions)
        } else {
            ResponseEntity.notFound().build()
        }
    }
}