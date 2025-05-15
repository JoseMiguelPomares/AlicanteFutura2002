import axios from 'axios';
const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE}/favorite/`;

axios.defaults.headers.common['ngrok-skip-browser-warning'] = '69420'

export class FavoriteService{

    //baseUrl = "http://localhost:8080/swapify/favorite/";
    
    
    getByUserId(userId: number){
        //return axios.get(this.baseUrl + `getByUserId/${userId}`).then(res => res.data)
        return axios.get(API_URL + `getByUserId/${userId}`, {
            headers: { 'Ngrok-Skip-Browser-Warning': 'true' }
          }).then(res => res.data)
    }

    addFavorite(userId: number, itemId: number){
        //return axios.post(this.baseUrl + `addFavorite/${userId}/${itemId}`).then(res => res.data)
        return axios.post(API_URL + `addFavorite/${userId}/${itemId}`).then(res => res.data)
    }

    deleteFavorite(userId: number, itemId: number){
        //return axios.delete(this.baseUrl + `deleteFavorite/${userId}/${itemId}`).then(res => res.data)
        return axios.delete(API_URL + `deleteFavorite/${userId}/${itemId}`).then(res => res.data)
    }
    
    countFavoritesByItemId(itemId: number): Promise<number> {
        /*return axios.get(this.baseUrl + `countByItemId/${itemId}`)
            .then(res => res.data)
            .catch(error => {
                console.error(`Error counting favorites for item ${itemId}:`, error);
                return 0;
        });*/
        return axios.get(API_URL + `countByItemId/${itemId}`)
            .then(res => res.data)
            .catch(error => {
                console.error(`Error counting favorites for item ${itemId}:`, error);
                return 0;
        });
    }

    getAllFavoritesCount(): Promise<Record<number, number>> {
        /*return axios.get(`${this.baseUrl}count-all`)
            .then(res => res.data)
            .catch(error => {
                console.error("Error counting all favorites:", error);
                return {};
        });*/
        return axios.get(`${API_URL}count-all`)
            .then(res => res.data)
            .catch(error => {
                console.error("Error counting all favorites:", error);
                return {};
        });
    }    
}