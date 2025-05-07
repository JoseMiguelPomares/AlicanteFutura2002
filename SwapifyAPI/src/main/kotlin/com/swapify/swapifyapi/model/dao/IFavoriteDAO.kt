package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.Favorite
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface IFavoriteDAO: CrudRepository<Favorite, Int> {
    @Query("""
    SELECT f
    FROM Favorite f
    LEFT JOIN FETCH f.user
    LEFT JOIN FETCH f.item
    WHERE f.user.id = ?1""")
    fun findByUserId(userId: Int): List<Favorite>

    /*@Query("""
        SELECT COUNT(user_id) AS user_id
        FROM favorites
        GROUP BY item_id
    """)
    fun findByNumberOfFavorites(): List<Favorite>*/

    @Query("""SELECT f
            FROM Favorite f
            LEFT JOIN FETCH f.user
            Left JOIN FETCH f.item
            WHERE f.user.id = ?1 AND f.item.id = ?2""")
    fun findByUserIdAndItemId(userId: Int, itemId: Int): Favorite?
    
    // Contar favoritos
    @Query("SELECT COUNT(f) FROM Favorite f WHERE f.item.id = ?1")
    fun countByItemId(itemId: Int): Int
    
    @Query("SELECT f.item.id as itemId, COUNT(f) as count FROM Favorite f GROUP BY f.item.id")
    fun countAllFavorites(): List<Map<String, Any>>

}