import axios from 'axios';

export class FavoriteService{

    baseUrl = "http://localhost:8080/swapify/transactions/";
    
    getByUserId(userId: number){
        return axios.get(this.baseUrl + `getByUserId/${userId}`).then(res => res.data)
    }

    addFavorite(userId: number, itemId: number){
        return axios.post(this.baseUrl + `addFavorite/${userId}/${itemId}`).then(res => res.data)
    }

    deleteFavorite(userId: number, itemId: number){
        return axios.delete(this.baseUrl + `deleteFavorite/${userId}/${itemId}`).then(res => res.data)
    }
}