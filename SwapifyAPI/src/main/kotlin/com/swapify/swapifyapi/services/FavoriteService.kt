package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.IFavoriteDAO
import com.swapify.swapifyapi.model.dao.IItemDAO
import com.swapify.swapifyapi.model.dao.IUserDAO
import com.swapify.swapifyapi.model.entities.Favorite
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class FavoriteService {

    @Autowired
    lateinit var favoriteDAO: IFavoriteDAO
    @Autowired
    lateinit var userDAO: IUserDAO
    @Autowired
    lateinit var itemDAO: IItemDAO

    //Función para obtener todos los favoritos de un usuario
    fun getFavoritesByUserId(userId: Int): List<Favorite>{
        val favoriteList: List<Favorite> = favoriteDAO.findByUserId(userId)
        return if (favoriteList.isNotEmpty()){
            favoriteList
        } else {
            emptyList()
        }
    }

    //Función para añadir favoritos
    fun addFavorite(userId: Int, itemId: Int): Favorite {
        val favorite = Favorite()
        val optionalUser = userDAO.findById(userId)
        val optionalItem = itemDAO.findById(itemId)
        if (optionalUser.isPresent && optionalItem.isPresent) {
            val user = optionalUser.get()
            val item = optionalItem.get()
            favorite.user = user
            favorite.item = item
            return favoriteDAO.save(favorite)
        }
        else {
            throw Exception("User or Item not found")
        }
    }

    //Función para eliminar favoritos
    fun deleteFavorite(userId: Int, itemId: Int): Boolean {
        val favorite = favoriteDAO.findByUserIdAndItemId(userId, itemId)
        return if (favorite != null) {
            favoriteDAO.delete(favorite)
            true
        } else {
            false
        }
    }
}