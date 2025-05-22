package com.swapify.swapifyapi.model.dto

import java.math.BigDecimal

class NewItemDTO (
    val userId: Int,
    val title: String,
    val description: String,
    val categoryId: Int,
    val imageUrl: String?,
    val price: BigDecimal,
    val itemCondition: String?,
    val location: String?,
    val latitude: Double,
    val longitude: Double,
){
}