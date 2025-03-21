package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.model.dto.ItemDTO
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

    //Función para obtener todos los items
    @GetMapping("/getAll")
    fun getItems(): List<Item>{
        return itemService.getItems()
    }

    //Función para obtener todos los items por un DTO
    @GetMapping("/getAllDTO")
    fun getItemsDTO(): List<ItemDTO>{
        return itemService.getItemsByDTO()
    }

    //Función para obtener todos los items por categoría
    @GetMapping("/getByCategory/{category}")
    fun getItemsByCategory(@PathVariable category: String): List<ItemDTO>{
        return itemService.getItemsByCategory(category)
    }

    //Función para obtener un item por su categoría y su id de usuario
    @GetMapping("/getByCategoryAndId/{category}/{id}")
    fun getItemsByCategoryAndId(@PathVariable category: String, @PathVariable id: Long): List<ItemDTO>{
        return itemService.getItemsByCategoryAndUserId(category, id)
    }
}