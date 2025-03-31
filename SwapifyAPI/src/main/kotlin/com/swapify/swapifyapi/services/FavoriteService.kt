package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.IFavoriteDAO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class FavoriteService {

    @Autowired
    lateinit var favoriteDAO: IFavoriteDAO
}