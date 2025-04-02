package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.model.entities.Category
import com.swapify.swapifyapi.services.CategoryService
import com.swapify.swapifyapi.services.ItemService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/categories")
@CrossOrigin("*")
class CategoryController {

    @Autowired
    lateinit var categoryService: CategoryService

    //Función para obtener todas las categorías
    @GetMapping("/getAll")
    fun getCategories(): List<Category>{
        return categoryService.getCategories()
    }
}