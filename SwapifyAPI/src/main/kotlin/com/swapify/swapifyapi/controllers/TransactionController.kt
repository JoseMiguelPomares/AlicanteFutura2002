package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.model.entities.Transaction
import com.swapify.swapifyapi.services.TransactionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal

@RestController
@RequestMapping("/transactions")
class TransactionController {

    @Autowired
    lateinit var transactionService: TransactionService


    //Función para obtener todas las transacciones de un usuario
    @GetMapping("/getByUserId/{userId}")
    fun getTransactionByUserId(@PathVariable userId: Long): ResponseEntity<List<Transaction>> {
        return transactionService.getTransactionByUserId(userId)
    }

    //Función para añadir una transacción
    @PostMapping("/addTransaction/{requesterId}/{ownerId}/{itemId}/{finalPrice}")
    fun addTransaction(@PathVariable requesterId: Int,
                       @PathVariable ownerId: Int,
                       @PathVariable itemId: Int,
                       @PathVariable finalPrice: BigDecimal): ResponseEntity<Transaction> {
        return transactionService.addTransaction(requesterId, ownerId, itemId, finalPrice)
    }

    //Función para modificar una transacción a cancelada
    @PutMapping("/cancelTransaction/{transactionId}")
    fun cancelTransaction(@PathVariable transactionId: Int): ResponseEntity<Transaction> {
        return transactionService.cancelTransaction(transactionId)
    }
}