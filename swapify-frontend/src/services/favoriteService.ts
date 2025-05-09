import axios from 'axios';

export class FavoriteService{

    baseUrl = "http://localhost:8080/swapify/favorite/";
    
    getByUserId(userId: number){
        return axios.get(this.baseUrl + `getByUserId/${userId}`).then(res => res.data)
    }

    addFavorite(userId: number, itemId: number){
        return axios.post(this.baseUrl + `addFavorite/${userId}/${itemId}`).then(res => res.data)
    }

    deleteFavorite(userId: number, itemId: number){
        return axios.delete(this.baseUrl + `deleteFavorite/${userId}/${itemId}`).then(res => res.data)
    }
    
    countFavoritesByItemId(itemId: number): Promise<number> {
        return axios.get(this.baseUrl + `countByItemId/${itemId}`)
            .then(res => res.data)
            .catch(error => {
                console.error(`Error counting favorites for item ${itemId}:`, error);
                return 0;
            });
    }

    getAllFavoritesCount(): Promise<Record<number, number>> {
        return axios.get(`${this.baseUrl}count-all`)
            .then(res => res.data)
            .catch(error => {
                console.error("Error counting all favorites:", error);
                return {};
            });
    }    
}