package com.swapify.swapifyapi.utils

import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module
import org.hibernate.Hibernate
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class JacksonConfig {
    @Bean
    fun hibernate6Module(): Hibernate6Module {
        val module = Hibernate6Module()
        // Evita forzar la carga de relaciones lazy si no es necesario
        module.configure(Hibernate6Module.Feature.FORCE_LAZY_LOADING, false)
        return module
    }
}