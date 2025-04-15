package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.IReviewDAO
import com.swapify.swapifyapi.model.dto.ReviewDTO
import com.swapify.swapifyapi.model.entities.Review
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ReviewService {

    @Autowired
    lateinit var reviewDAO: IReviewDAO

    // Obtener reviews de un usuario (como revisado)
    fun getReviewsByReviewedUser(reviewedUserId: Int): List<ReviewDTO> {
        return reviewDAO.findByReviewedId(reviewedUserId).map { review ->
            convertToDTO(review)
        }
    }

    private fun convertToDTO(review: Review): ReviewDTO {
        return ReviewDTO(
            id = review.id,
            reviewerId = review.reviewer?.id,
            reviewerName = review.reviewer?.name,
            reviewerImageUrl = review.reviewer?.imageUrl,
            reviewedId = review.reviewed?.id,
            reviewedName = review.reviewed?.name,
            rating = review.rating,
            comment = review.comment,
            createdAt = review.createdAt
        )
    }
    
    // Crear una nueva review entre usuarios
    fun createReview(review: Review): Review {
        return reviewDAO.save(review)
    }
    
    // Obtener estadísticas de reviews para un usuario
    fun getUserReviewStats(userId: Int): Map<String, Any> {
        val reviews = reviewDAO.findByReviewedId(userId)
        val totalReviews = reviews.size
        val averageRating = if (totalReviews > 0) {
            reviews.mapNotNull { it.rating }.average()
        } else {
            0.0
        }
        
        return mapOf(
            "averageRating" to averageRating,
            "totalReviews" to totalReviews
        )
    }
}