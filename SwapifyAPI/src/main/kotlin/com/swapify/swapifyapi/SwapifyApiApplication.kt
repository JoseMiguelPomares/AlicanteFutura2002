package com.swapify.swapifyapi

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@SpringBootApplication
class SwapifyApiApplication {

    @Bean
    fun corsConfigurer(): WebMvcConfigurer {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                // Configura CORS globalmente para todas las rutas
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5173")
                }
        }
    }
}

fun main(args: Array<String>) {
    runApplication<SwapifyApiApplication>(*args)
}
