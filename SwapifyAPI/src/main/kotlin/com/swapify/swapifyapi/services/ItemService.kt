package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.ICategoryDAO
import com.swapify.swapifyapi.model.dao.IItemDAO
import com.swapify.swapifyapi.model.dto.ItemDTO
import com.swapify.swapifyapi.model.dto.CategoryDTO
import com.swapify.swapifyapi.model.dto.UserDTO
import com.swapify.swapifyapi.model.dto.ModifyItemDTO
import com.swapify.swapifyapi.model.dto.NewItemDTO
import com.swapify.swapifyapi.model.entities.Category
import com.swapify.swapifyapi.model.entities.Item
import com.swapify.swapifyapi.model.entities.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.Instant
import java.util.*

@Service
class ItemService {

    @Autowired
    lateinit var itemDAO: IItemDAO
    @Autowired
    lateinit var categoryDAO: ICategoryDAO

    //Función para obtener todos los items de un usuario
    fun getItemsByUserId(userId: Long): List<Item>{
        val items: List<Item> = itemDAO.findByUserIdWithAll(userId)
        return if (items.isNotEmpty()){
            items
        } else {
            emptyList()
        }
    }

    //Función para obtener todos los items
    fun getItems(): List<Item>{
        val items: List<Item> = itemDAO.findAllItems()
        return if (items.iterator().hasNext()){
            items.toList()
        } else {
            emptyList()
        }
    }

    //Función para obtener todos los items por un DTO
    fun getItemsByDTO(): List<ItemDTO>{
        val items: List<Item> = itemDAO.findAllItems()
        return if (items.iterator().hasNext()){
            items.map {
                ItemDTO(
                    it.id!!,
                    UserDTO(
                        it.user!!.id!!,
                        it.user!!.name!!,
                        it.user!!.imageUrl
                    ),
                    it.title!!,
                    it.description!!,
                    it.itemCondition,
                    it.location!!,
                    it.latitude!!,
                    it.longitude!!,
                    it.price!!,
                    CategoryDTO(
                        it.category!!.id!!,
                        it.category!!.name!!
                    ),
                    it.imageUrl,
                    it.status!!,
                    it.createdAt
                )
            }
        }else{
            emptyList()
        }
    }

    //Función para obtener una lista de items por su categoría
    fun getItemsByCategory(category: String): List<ItemDTO>{
        val items: List<Item> = itemDAO.findByCategory(category)
        return if (items.isNotEmpty()){
            items.map {
                ItemDTO(
                    it.id!!,
                    UserDTO(
                        it.user!!.id!!,
                        it.user!!.name!!,
                        it.user!!.imageUrl
                    ),
                    it.title!!,
                    it.description!!,
                    it.itemCondition,
                    it.location!!,
                    it.latitude!!,
                    it.longitude!!,
                    it.price!!,
                    CategoryDTO(
                        it.category!!.id!!,
                        it.category!!.name!!,
                    ),
                    it.imageUrl,
                    it.status!!,
                    it.createdAt
                )
            }
        } else {
            emptyList()
        }
    }

    //Función para obtener un item por su categoría y su id de usuario
    fun getItemsByCategoryAndUserId(category: String, id: Long): List<ItemDTO>{
        val items: List<Item> = itemDAO.findByCategoryAndId(category, id)
        return if (items.isNotEmpty()){
            items.map {
                ItemDTO(
                    it.id!!,
                    UserDTO(
                        it.user!!.id!!,
                        it.user!!.name!!,
                        it.user!!.imageUrl
                    ),
                    it.title!!,
                    it.description!!,
                    it.itemCondition,
                    it.location!!,
                    it.latitude!!,
                    it.longitude!!,
                    it.price!!,
                    CategoryDTO(
                        it.category!!.id!!,
                        it.category!!.name!!
                    ),
                    it.imageUrl,
                    it.status!!,
                    it.createdAt
                )
            }
        } else {
            emptyList()
        }
    }

    //Función para obtener un item por su nombre
    fun getItemsByTitle(title: String): List<ItemDTO>{
        val items: List<Item> = itemDAO.findByTitle(title)
        return if (items.isNotEmpty()){
            items.map {
                ItemDTO(
                    it.id!!,
                    UserDTO(
                        it.user!!.id!!,
                        it.user!!.name!!,
                        it.user!!.imageUrl
                    ),
                    it.title.toString(),
                    it.description.toString(),
                    it.itemCondition,
                    it.location!!,
                    it.latitude!!,
                    it.longitude!!,
                    it.price!!,
                    CategoryDTO(
                        it.category!!.id!!,
                        it.category!!.name!!
                    ),
                    it.imageUrl,
                    it.status.toString(),
                    it.createdAt  // Added createdAt field
                )
            }
        } else {
            emptyList()
        }
    }

