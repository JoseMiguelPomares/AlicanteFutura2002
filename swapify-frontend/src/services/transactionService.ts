import axios from 'axios';
const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE}/transactions/`;

axios.defaults.headers.common['ngrok-skip-browser-warning'] = '69420'

export class TransactionService {

    //baseUrl = "http://localhost:8080/swapify/transactions/";

    async getAll() {
        return axios.get(API_URL + "getAll").then(res => res.data)
    }

    getByUserId(userId: number){
        return axios.get(API_URL + `getByUserId/${userId}`).then(res => res.data)
    }

    addTransaction(requesterId: number, ownerId: number, itemId: number, finalPrice: number){
        return axios.post(API_URL + `addTransaction/${requesterId}/${ownerId}/${itemId}/${finalPrice}`)
    }

    cancelTransaction(transactionId: number){
        return axios.put(API_URL + `cancelTransaction/${transactionId}`)

    }

    async completePurchase(buyerId: number, itemId: number) {
        return axios.post(this.baseUrl + "completePurchase", {
            buyerId,
            itemId
        }).then(res => res.data);
    }
}