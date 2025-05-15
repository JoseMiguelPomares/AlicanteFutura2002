package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.model.entities.Review
import com.swapify.swapifyapi.services.ReviewService
import com.swapify.swapifyapi.model.dto.ReviewDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/reviews")
class ReviewController {

    @Autowired
    lateinit var reviewService: ReviewService

    // Obtener reviews recibidas por un usuario
    @GetMapping("/userReviews/{userId}")
    fun getReviewsByUser(@PathVariable userId: Int): ResponseEntity<List<ReviewDTO>> {
        val reviews = reviewService.getReviewsByReviewedUser(userId)
        return ResponseEntity.ok(reviews)
    }
    
    // Crear una nueva review entre usuarios
    @PostMapping("/create")
    fun createReview(@RequestBody review: Review): ResponseEntity<Review> {
        val savedReview = reviewService.createReview(review)
        return ResponseEntity.ok(savedReview)
    }
    
    // Obtener estadísticas de reviews para un usuario
    @GetMapping("/stats/{userId}")
    fun getUserReviewStats(@PathVariable userId: Int): ResponseEntity<Map<String, Any>> {
        val stats = reviewService.getUserReviewStats(userId)
        return ResponseEntity.ok(stats)
    }

    //Modificar una review
    @PutMapping("/modify")
    fun modifyReview(@RequestBody review: Review): Review {
        return reviewService.updateReview(review)
    }

    //Eliminar una review
    @DeleteMapping("/delete/{id}")
    fun deleteReview(@PathVariable id: Int): ResponseEntity<Void> {
        reviewService.deleteReview(id)
        return ResponseEntity.noContent().build()
    }
}