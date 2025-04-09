//! REVISAR

import type { Review } from "../pages/PaginaProducto"
import axios from "axios"

export class ReviewService {
  baseUrl = "http://localhost:8080/swapify/reviews/"

  // Obtener reviews por usuario (el que recibe la review)
  async getReviewsByUserId(userId: number): Promise<Review[]> {
    try {
      return await axios
        .get(`${this.baseUrl}user/${userId}`)
        .then((res) => res.data)
        .catch((error) => {
          console.error("Error al obtener reseñas del usuario:", error.response?.data)
          return []
        })
    } catch (error) {
      console.error("Error inesperado:", error)
      return []
    }
  }

  async getReviewsByItem(itemId: number): Promise<Review[]> {
    try {
      return await axios
        .get(this.baseUrl + `itemId=${itemId}`)
        .then((res) => res.data)
        .catch((error) => {
          console.error("Error al obtener reseñas:", error.response?.data)
          return []
        })
    } catch (error) {
      console.error("Error inesperado:", error)
      return []
    }
  }

  // Crear una nueva review
  async createReview(reviewData: {
    reviewer_id: number
    reviewed_id: number
    rating: number
    comment: string
  }): Promise<Review> {
    try {
      return await axios
        .post(`${this.baseUrl}create`, reviewData)
        .then((res) => res.data)
        .catch((error) => {
          console.error("Error en la respuesta:", error.response?.data)
          throw new Error(error.response?.data?.message || "Error creating review")
        })
    } catch (error) {
      console.error("Error inesperado:", error)
      throw error
    }
  }

  // Obtener estadísticas de reviews para un usuario
  async getUserReviewStats(userId: number): Promise<{
    averageRating: number
    totalReviews: number
  }> {
    try {
      return await axios
        .get(`${this.baseUrl}stats/${userId}`)
        .then((res) => res.data)
        .catch((error) => {
          console.error("Error al obtener estadísticas:", error.response?.data)
          return { averageRating: 0, totalReviews: 0 }
        })
    } catch (error) {
      console.error("Error inesperado:", error)
      return { averageRating: 0, totalReviews: 0 }
    }
  }
}

