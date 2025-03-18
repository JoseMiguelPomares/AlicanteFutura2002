package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.model.entities.Item
import com.swapify.swapifyapi.services.ItemService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/items")
class ItemController {

    @Autowired
    lateinit var itemService: ItemService

    //Función para obtener todos los items de un usuario
    @GetMapping("/userItems/{userId}")
    fun getItemsByUserId(@PathVariable userId: Long): List<Item>{
        return itemService.getItemsByUserId(userId)
    }
}