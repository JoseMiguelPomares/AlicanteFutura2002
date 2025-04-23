package com.swapify.swapifyapi.controllers

import com.swapify.swapifyapi.services.CloudinaryService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/images")
class UploadImagesController(
    private val cloudinaryService: CloudinaryService
) {

    @PostMapping("/upload")
    fun uploadImage(@RequestParam("file") file: MultipartFile): ResponseEntity<String> {
        val imageUrl = cloudinaryService.uploadFile(file)
        return ResponseEntity.ok(imageUrl)
    }
}
