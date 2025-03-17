package com.swapify.swapifyapi.model.dto

data class UserDTO(var id: Long = 0,
              var name: String? = null,
              var credits: Int = 0,
              var reputation: Double = 0.0) {
}