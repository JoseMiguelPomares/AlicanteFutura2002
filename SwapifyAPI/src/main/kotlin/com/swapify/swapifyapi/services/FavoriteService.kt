package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.IFavoriteDAO
import com.swapify.swapifyapi.model.entities.Favorite
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class FavoriteService {

    @Autowired
    lateinit var favoriteDAO: IFavoriteDAO

    fun getFavoritesByUserId(userId: Long): List<Favorite>{
        val favoriteList: List<Favorite> = favoriteDAO.findByUserId(userId)
        return if (favoriteList.isNotEmpty()){
            favoriteList
        } else {
            emptyList()
        }
    }


}