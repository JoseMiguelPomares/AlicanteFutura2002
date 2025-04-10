// Este código permite autenticar un usuario con una cuenta de Google

package com.swapify.swapifyapi.model.dto

data class SocialAuthUserDTO(
    val socialId: String,
    val name: String,
    val email: String,
    val imageUrl: String?,
    val token: String?
)