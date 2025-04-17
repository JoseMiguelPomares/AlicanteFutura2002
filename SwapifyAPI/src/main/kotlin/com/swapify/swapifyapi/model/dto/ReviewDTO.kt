// ReviewDTO.kt
package com.swapify.swapifyapi.model.dto

import java.time.Instant

data class ReviewDTO(
    val id: Int?,
    val reviewerId: Int?,
    val reviewerName: String?,
    val reviewerImageUrl: String?,
    val reviewedId: Int?,
    val reviewedName: String?,
    val rating: Int?,
    val comment: String?,
    val createdAt: Instant?
)