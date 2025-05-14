import axios from 'axios';

export class TransactionService {

    baseUrl = "http://localhost:8080/swapify/transactions/";

    async getAll() {
        return axios.get(this.baseUrl + "getAll").then(res => res.data)
    }

    getByUserId(userId: number) {
        return axios.get(this.baseUrl + `getByUserId/${userId}`).then(res => res.data)
    }

    addTransaction(requesterId: number, ownerId: number, itemId: number, finalPrice: number) {
        return axios.post(this.baseUrl + `addTransaction/${requesterId}/${ownerId}/${itemId}/${finalPrice}`)
    }

    cancelTransaction(transactionId: number) {
        return axios.put(this.baseUrl + `cancelTransaction/${transactionId}`)
    }

    async completePurchase(buyerId: number, itemId: number) {
        return axios.post(this.baseUrl + "completePurchase", {
            buyerId,
            itemId
        }).then(res => res.data);
    }
}