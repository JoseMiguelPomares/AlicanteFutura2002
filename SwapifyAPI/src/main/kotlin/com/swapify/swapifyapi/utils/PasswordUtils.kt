package com.swapify.api.utils

import java.security.MessageDigest

object PasswordUtils {
    fun hashSHA256(password: String): String {
        val bytes = MessageDigest.getInstance("SHA-256").digest(password.toByteArray())
        return bytes.joinToString("") { "%02x".format(it) }
    }

    fun checkPassword(input: String, storedHash: String): Boolean {
        return hashSHA256(input) == storedHash
    }
}