    //Función para añadir un producto nuevo
    fun addItem(newItemDTO: NewItemDTO): ResponseEntity<NewItemDTO>{
        val item = Item()
        val optionalCategory: Optional<Category> = categoryDAO.findById(newItemDTO.categoryId)
        item.user = User()
        item.category = Category()


        item.user!!.id = newItemDTO.userId
        item.title = newItemDTO.title
        item.description = newItemDTO.description
        if (optionalCategory.isPresent){
            item.category = optionalCategory.get()
        }
        item.imageUrl = newItemDTO.imageUrl
        item.price = newItemDTO.price
        item.itemCondition = newItemDTO.itemCondition
        item.location = newItemDTO.location
        item.latitude = newItemDTO.latitude
        item.longitude = newItemDTO.longitude
        item.status = "Available"
        item.createdAt = Instant.now()

        itemDAO.save(item)
        return ResponseEntity(HttpStatus.CREATED)
    }

    //Función para buscar por itemId
    fun getItemById(itemId: Int): Item? {
        return itemDAO.findById(itemId).orElse(null)
    }

    //Función para ordenar por precio menor
    fun getItemByLowerPrice(): List<Item>{
        val items: List<Item> = itemDAO.findByLowerPrice()
        return if (items.isNotEmpty()){
            items
        } else {
            emptyList()
        }
    }

    //Función para ordenar por precio mayor
    fun getItemByHigherPrice(): List<Item>{
        val items: List<Item> = itemDAO.findByHigherPrice()
        return if (items.isNotEmpty()){
            items
        } else {
            emptyList()
        }
    }

    //Función para obtener los items por un rango de precios
    fun getItemsByPriceRange(minPrice: BigDecimal, maxPrice: BigDecimal): List<Item>{
        val items: List<Item> = itemDAO.findByPriceRange(minPrice, maxPrice)
        return if (items.isNotEmpty()){
            items
        } else {
            emptyList()
        }
    }

    //Función para borrar un item
    fun deleteItem(itemId: Int): ResponseEntity<Void> {
        return if (itemDAO.existsById(itemId)) {
            itemDAO.deleteById(itemId)
            ResponseEntity(HttpStatus.NO_CONTENT)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    //Función para modificar un item
    fun updateItem(itemId: Int, itemDTO: ModifyItemDTO): ResponseEntity<ModifyItemDTO> {
        val optionalItem: Optional<Item> = itemDAO.findById(itemId)
        if (optionalItem.isPresent) {
            val item: Item = optionalItem.get()

            // Validar el valor de itemCondition
            val allowedConditions = listOf("nuevo", "como_nuevo", "bueno", "aceptable", "usado")
            if (!allowedConditions.contains(itemDTO.itemCondition?.lowercase())) {
                // Retorna un error si el valor no es válido
                return ResponseEntity(HttpStatus.BAD_REQUEST)
            }

            // Actualizamos la categoría usando el repositorio de categorías
            val optionalCategory: Optional<Category> = categoryDAO.findById(itemDTO.categoryId)
            if (optionalCategory.isPresent) {
                item.category = optionalCategory.get()
            } else {
                return ResponseEntity(HttpStatus.BAD_REQUEST)
            }

            item.title = itemDTO.title
            item.description = itemDTO.description
            item.imageUrl = itemDTO.imageUrl
            item.price = itemDTO.price
            item.itemCondition = itemDTO.itemCondition  // Ya validado
            item.location = itemDTO.location

            itemDAO.save(item)
            return ResponseEntity(itemDTO, HttpStatus.OK)
        } else {
            return ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    //Función para obtener los items añadidos recientemente
    fun getRecentlyAddedItems(): List<ItemDTO> {
        val items: List<Item> = itemDAO.findByItemTime()
        return if (items.isNotEmpty()) {
            items.map {
                ItemDTO(
                    it.id!!,
                    UserDTO(
                        it.user!!.id!!,
                        it.user!!.name!!,
                        it.user!!.imageUrl
                    ),
                    it.title!!,
                    it.description!!,
                    it.itemCondition,
                    it.location!!,
                    it.latitude!!,
                    it.longitude!!,
                    it.price!!,
                    CategoryDTO(
                        it.category!!.id!!,
                        it.category!!.name!!
                    ),
                    it.imageUrl,
                    it.status!!,
                    it.createdAt
                )
            }
        } else {
            emptyList()
        }
    }

    //Función para obtener items dentro de un radio de una ubicación
    fun getInRadius(lat: Double, lng: Double, radius: Double): List<ItemDTO> {
        val itemList: List<Item> = itemDAO.findByDistance(lat, lng, radius)

        return if (itemList.isNotEmpty()) {
            itemList.map {
                ItemDTO(
                    it.id!!,
                    UserDTO(
                        it.user!!.id!!,
                        it.user!!.name!!,
                        it.user!!.imageUrl
                    ),
                    it.title!!,
                    it.description!!,
                    it.itemCondition,
                    it.location!!,
                    it.latitude!!,
                    it.longitude!!,
                    it.price!!,
                    CategoryDTO(
                        it.category!!.id!!,
                        it.category!!.name!!
                    ),
                    it.imageUrl,
                    it.status!!,
                    it.createdAt
                )
            }
        } else {
            emptyList()
        }
    }
}