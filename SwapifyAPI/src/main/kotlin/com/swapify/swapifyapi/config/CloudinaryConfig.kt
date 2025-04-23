package com.swapify.swapifyapi.config

import com.cloudinary.Cloudinary
import io.github.cdimascio.dotenv.Dotenv
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class CloudinaryConfig {

    @Bean
    fun cloudinary(): Cloudinary {
        val dotenv = Dotenv.load()
        val cloudinaryUrl = dotenv["CLOUDINARY_URL"]
        return Cloudinary(cloudinaryUrl)
    }
}
