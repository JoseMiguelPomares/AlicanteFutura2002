# SwapifyAPI

Este es el backend del proyecto Swapify, desarrollado con Java y Spring Boot.

## Requisitos

- Java 11 o superior
- Maven
- PostgreSQL

## Configuración

1. Clona el repositorio.
2. Configura la base de datos PostgreSQL y actualiza las credenciales en `src/main/resources/application.properties`.
3. Ejecuta `mvn clean install` para compilar el proyecto.

## Ejecución

Ejecuta el siguiente comando para iniciar el servidor:

```
mvn spring-boot:run
```

El servidor estará disponible en `http://localhost:8080/swapify`.