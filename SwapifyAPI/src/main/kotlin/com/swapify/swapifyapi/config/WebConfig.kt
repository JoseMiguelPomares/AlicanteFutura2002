package com.swapify.swapifyapi.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter

@Configuration
class WebConfig {

    @Bean
    fun corsFilter(): CorsFilter {
        val config = CorsConfiguration().apply {
            allowedOrigins = listOf("http://localhost:5173")
            allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
            allowedHeaders = listOf("*")
            allowCredentials = true
            maxAge = 3600
        }

        val source = UrlBasedCorsConfigurationSource().apply {
            // Para tu API REST
            registerCorsConfiguration("/swapify/**", config)
            // Para todas las sub‑rutas de SockJS (/ws-chat/info, /ws-chat/xhr, etc)
            registerCorsConfiguration("/swapify/ws-chat/**", config)
        }
        return CorsFilter(source)
    }

}
