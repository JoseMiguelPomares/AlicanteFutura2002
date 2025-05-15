import axios from "axios"
const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE}/reviews`;

export class ReviewService {
  //baseUrl = "http://localhost:8080/swapify/reviews/"

  // Obtener reviews por usuario (el que recibe la review)
  async getReviewsByUserId(userId: number) {
    try {
      const res = await axios.get(`${API_URL}/userReviews/${userId}`)

      // Transform backend DTO to frontend Review format
      return res.data.map((item: any) => ({
        id: item.id,
        reviewer: {
          id: item.reviewerId,
          name: item.reviewerName,
          imageUrl: item.reviewerImageUrl, // Usar reviewerImageUrl para la imagen de perfil del reviewer
        },
        reviewed_id: item.reviewedId,
        rating: item.rating,
        comment: item.comment,
        created_at: item.createdAt,
        images: item.imageUrl ? item.imageUrl.split("|") : [],
      }))
    } catch (error) {
      console.error("Error al obtener reseñas del usuario:", error)
      return []
    }
  }

  // Verificar si un usuario ya ha valorado a otro
  async hasUserReviewed(reviewerId: number, reviewedId: number): Promise<boolean> {
    const reviews = await this.getReviewsByUserId(reviewedId)
    return reviews.some((review: { reviewer: { id: number } }) => review.reviewer.id === reviewerId)
  }

  // Obtener reviews por item
  async getReviewsByItem(itemId: number) {
    try {
      const res = await axios.get(`${API_URL}/item/${itemId}`)

      // Transform backend DTO to frontend Review format
      return res.data.map((item: any) => ({
        id: item.id,
        reviewer: {
          id: item.reviewerId,
          name: item.reviewerName,
          imageUrl: item.imageUrl,
        },
        reviewed_id: item.reviewedId,
        rating: item.rating,
        comment: item.comment,
        created_at: item.createdAt,
      }))
    } catch (error) {
      console.error("Error al obtener reseñas:", error)
      return []
    }
  }

  // Crear una nueva review
  async createReview(reviewData: {
    reviewer_id: number
    reviewed_id: number
    rating: number
    comment: string
    images?: string[]
  }) {
    try {
      // Transform frontend data to backend format
      const backendData = {
        reviewer: { id: reviewData.reviewer_id },
        reviewed: { id: reviewData.reviewed_id },
        rating: reviewData.rating,
        comment: reviewData.comment,
        imageUrl: reviewData.images && reviewData.images.length > 0 ? reviewData.images.join("|") : null,
      }

      console.log('Enviando datos al backend:', backendData);
      const res = await axios.post(`${API_URL}/create`, backendData)
      const item = res.data
      console.log('Respuesta del backend:', item);

      // Transform response back to frontend format
      return {
        id: item.id,
        reviewer: {
          id: item.reviewer?.id,
          name: item.reviewer?.name,
          imageUrl: item.reviewer?.imageUrl,
        },
        reviewed_id: item.reviewed?.id,
        rating: item.rating,
        comment: item.comment,
        created_at: item.createdAt,
        images: item.imageUrl ? item.imageUrl.split("|") : [],
      }
    } catch (error) {
      console.error("Error al crear la reseña:", error)
      throw error
    }
  }

  // Obtener estadísticas de reviews para un usuario
  async getUserReviewStats(userId: number) {
    try {
      const res = await axios.get(`${API_URL}/stats/${userId}`)
      return res.data
    } catch (error) {
      console.error("Error al obtener estadísticas:", error)
      return { averageRating: 0, totalReviews: 0 }
    }
  }

  async updateReview(
    reviewId: number,
    reviewData: {
      rating: number
      comment: string
      images?: string[]
    },
  ) {
    try {
      const backendData = {
        id: reviewId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        imageUrl: reviewData.images && reviewData.images.length > 0 ? reviewData.images.join("|") : null,
      }

      const res = await axios.put(`${API_URL}/modify`, backendData)
      return {
        ...res.data,
        images: res.data.imageUrl ? res.data.imageUrl.split("|") : [],
      }
    } catch (error) {
      console.error("Error al actualizar la reseña:", error)
      throw error
    }
  }

  async deleteReview(reviewId: number) {
    try {
      console.log(`Intentando eliminar review con ID: ${reviewId}`)
      const response = await axios.delete(`${API_URL}/delete/${reviewId}`)
      console.log("Respuesta del servidor:", response)
      return response.data
    } catch (error) {
      console.error("Error al eliminar la reseña:", error)
      throw error
    }
  }
}