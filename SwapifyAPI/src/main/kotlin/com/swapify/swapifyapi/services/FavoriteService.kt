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
        val existing = favoriteDAO.findByUserIdAndItemId(userId, itemId)
        if (existing != null) return existing
    
        val user = userDAO.findById(userId).orElseThrow { Exception("User not found") }
        val item = itemDAO.findById(itemId).orElseThrow { Exception("Item not found") }
    
        return favoriteDAO.save(Favorite().apply {
            this.user = user
            this.item = item
        })
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
    
    //Función para contar los favoritos de un item
    fun countFavoritesByItemId(itemId: Int): Int {
        return favoriteDAO.countByItemId(itemId)
    }
    
    //Función para contar los favoritos de múltiples items
    fun countAllFavorites(): Map<Int, Int> {
        val results = favoriteDAO.countAllFavorites()
        val countMap = mutableMapOf<Int, Int>()
    
        results.forEach { result ->
            val itemId = (result["itemId"] as Number).toInt()
            val count = (result["count"] as Number).toInt()
            countMap[itemId] = count
        }
    
        return countMap
    }
    
}