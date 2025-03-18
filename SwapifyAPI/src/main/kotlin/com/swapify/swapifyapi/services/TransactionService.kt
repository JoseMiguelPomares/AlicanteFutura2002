package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.ITransactionDAO
import com.swapify.swapifyapi.model.entities.Transaction
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.util.*

@Service
class TransactionService {

    @Autowired
    lateinit var transactionDAO: ITransactionDAO

    //Función para obtener transacciones por la id del usuario
    fun getTransactionByUserId(userId: Long): ResponseEntity<List<Transaction>> {
        val transaction: List<Transaction> = transactionDAO.findByOwnerIdWithAll(userId)
        if (transaction.isNotEmpty()) {
            return ResponseEntity.ok(transaction)
        } else {
            return ResponseEntity.notFound().build()
        }
    }
}