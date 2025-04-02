package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.IReviewDAO
import com.swapify.swapifyapi.model.entities.Review
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ReviewService {

    @Autowired
    lateinit var reviewDAO: IReviewDAO

    //Función para obtener las reviews de un item
    fun getReviewsByItem(itemId: Int): List<Review> {
        return emptyList()
    }
}