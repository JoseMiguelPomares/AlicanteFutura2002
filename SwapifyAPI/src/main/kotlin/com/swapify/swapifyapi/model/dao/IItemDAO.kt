package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.Item
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import java.math.BigDecimal

interface IItemDAO: CrudRepository<Item, Int> {
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
    LEFT JOIN FETCH i.category
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
    @Query(
        """
        SELECT i 
        FROM Item i
        LEFT JOIN FETCH i.user
        WHERE lower(i.title) = lower(:title)
        """
    )
    fun findByTitle(title: String): MutableList<Item>

    @Query(
        """
        SELECT i 
        FROM Item i
        LEFT JOIN FETCH i.user
        ORDER BY i.price ASC
        """
    )
    fun findByLowerPrice(): MutableList<Item>

    @Query(
        """
        SELECT i 
        FROM Item i
        LEFT JOIN FETCH i.user
        ORDER BY i.price DESC
        """
    )
    fun findByHigherPrice(): MutableList<Item>

    @Query(
        """
    SELECT i FROM Item i
    LEFT JOIN FETCH i.user
    WHERE i.price BETWEEN :minPrice AND :maxPrice
    """
    )
    fun findByPriceRange(minPrice: Double, maxPrice: Double): List<Item>
}