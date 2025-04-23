package com.swapify.swapifyapi.services

import com.cloudinary.Cloudinary
import com.cloudinary.utils.ObjectUtils
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class CloudinaryService(
    private val cloudinary: Cloudinary
) {
    fun uploadFile(file: MultipartFile): String {
        val uploadResult = cloudinary.uploader().upload(file.bytes, ObjectUtils.emptyMap())
        return uploadResult["secure_url"] as String
    }
}
