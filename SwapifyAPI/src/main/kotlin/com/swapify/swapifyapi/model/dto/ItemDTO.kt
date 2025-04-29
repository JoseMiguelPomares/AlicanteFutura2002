package com.swapify.swapifyapi.model.dto
import java.math.BigDecimal

import java.time.Instant

class ItemDTO (
    val id: Int,
    val username: UserDTO,
    val title: String,
    val description: String,
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

)

data class CategoryDTO(
    val id: Int,
    val name: String
)