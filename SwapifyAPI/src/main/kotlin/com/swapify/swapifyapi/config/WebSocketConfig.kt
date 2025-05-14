package com.swapify.swapifyapi.config

import org.springframework.context.annotation.Configuration
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer

@Configuration
@EnableWebSocketMessageBroker
class WebSocketConfig : WebSocketMessageBrokerConfigurer {

    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        registry
            // Solo ruta “/ws-chat”, el /swapify lo aplica automáticamente server.servlet.context-path
            .addEndpoint("/ws-chat")
            // desde tu front en http://localhost:5173
            .setAllowedOrigins("http://localhost:5173")
            .withSockJS()
    }

    override fun configureMessageBroker(registry: MessageBrokerRegistry) {
        // broker en memoria para temas “/topic”
        registry.enableSimpleBroker("/topic")
        // prefijo para @MessageMapping
        registry.setApplicationDestinationPrefixes("/app")
    }
}
