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
            .addEndpoint("/ws-chat")
            .setAllowedOrigins("*")
            .withSockJS()
    }

    override fun configureMessageBroker(reg: MessageBrokerRegistry) {
        reg.enableSimpleBroker("/topic") // broker en memoria
        reg.setApplicationDestinationPrefixes("/swapify")
    }
}