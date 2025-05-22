package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.Item
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import java.math.BigDecimal

interface IItemDAO: CrudRepository<Item, Int> {
    @Query(
        """
        SELECT i FROM Item i
        LEFT JOIN FETCH i.user
        LEFT JOIN FETCH i.category
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

    // Busca items filtrando por el nombre de la categoría, no por el objeto category directamente.
    // Esto es necesario porque `i.category` es una relación (entidad), no una cadena.
    // Se hace un JOIN explícito con la entidad Category para poder acceder a su campo `name`.
    @Query(
        """
        SELECT i FROM Item i
        JOIN i.category c
        WHERE lower(c.name) = lower(:category)
        """
    )
    fun findByCategory(category: String): List<Item>

    // Igual que la anterior, pero además filtra por el id del usuario.
    @Query(
        """
        SELECT i FROM Item i
        LEFT JOIN FETCH i.user
        JOIN i.category c
        WHERE i.user.id = :userId 
        AND lower(c.name) = lower(:category)
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
    fun findByPriceRange(minPrice: BigDecimal, maxPrice: BigDecimal): List<Item>

    @Query(
        """
        SELECT i 
        FROM Item i
        LEFT JOIN FETCH i.user
        ORDER BY i.createdAt DESC
        """
    )
    fun findByItemTime(): MutableList<Item>

    @Query(
        value = """
      SELECT
        i.*
      FROM items i
      WHERE (
        6371000 * acos(
          cos(radians(:latCentro)) *
          cos(radians(i.latitude)) *
          cos(radians(i.longitude) - radians(:lngCentro)) +
          sin(radians(:latCentro)) *
          sin(radians(i.latitude))
        )
      ) <= :radio
      ORDER BY (
        6371000 * acos(
          cos(radians(:latCentro)) *
          cos(radians(i.latitude)) *
          cos(radians(i.longitude) - radians(:lngCentro)) +
          sin(radians(:latCentro)) *
          sin(radians(i.latitude))
        )
      )
    """,
        nativeQuery = true
    )
    fun findByDistance(
        @Param("latCentro") latCentro: Double,
        @Param("lngCentro") lngCentro: Double,
        @Param("radio") radio: Double  // en metros
    ): List<Item>
}