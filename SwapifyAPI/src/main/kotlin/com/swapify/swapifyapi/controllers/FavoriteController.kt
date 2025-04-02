package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.model.entities.Favorite
import com.swapify.swapifyapi.services.FavoriteService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/favorite")
class FavoriteController {

    @Autowired
    lateinit var favoriteService: FavoriteService

    //Función para obtener todos los favoritos de un usuario
    @GetMapping("/getByUserId/{userId}")
    fun getFavoritesByUserId(@PathVariable userId: Long): List<Favorite>{
        return favoriteService.getFavoritesByUserId(userId)
    }
}