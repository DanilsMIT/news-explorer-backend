# News Explorer - Backend

El backend oficial para la aplicación **News Explorer**, una plataforma que permite a los usuarios buscar noticias y guardar sus artículos favoritos en su cuenta personal. Esta API RESTful maneja la autenticación de usuarios, la validación de datos, el registro de actividad y la persistencia de datos en la base de datos.

## Tecnologías Utilizadas

*   **Entorno de ejecución:** Node.js
*   **Framework Web:** Express.js
*   **Base de Datos:** MongoDB con Mongoose (ODM)
*   **Seguridad y Autenticación:** JSON Web Tokens (JWT) y bcryptjs (Hasing de contraseñas)
*   **Validación de Datos:** Celebrate y Joi
*   **Registro de Eventos (Logging):** Winston (request.log y error.log)
*   **Gestión de Entorno:** Dotenv
*   **CORS:** Habilitado para comunicación segura con el frontend

## Funcionalidades Principales

*   **Autenticación y Autorización:** Registro de nuevos usuarios, inicio de sesión seguro y protección de rutas privadas mediante validación de tokens JWT.
*   **Gestión de Usuarios:** Recuperación de la información del perfil del usuario logeado de forma segura.
*   **Gestión de Artículos:** Guardado de artículos de noticias vinculados a un usuario específico y eliminación de artículos guardados.
*   **Manejo Centralizado de Errores:** Captura global de errores de servidor, validaciones de Celebrate y rutas inexistentes.

## Rutas de la API (Endpoints)

### Rutas Públicas
*   `POST /signup`: Registra un nuevo usuario en la base de datos. Requiere `email`, `password` y `name`.
*   `POST /signin`: Verifica las credenciales del usuario y devuelve un token JWT. Requiere `email` y `password`.

### Rutas Protegidas (Requieren encabezado de Autorización `Bearer <token>`)
*   `GET /users/me`: Devuelve la información del usuario autenticado (ID, nombre, correo).
*   `GET /articles`: Devuelve todos los artículos de noticias guardados por el usuario actual.
*   `POST /articles`: Crea y guarda un nuevo artículo. Requiere `keyword`, `title`, `text`, `date`, `source`, `link` e `image`.
*   `DELETE /articles/:articleId`: Elimina un artículo guardado de la base de datos, verificando que el usuario logeado sea el propietario del artículo.

## Instrucciones de Instalación y Ejecución

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/DanilsMIT/news-explorer-backend.git
    cd news-explorer-backend
    ```

2.  **Instalar las dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar las variables de entorno:**
    Crea un archivo `.env` en el directorio raíz del proyecto con las siguientes variables (ajusta según tu entorno de producción):
    ```env
    NODE_ENV=production
    JWT_SECRET=tu_clave_secreta_super_segura
    PORT=3001
    ```

4.  **Iniciar la base de datos:**
    Asegúrate de tener MongoDB ejecutándose localmente en `mongodb://localhost:27017/newsExplorer` o configura tu cadena de conexión a MongoDB Atlas en tus variables.

5.  **Ejecutar el servidor:**
    *   Para desarrollo (con recarga automática si tienes nodemon):
        ```bash
        npm run dev
        ```
    *   Para producción:
        ```bash
        npm run start
        ```
    El servidor estará escuchando en `http://localhost:3001`.