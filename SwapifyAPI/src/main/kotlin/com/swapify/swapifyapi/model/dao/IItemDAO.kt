package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.Item
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface IItemDAO: CrudRepository<Item, Long> {
    @Query(
        """
        SELECT i FROM Item i
        LEFT JOIN FETCH i.user
        WHERE i.user.id = :userId
        """
    )
    fun findByUserIdWithAll(userId: Long): List<Item>

    @Query(
        """
        SELECT i FROM Item i
        LEFT JOIN FETCH i.user
        """
    )
    fun findAllItems(): List<Item>

    @Query(
        """
        SELECT i FROM Item i
        WHERE lower(i.category) = lower(:category)
        """
    )
    fun findByCategory(category: String): List<Item>

    @Query(
        """
        SELECT i FROM Item i
        LEFT JOIN FETCH i.user
        WHERE i.user.id = :userId 
        AND lower(i.category) = lower(:category)
        """
    )
    fun findByCategoryAndId(category: String, userId: Long): List<Item>
}