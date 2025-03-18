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

}