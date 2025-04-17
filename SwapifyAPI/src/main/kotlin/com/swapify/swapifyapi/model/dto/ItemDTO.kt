package com.swapify.swapifyapi.model.dto

import java.time.Instant

class ItemDTO (
    val id: Int,
    val username: String,
    val title: String,
    val description: String,
    val category: CategoryDTO?,
    val imageUrl: String?,
    val status: String,
    val createdAt: Instant?
){
}

data class CategoryDTO(
    val id: Int,
    val name: String
)