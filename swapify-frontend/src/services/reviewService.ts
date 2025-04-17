import axios from "axios"

export class ReviewService {
  baseUrl = "http://localhost:8080/swapify/reviews/"

  // Obtener reviews por usuario (el que recibe la review)
  async getReviewsByUserId(userId: number) {
    try {
      const res = await axios.get(`${this.baseUrl}userReviews/${userId}`)
      
      // Transform backend DTO to frontend Review format
      return res.data.map((item: any) => ({
        id: item.id,
        reviewer: {
          id: item.reviewerId,
          name: item.reviewerName,
          imageUrl: item.reviewerImageUrl
        },
        reviewed_id: item.reviewedId,
        rating: item.rating,
        comment: item.comment,
        created_at: item.createdAt
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
      const res = await axios.get(`${this.baseUrl}item/${itemId}`)
      
      // Transform backend DTO to frontend Review format
      return res.data.map((item: any) => ({
        id: item.id,
        reviewer: {
          id: item.reviewerId,
          name: item.reviewerName,
          imageUrl: item.reviewerImageUrl
        },
        reviewed_id: item.reviewedId,
        rating: item.rating,
        comment: item.comment,
        created_at: item.createdAt
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
  }) {
    try {
      // Transform frontend data to backend format
      const backendData = {
        reviewer: { id: reviewData.reviewer_id },
        reviewed: { id: reviewData.reviewed_id },
        rating: reviewData.rating,
        comment: reviewData.comment
      }
      
      const res = await axios.post(`${this.baseUrl}create`, backendData)
      const item = res.data
      
      // Transform response back to frontend format
      return {
        id: item.id,
        reviewer: {
          id: item.reviewer?.id,
          name: item.reviewer?.name,
          imageUrl: item.reviewer?.imageUrl
        },
        reviewed_id: item.reviewed?.id,
        rating: item.rating,
        comment: item.comment,
        created_at: item.createdAt
      }
    } catch (error) {
      console.error("Error al crear la reseña:", error)
      throw error
    }
  }

  // Obtener estadísticas de reviews para un usuario
  async getUserReviewStats(userId: number) {
    try {
      const res = await axios.get(`${this.baseUrl}stats/${userId}`)
      return res.data
    } catch (error) {
      console.error("Error al obtener estadísticas:", error)
      return { averageRating: 0, totalReviews: 0 }
    }
  }
}

