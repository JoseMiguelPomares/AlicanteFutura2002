package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.IItemDAO
import com.swapify.swapifyapi.model.dao.ITransactionDAO
import com.swapify.swapifyapi.model.dao.IUserDAO
import com.swapify.swapifyapi.model.entities.Item
import com.swapify.swapifyapi.model.entities.Transaction
import com.swapify.swapifyapi.model.entities.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.Instant
import java.util.*

@Service
class TransactionService {

    @Autowired
    lateinit var transactionDAO: ITransactionDAO
    @Autowired
    lateinit var itemDAO: IItemDAO
    @Autowired
    lateinit var userDAO: IUserDAO

    //Función para obtener transacciones por la id del usuario
    fun getTransactionByUserId(userId: Long): ResponseEntity<List<Transaction>> {
        // Buscar transacciones donde el usuario es owner o requester
        val ownerTransactions = transactionDAO.findByOwnerIdWithAll(userId)
        val requesterTransactions = transactionDAO.findByRequesterIdWithAll(userId)
        
        // Combinar ambas listas
        val allTransactions = ownerTransactions + requesterTransactions
        
        return if (allTransactions.isNotEmpty()) {
            ResponseEntity.ok(allTransactions)
        } else {
            // Mejor devolver una lista vacía que un 404
            ResponseEntity.ok(emptyList())
        }
    }

    //Funcion para añadir una transacción
    fun addTransaction(requesterId: Int, ownerId: Int, itemId: Int, finalPrice: BigDecimal): ResponseEntity<Transaction> {
        val transaction = Transaction()
        if (itemDAO.findById(itemId).isPresent &&
            userDAO.findById(requesterId).isPresent &&
            userDAO.findById(ownerId).isPresent) {
            transaction.requester = User().apply { id = requesterId }
            transaction.owner = User().apply { id = ownerId }
            transaction.item = Item().apply { id = itemId }
            transaction.finalPrice = finalPrice
            transactionDAO.save(transaction)
            return ResponseEntity.ok(transaction)
        } else{
            return ResponseEntity.notFound().build()
        }
    }

    //Función para modificar una transacción a cancelada
    fun cancelTransaction(transactionId: Int): ResponseEntity<Transaction> {
        val transactionOptional: Optional<Transaction> = transactionDAO.findById(transactionId)
        return if (transactionOptional.isPresent) {
            val transaction = transactionOptional.get()
            transaction.status = "CANCELLED"
            transactionDAO.save(transaction)
            ResponseEntity.ok(transaction)
        } else {
            ResponseEntity.notFound().build()
        }
    }
}