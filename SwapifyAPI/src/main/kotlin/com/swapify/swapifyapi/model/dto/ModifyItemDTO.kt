package com.swapify.swapifyapi.model.dto

import java.math.BigDecimal

class ModifyItemDTO (
    val userId: Int,
    val title: String,
    val description: String?,
    val categoryId: Int,
    val imageUrl: String?,
    val price: BigDecimal,
    val itemCondition: String?,
    val location: String?
){
}