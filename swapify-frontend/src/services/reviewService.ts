import { Review } from '../pages/PaginaProducto';
import axios from 'axios';

export class ReviewService {
  
    baseUrl = "http://localhost:8080/swapify/reviews/";

  async getReviewsByItemId(itemId: number): Promise<Review[]> {
    try {
      return await axios.get(this.baseUrl + `itemId=${itemId}`)
        .then(res => res.data)
        .catch(error => {
          console.error('Error al obtener reseñas:', error.response?.data);
          return [];
        });
    } catch (error) {
      console.error('Error inesperado:', error);
      return [];
    }
  }

  async createReview(review: Review): Promise<Review> {
    try {
      return await axios.post(`${this.baseUrl}/reviews`, review)
        .then(res => res.data)
        .catch(error => {
          console.error('Error en la respuesta:', error.response?.data);
          throw new Error(error.response?.data?.message || 'Error creating review');
        });
    } catch (error) {
      console.error('Error inesperado:', error);
      throw error;
    }
  }
}