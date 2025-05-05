// ReviewDTO.kt
package com.swapify.swapifyapi.model.dto

import java.time.Instant

data class ReviewDTO(
    val id: Int?,
    val reviewerId: Int?,
    val reviewerName: String?,
    val reviewedId: Int?,
    val reviewedName: String?,
    val rating: Int?,
    val comment: String?,
    val imageUrl: String?,
    val createdAt: Instant?
)