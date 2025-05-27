# Lapsus Wave

**Lapsus Wave** es una moderna plataforma de streaming musical desarrollada con una arquitectura completa basada en **React (frontend)** y **Node.js/Express + MongoDB (backend)**. Ofrece funcionalidades como streaming en tiempo real, manejo de playlists, estadísticas y sistema de usuarios con roles administrativos.

---

## ✨ Características principales

* Streaming musical en tiempo real con Socket.IO
* Panel administrativo para gestión de canciones, álbumes y usuarios
* Autenticación OAuth con Clerk
* Subida de archivos a Cloudinary
* Estadísticas automáticas con tareas programadas (cronjobs)
* Interfaz amigable con componentes reutilizables y estilos responsivos

---

## 📁 Estructura del proyecto

```
Lapsus-Wave
├── backend
│   ├── src
│   │   ├── controller         # Controladores lógicos (admin, auth, albums, playlists, etc.)
│   │   ├── lib                # Librerías de conexión (Cloudinary, DB, Socket)
│   │   ├── middleware         # Middleware para Clerk y otras verificaciones
│   │   ├── models             # Modelos de MongoDB
│   │   ├── routes             # Rutas para la API REST
│   │   ├── seeds              # Scripts para poblar datos de prueba
│   │   └── index.js           # Punto de entrada principal del backend
├── frontend
│   ├── src
│   │   ├── components         # Componentes de UI (botones, topbar, listas, etc.)
│   │   ├── pages              # Páginas del sitio (home, dashboard, playlists)
│   │   ├── stores             # Zustand para manejo de estado global
│   │   ├── lib                # Funciones auxiliares
│   │   └── App.tsx            # App principal
│   └── index.html            # HTML base
```

---

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/usuario/lapsus-wave.git
cd lapsus-wave
```

### 2. Instalar dependencias

```bash
npm install --prefix backend
npm install --prefix frontend
```

### 3. Configurar variables de entorno (`.env` en `/backend`):

```env
PORT=5000
MONGODB_URI=<tu_uri>
CLOUDINARY_CLOUD_NAME=<nombre>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
CLERK_SECRET_KEY=<clave_clerk>
```

### 4. Ejecutar backend y frontend

```bash
npm run dev --prefix backend
npm start --prefix frontend
```

---

## 💡 Detalle de carpetas y archivos importantes

### Backend - `src/controller`

* `auth.controller.js`: Crea o verifica usuarios al hacer login con Clerk.
* `user.controller.js`: Gestiona usuarios y mensajes (para funcionalidades tipo chat).
* `song.controller.js`: Endpoints para obtener canciones y recomendadas.
* `album.controller.js`: Operaciones sobre álbumes, incluyendo relación con canciones.
* `playlist.controller.js`: Crear, editar y validar playlists.
* `stat.controller.js`: Estadísticas globales (conteo de usuarios, canciones, álbumes).
* `admin.controller.js`: Subida de canciones y álbumes a Cloudinary.

### Backend - `src/lib`

* `db.js`: Conexión con MongoDB usando Mongoose.
* `cloudinary.js`: Configuración y funciones de subida de archivos.
* `socket.js`: Configura y maneja eventos de Socket.IO para actividad de usuarios.

### Backend - `routes/`

Define los endpoints de la API REST y los asocia con sus controladores respectivos.

---

### Frontend - `src/components`

* `Topbar.tsx`: Barra superior del sitio, integra Clerk, acceso admin y login.
* `SignInOAuthButtons.tsx`: Botones de login con Google usando Clerk.
* `skeletons/*.tsx`: Componentes animados para mostrar carga mientras se obtienen datos.

### Frontend - `src/stores`

* Archivos como `useAuthStore.ts` y `useMusicStore.ts` permiten manejar el estado global de sesión y canciones con Zustand.

### Frontend - `src/pages`

* Vistas como `Dashboard`, `Browse`, `Library` o `ChatPage` que se renderizan según las rutas.

---

## 🌐 APIs principales (backend)

### `GET /api/song`

Devuelve todas las canciones.

### `POST /api/playlist`

Crea una nueva playlist a partir de un arreglo de IDs de canciones.

### `GET /api/stats`

Devuelve el conteo de usuarios, canciones, artistas y álbumes.

### `POST /api/admin/upload`

Sube una canción o álbum a Cloudinary (requiere permisos de admin).

---

## ⏳ Tareas programadas (cronjobs)

Dentro de `index.js` se configura `node-cron` para ejecutar funciones periódicas como actualización de estadísticas o limpieza de datos (si se agrega lógica futura).

---

## 🌟 Mejores prácticas usadas

* Modularización por responsabilidades (MVC)
* Tipado con TypeScript en el frontend
* Separación de estado global usando Zustand
* Skeleton Loaders para mejorar experiencia de usuario
* Control de errores con `try/catch` y `next()`
* Uso de promesas paralelas (`Promise.all`) en stats

---

## 🚀 Futuras mejoras sugeridas

* Soporte para comentarios o chat entre usuarios
* App móvil en React Native
* Panel de estadísticas más completo para admins
* Mejorar accesibilidad y soporte offline

---

## 🤝 Contribuciones

1. Haz fork del repo
2. Crea una rama `feature/nueva-funcionalidad`
3. Abre un Pull Request bien documentado

---

## 🔗 Licencia

MIT — libre para uso comercial o personal.

---

## 🎓 Autor

Este proyecto fue desarrollado por un equipo apasionado por la música y la tecnología
