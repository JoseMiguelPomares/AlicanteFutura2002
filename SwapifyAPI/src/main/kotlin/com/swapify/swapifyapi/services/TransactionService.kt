package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.ITransactionDAO
import com.swapify.swapifyapi.model.entities.Item
import com.swapify.swapifyapi.model.entities.Transaction
import com.swapify.swapifyapi.model.entities.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.time.Instant
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

    //Funcion para añadir una transacción
    fun addTransaction(requesterId: Int, ownerId: Int, itemId: Int): ResponseEntity<Transaction> {
        val transaction = Transaction()

        transaction.requester = User().apply { id = requesterId }
        transaction.owner = User().apply { id = ownerId }
        transaction.item = Item().apply { id = itemId }
        transactionDAO.save(transaction)
        return ResponseEntity.ok(transaction)
    }
}