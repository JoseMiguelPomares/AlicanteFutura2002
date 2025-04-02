package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.Favorite
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface IFavoriteDAO: CrudRepository<Favorite, Int> {
    fun findByUserId(userId: Long): List<Favorite>

    /*@Query("""
        SELECT COUNT(user_id) AS user_id
        FROM favorites
        GROUP BY item_id
    """)
    fun findByNumberOfFavorites(): List<Favorite>*/
}