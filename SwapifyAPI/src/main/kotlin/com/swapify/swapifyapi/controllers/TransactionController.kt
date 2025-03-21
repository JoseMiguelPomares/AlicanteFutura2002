package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.model.entities.Transaction
import com.swapify.swapifyapi.services.TransactionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/transactions")
class TransactionController {

    @Autowired
    lateinit var transactionService: TransactionService


    @GetMapping("/getByUserId/{userId}")
    fun getTransactionByUserId(@PathVariable userId: Long): ResponseEntity<List<Transaction>> {
        return transactionService.getTransactionByUserId(userId)
    }
}