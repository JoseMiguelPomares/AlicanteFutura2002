package com.swapify.swapifyapi.model.entities

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import org.hibernate.annotations.DynamicInsert
import java.time.Instant

@Entity
@Table(name = "users")
@DynamicInsert
open class User {
    @Id
    @ColumnDefault("nextval('users_id_seq')")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    open var id: Int? = null

    @Column(name = "name", nullable = false, length = 100)
    open var name: String? = null

    @Column(name = "email", nullable = false, length = 100)
    open var email: String? = null

    @Column(name = "password_hash", length = Integer.MAX_VALUE)
    open var passwordHash: String? = null // Hacer opcional para usuarios sociales

    @Column(name = "location")
    open var location: String? = null

    @ColumnDefault("100")
    @Column(name = "credits")
    open var credits: Int? = null

    @ColumnDefault("5.0")
    @Column(name = "reputation")
    open var reputation: Double? = null

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    open var createdAt: Instant? = null

    // Nuevo campo para almacenar el ID de Google
    @Column(name = "social_id", unique = true, length = 100)
    open var socialId: String? = null

    // Nuevo campo para almacenar la URL de la imagen del usuario
    @Column(name = "image_url", length = 255)
    open var imageUrl: String? = null
}