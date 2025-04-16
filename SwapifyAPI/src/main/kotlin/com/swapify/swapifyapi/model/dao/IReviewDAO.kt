package com.swapify.swapifyapi.model.dao

import com.swapify.swapifyapi.model.entities.Review
import org.springframework.data.repository.CrudRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface IReviewDAO: CrudRepository<Review, Int> {
    @Query("SELECT r FROM Review r JOIN FETCH r.reviewer JOIN FETCH r.reviewed WHERE r.reviewed.id = :reviewedId")
    fun findByReviewedId(@Param("reviewedId") reviewedId: Int): List<Review>
}