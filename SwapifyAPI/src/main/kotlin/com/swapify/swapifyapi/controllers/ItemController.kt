package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.model.dto.ItemDTO
import com.swapify.swapifyapi.model.dto.ModifyItemDTO
import com.swapify.swapifyapi.model.dto.NewItemDTO
import com.swapify.swapifyapi.model.entities.Item
import com.swapify.swapifyapi.services.ItemService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal

@RestController
@RequestMapping("/items")
@CrossOrigin("*")
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

    //Función para obtener un item por su título
    @GetMapping("/getByTitle/{title}")
    fun getItemsByTitle(@PathVariable title: String): List<ItemDTO>{
        return itemService.getItemsByTitle(title)
    }

    //Función para añadir un item
    @PostMapping("/addItem")
    fun addItem(@RequestBody item: NewItemDTO): ResponseEntity<NewItemDTO> {
        return itemService.addItem(item)
    }

    //Función para para buscar por itemId
    @GetMapping("/getItemById/{itemId}")
    fun getItemById(@PathVariable itemId: Int): Item?{
        return itemService.getItemById(itemId)
    }

    //Función para ordenar por mener precio
    @GetMapping("/getByLowerPrice")
    fun getByLowerPrice(): List<Item>{
        return itemService.getItemByLowerPrice()
    }

    //Función para ordenar por mayor precio
    @GetMapping("/getByHigherPrice")
    fun getByHigherPrice(): List<Item>{
        return itemService.getItemByHigherPrice()
    }

    //Función para obtener items por rango de precio
    @GetMapping("/getByPriceRange/{minPrice}/{maxPrice}")
    fun getByPriceRange(@PathVariable minPrice: BigDecimal, @PathVariable maxPrice: BigDecimal): List<Item>{
        return itemService.getItemsByPriceRange(minPrice, maxPrice)
    }

    //Función para eliminar un item
    @DeleteMapping("/deleteItem/{itemId}")
    fun deleteItem(@PathVariable itemId: Int): ResponseEntity<Void> {
        return itemService.deleteItem(itemId)
    }

    //Función para modificar un item
    @PutMapping("/modifyItem/{itemId}")
    fun modifyItem(@PathVariable itemId: Int, @RequestBody item: ModifyItemDTO): ResponseEntity<ModifyItemDTO> {
        return itemService.updateItem(itemId, item)
    }

    //Función para obtener items añadidos recientemente
    @GetMapping("/getRecentlyAdded")
    fun getRecentlyAdded(): List<ItemDTO> {
        return itemService.getRecentlyAddedItems()
    }
}