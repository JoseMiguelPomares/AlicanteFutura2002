# Swapify

## PLIEGO DE REQUISITOS TÉCNICOS

### 01. Descripción del Proyecto
La plataforma de trueque digital permitirá a los usuarios intercambiar bienes y servicios sin necesidad de dinero, utilizando un sistema de puntos o créditos. Los usuarios podrán publicar artículos o servicios, negociar intercambios a través de un chat interno y construir su reputación dentro de la comunidad.

El sistema debe ser seguro, fácil de usar y transparente, asegurando que las transacciones sean justas y que los usuarios cumplan con los intercambios acordados. Para garantizar el correcto funcionamiento de la plataforma, se trabajará con **datos ficticios**, con una base de datos que contenga al menos **100 registros en cada apartado**, incluyendo usuarios, productos, transacciones y valoraciones.

---

### 02. Información Relevante

#### Objetivos del Proyecto
- Desarrollar una plataforma escalable que facilite el intercambio de bienes y servicios sin necesidad de dinero.
- Implementar un sistema de puntos/créditos para regular los intercambios y fomentar la equidad en la comunidad.
- Garantizar la seguridad y moderación dentro de la plataforma para evitar fraudes y abusos.
- Crear una experiencia de usuario fluida y accesible en distintos dispositivos.
- Promover la economía circular y la reutilización de productos a través del trueque.

---

### 03. Finalidad
El objetivo principal de la plataforma de trueque digital es **promover el consumo responsable y la reutilización de productos**, fomentando el intercambio justo entre los usuarios sin necesidad de dinero. A través de un sistema de puntos y créditos, se busca facilitar los intercambios de manera **equitativa, segura y accesible** para toda la comunidad.

Los participantes tienen **total libertad** para implementar cualquier mejora, funcionalidad adicional o idea innovadora que consideren beneficiosa para la plataforma. Cualquier optimización en la experiencia de usuario, mejoras en la seguridad, integración con nuevas tecnologías o funcionalidades que aporten valor al sistema serán altamente valoradas. Estas mejoras serán **tenidas en cuenta en la evaluación final**, destacando aquellas propuestas que demuestren **creatividad, eficiencia y un impacto positivo en la escalabilidad del proyecto.**

---

### 04. Requisitos Técnicos

#### 1. Frontend (Interfaz de Usuario)
- Lenguajes y frameworks recomendados: **React.js, Vue.js o Angular** para una experiencia de usuario fluida y responsiva.
- Uso de frameworks CSS como **Tailwind CSS, Bootstrap o Material UI** para garantizar una interfaz moderna y fácil de navegar.
- Implementación de autenticación con **Firebase Authentication o Auth0** para un inicio de sesión seguro.
- El **diseño** de la plataforma debe estar centrado en la experiencia del usuario **(UX)**, garantizando una interfaz intuitiva, accesible y adaptable que facilite la interacción y ofrezca una navegación fluida y atractiva.

#### 2. Backend (Gestión de Datos y Lógica de Negocios)
- Lenguajes recomendados: **Node.js con Express.js, Python con Django/Flask o Java con Spring Boot.**
- Base de datos relacional (**PostgreSQL, MySQL**) o NoSQL (**MongoDB, Firebase Firestore**), dependiendo de la escalabilidad deseada.
- Servicios en la nube como **AWS, Google Cloud o Firebase** para alojamiento y gestión de almacenamiento de datos.

#### 3. Seguridad y Moderación
- Implementación de **filtros anti-fraude y validación de caracteres** que detecten imágenes o textos sospechosos antes de su publicación.
- Uso de **cifrado de datos sensibles** con **bcrypt.js para contraseñas y JWT para autenticación de usuarios.**
- **Monitorización de transacciones** para evitar abusos del sistema de créditos y detección de patrones de comportamiento sospechosos.
- **Sistema de reportes** y posibilidad de **suspensión o baneo de usuarios** que incumplan las normas de la plataforma.

**Como opción adicional**, los participantes pueden desplegar la plataforma en internet utilizando servicios de hosting en la nube como **Vercel, Netlify, Firebase Hosting, AWS, o Heroku**, asegurando que el sistema sea accesible en un entorno real. La implementación en línea permitirá evaluar la estabilidad, rendimiento y accesibilidad del proyecto en condiciones reales de uso. Se valorará positivamente en la evaluación final el hecho de que el proyecto esté disponible en la web, ya que esto demostrará habilidades en **despliegue, configuración de servidores y gestión de bases de datos en producción**, aspectos clave en el desarrollo de aplicaciones modernas.

---

### 05. Seguimiento
El seguimiento del proyecto se realizará mediante **reuniones periódicas** donde los participantes deberán presentar el avance y resolver dudas con los responsables del proyecto. 
- Las reuniones se realizarán con una periodicidad **semanal**.
- Se establecerán hitos de desarrollo donde se revisará la **usabilidad, estabilidad y seguridad de la plataforma**. 
- Se fomentará la **colaboración en equipo** y la presentación de propuestas innovadoras para mejorar el producto final.

---

### 06. Entrega del Proyecto (PITCH I)

#### Presentación del MVP - 16 de mayo
En esta fase, los participantes deberán realizar una **presentación** del proyecto mostrando los avances alcanzados hasta la fecha. La exposición deberá ser clara y estructurada, destacando las funcionalidades implementadas, los retos enfrentados y las próximas mejoras a desarrollar.

La duración de la presentación será de **15 a 20 minutos**, tiempo en el cual los participantes deberán demostrar el estado actual del proyecto y justificar las decisiones técnicas tomadas hasta el momento. **Se valorará la claridad en la comunicación, la viabilidad del desarrollo y el alineamiento con los objetivos planteados en el pliego de requisitos.**

---

### 07. Entrega del Proyecto (PITCH II)

#### Entrega del MVP - 30 de mayo
En esta fase, los participantes deberán presentar la versión final del MVP, asegurándose de que el proyecto esté completamente desarrollado con **todas las funcionalidades obligatorias** y adicionales implementadas. La plataforma deberá estar en un estado funcional y listo para su presentación final.

En caso de que falte alguna funcionalidad esencial o los participantes deseen realizar mejoras adicionales, tendrán **una semana extra** para realizar los ajustes necesarios antes de la presentación definitiva. La exposición deberá durar entro **15 y 20 minutos**, mostrando el estado actual del proyecto, su funcionalidad y cualquier optimización Implementada. 

- En la presentación final, los participantes deberán entregar:
  - **Código fuente completo** del proyecto.
  - **Instrucciones detalladas para la instalación y despliegue** de la plataforma.
  - **Demo funcional**, donde se muestren las características principales y la experiencia del usuario.
  - **Documentación técnica y manual de usuario**, que expliquen el uso y funcionamiento del sistema.

La presentación deberá ser clara, estructurada y ajustarse al tiempo establecido, asegurando que se demuestren las funcionalidades clave de la plataforma.
