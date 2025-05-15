import axios from 'axios';
const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE}/images/`;

axios.defaults.headers.common['ngrok-skip-browser-warning'] = '69420'

export class ImageService {
  //baseUrl = 'http://localhost:8080/swapify/images/';

  /**
   * Sube una imagen al servidor
   * @param file - El archivo de imagen a subir
   * @param onProgress - Función opcional para seguimiento del progreso
   * @returns Promise con la URL de la imagen subida
   */
  async uploadImage(file: File, onProgress?: (progress: number) => void): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw error;
    }
  }
}