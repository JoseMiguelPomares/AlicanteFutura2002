package com.swapify.swapifyapi.services

import com.google.cloud.vision.v1.*
import com.google.protobuf.ByteString
import com.swapify.swapifyapi.exception.UnsafeImageException
import org.springframework.stereotype.Service
import java.io.InputStream
import java.net.URL

@Service
class GoogleVisionService {

    fun isImageSafe(imageUrl: String?): Boolean {
        if (imageUrl.isNullOrEmpty()) {
            return true // Si no hay URL, consideramos que es seguro (o no hay nada que analizar)
        }

        try {
            ImageAnnotatorClient.create().use { vision ->
                val imgBytes = fetchImageBytes(imageUrl)
                val img = Image.newBuilder().setContent(imgBytes).build()
                val safeSearchFeature = Feature.newBuilder().setType(Feature.Type.SAFE_SEARCH_DETECTION).build()
                val labelDetectionFeature = Feature.newBuilder().setType(Feature.Type.LABEL_DETECTION).setMaxResults(15).build() // Ajusta maxResults según sea necesario

                val request = AnnotateImageRequest.newBuilder()
                    .addFeatures(safeSearchFeature)
                    .addFeatures(labelDetectionFeature)
                    .setImage(img)
                    .build()

                val response = vision.batchAnnotateImages(listOf(request))
                val annotationResponse = response.responsesList[0] // Get the first (and only) response

                // Comprobar si hubo un error en la respuesta de la anotación
                if (annotationResponse.hasError()) {
                    throw UnsafeImageException("Error en la anotación de la imagen por Google Vision API: ${annotationResponse.error.message}")
                }

                // 1. Comprobación de SafeSearch (ya modificada para ser más estricta)
                val safeSearchAnnotation = annotationResponse.safeSearchAnnotation
                val isUnsafeBySafeSearch = (
                    safeSearchAnnotation.adult == Likelihood.POSSIBLE || safeSearchAnnotation.adult == Likelihood.LIKELY || safeSearchAnnotation.adult == Likelihood.VERY_LIKELY ||
                    safeSearchAnnotation.spoof == Likelihood.LIKELY || safeSearchAnnotation.spoof == Likelihood.VERY_LIKELY ||
                    safeSearchAnnotation.medical == Likelihood.LIKELY || safeSearchAnnotation.medical == Likelihood.VERY_LIKELY || // Considerar si 'medical' debe ser tan estricto
                    safeSearchAnnotation.violence == Likelihood.LIKELY || safeSearchAnnotation.violence == Likelihood.VERY_LIKELY ||
                    safeSearchAnnotation.racy == Likelihood.POSSIBLE || safeSearchAnnotation.racy == Likelihood.LIKELY || safeSearchAnnotation.racy == Likelihood.VERY_LIKELY
                )

                if (isUnsafeBySafeSearch) {
                    return false // Insegura por SafeSearch
                }

                // 2. Comprobación de etiquetas (labels)
                val labelAnnotations = annotationResponse.labelAnnotationsList
                // Esta lista debería ser configurable y más extensa en un entorno de producción.
                val forbiddenKeywords = setOf(
                    "penis", "pene", "cock", "dick", "verga", "polla",
                    "vagina", "pussy", "coño", "chocho",
                    "nude", "desnudo", "naked", "desnuda",
                    "porn", "porno", "xxx", "hardcore",
                    "sex", "sexual", "erotic", "erotico",
                    "gore", "blood", "bloody", "sangre"
                    // Añade más palabras clave según sea necesario, considerando diferentes idiomas.
                )

                val containsForbiddenLabel = labelAnnotations.any { label ->
                    forbiddenKeywords.any { keyword -> label.description.contains(keyword, ignoreCase = true) }
                }

                if (containsForbiddenLabel) {
                    return false // Insegura por etiqueta prohibida
                }

                return true // Segura si pasa ambas comprobaciones
            }
        } catch (e: Exception) {
            // Manejar excepciones, por ejemplo, si la URL no es válida o hay problemas de red
            // Por simplicidad, aquí lanzamos una excepción personalizada, pero podrías querer un manejo más específico
            throw UnsafeImageException("Error al analizar la imagen con Google Vision API: ${e.message}")
        }
    }

    private fun fetchImageBytes(imageUrl: String): ByteString {
        val url = URL(imageUrl)
        var inputStream: InputStream? = null
        return try {
            inputStream = url.openStream()
            ByteString.readFrom(inputStream)
        } finally {
            inputStream?.close()
        }
    }
}