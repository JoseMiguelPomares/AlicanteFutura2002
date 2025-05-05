package com.swapify.swapifyapi.model.dto

data class UserProfileDTO(
    val name: String,
    val email: String,
    val location: String,
    val imageUrl: String,
    val aboutMe: String = ""
)