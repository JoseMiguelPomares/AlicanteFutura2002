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
            // tu front
            allowedOrigins = listOf("http://localhost:5173")
            // métodos que vas a usar (incluye OPTIONS para el preflight)
            allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
            // habilita el envío de cookies/credenciales
            allowCredentials = true
            // headers permitidos en la petición
            allowedHeaders = listOf("*")
            // cuánto cachear preflight
            maxAge = 3600
        }
        // Aplica a TODO: REST y SockJS fallback “/swapify/**”
        val source = UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/swapify/**", config)
        }
        return CorsFilter(source)
    }
}
