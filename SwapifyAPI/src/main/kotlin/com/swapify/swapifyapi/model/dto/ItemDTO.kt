package com.swapify.swapifyapi.model.dto
import java.math.BigDecimal

import java.time.Instant

class ItemDTO (
    val id: Int,
    val user: UserDTO,
    val title: String,
    val description: String,
    val itemCondition: String?,
    val location: String,
    val price: BigDecimal,
    val category: CategoryDTO?,
    val imageUrl: String?,
    val status: String,
    val createdAt: Instant?
){
}

data class UserDTO(
    val id: Int,
    val name: String,
    val imageUrl: String?
)

data class CategoryDTO(
    val id: Int,
    val name: String
)