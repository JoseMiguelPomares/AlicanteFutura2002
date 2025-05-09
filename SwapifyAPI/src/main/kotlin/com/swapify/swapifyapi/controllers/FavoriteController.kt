package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.model.entities.Favorite
import com.swapify.swapifyapi.services.FavoriteService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/favorite")
class FavoriteController {

    @Autowired
    lateinit var favoriteService: FavoriteService

    //Función para obtener todos los favoritos de un usuario
    @GetMapping("/getByUserId/{userId}")
    fun getFavoritesByUserId(@PathVariable userId: Int): List<Favorite>{
        return favoriteService.getFavoritesByUserId(userId)
    }

    //Función para añadir favoritos
    @PostMapping("/addFavorite/{userId}/{itemId}")
    fun addFavorite(@PathVariable userId: Int, @PathVariable itemId: Int): Favorite {
        return favoriteService.addFavorite(userId, itemId)
    }

    //Función para eliminar favoritos
    @DeleteMapping("/deleteFavorite/{userId}/{itemId}")
    fun deleteFavorite(@PathVariable userId: Int, @PathVariable itemId: Int): Boolean {
        return favoriteService.deleteFavorite(userId, itemId)
    }

    // Función para contar los favoritos de un item
    @GetMapping("/countByItemId/{itemId}")
    fun countFavoritesByItemId(@PathVariable itemId: Int): Int {
        return favoriteService.countFavoritesByItemId(itemId)
    }
    
    // Función para contar los favoritos de múltiples items
    @GetMapping("/count-all")
fun countAllFavorites(): Map<Int, Int> {
    return favoriteService.countAllFavorites()
}

}