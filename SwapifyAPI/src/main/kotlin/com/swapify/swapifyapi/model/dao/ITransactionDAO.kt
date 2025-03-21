package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.Transaction
import com.swapify.swapifyapi.model.entities.User
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

interface ITransactionDAO: CrudRepository<Transaction, Long> {
    fun findByOwnerId(userId: Long): MutableList<Transaction>
    fun findByOwner(user: User): MutableList<Transaction>
    @Query("""
    SELECT t FROM Transaction t
    LEFT JOIN FETCH t.item
    LEFT JOIN FETCH t.requester
    LEFT JOIN FETCH t.owner
    WHERE t.owner.id = :userId
    """)
    fun findByOwnerIdWithAll(@Param("userId") userId: Long): List<Transaction>
}