package com.swapify.swapifyapi.services

import com.swapify.swapifyapi.model.dao.IItemDAO
import com.swapify.swapifyapi.model.dto.ItemDTO
import com.swapify.swapifyapi.model.entities.Item
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ItemService {

    @Autowired
    lateinit var itemDAO: IItemDAO

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
        val items: MutableIterable<Item> = itemDAO.findAll()
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
                    it.user!!.name!!,
                    it.title!!,
                    it.description!!,
                    it.category,
                    it.imageUrl,
                    it.status!!
                )
            }
        }else{
            emptyList()
        }
    }

    //Función para obtener un item por su categoría
    fun getItemsByCategory(category: String): List<ItemDTO>{
        val items: List<Item> = itemDAO.findByCategory(category)
        return if (items.isNotEmpty()){
            items.map {
                ItemDTO(
                    it.user!!.name!!,
                    it.title!!,
                    it.description!!,
                    it.category,
                    it.imageUrl,
                    it.status!!
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
                    it.user!!.name!!,
                    it.title!!,
                    it.description!!,
                    it.category,
                    it.imageUrl,
                    it.status!!
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
                    it.user!!.name.toString(),
                    it.title.toString(),
                    it.description.toString(),
                    it.category,
                    it.imageUrl,
                    it.status.toString()
                )
            }
        } else {
            emptyList()
        }
    }
}