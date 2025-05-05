package com.swapify.swapifyapi.model.dto

class UserSignInDTO (
    val name: String,
    val email: String,
    val password: String,
    val imageUrl: String? = null,
){
}