# MiguelFiestas - Plataforma de Eventos

## Desarrollado por Santino PIRRAGLIA JANICKI e Isabella MURIONI

Sistema de gestión de eventos con frontend en React y backend en Node.js.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- `/backend`: API REST (Node.js + TypeScript + Express + Prisma)
- `/frontend`: Interfaz de usuario (React + TypeScript + Vite + TailwindCSS)

## Tecnologías Utilizadas

### Backend
- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **Prisma ORM** - ORM para base de datos
- **SQLite** - Base de datos (desarrollo)
- **bcrypt** - Encriptación de contraseñas
- **JWT** - Autenticación por tokens

### Frontend
- **React** + **TypeScript**
- **Vite** - Build tool y dev server
- **TailwindCSS** - Framework CSS
- **React Router** - Enrutamiento
- **Lucide React** - Iconos

## Cómo ejecutar el proyecto

### 1. Backend

Primero, navega al directorio del backend:
```bash
cd backend
```

Instala las dependencias:
```bash
npm install
```

Genera el cliente de Prisma:
```bash
npm run db:generate
```

Crea/actualiza la base de datos:
```bash
npm run db:migrate
```

Inicia el servidor de desarrollo:
```bash
npm run dev
```
El servidor backend se ejecutará en `http://localhost:3000`

### 2. Frontend

En una nueva terminal, navega al directorio del frontend:
```bash
cd frontend
```

Instala las dependencias:
```bash
npm install
```

Inicia el servidor de desarrollo:
```bash
npm run dev
```
La aplicación frontend estará disponible en `http://localhost:5173`

## Características Principales

- Creación y gestión de eventos
- Sistema de autenticación de usuarios
- Compra de tickets para eventos
- Gestión de saldo de usuario
- Interfaz responsive y moderna
- Panel de administración de eventos

## Desarrollo

Para trabajar en el proyecto:

1. El backend usa TypeScript y Prisma, asegúrate de regenerar los tipos si modificas el schema:
```bash
cd backend
npm run db:generate
```

2. El frontend usa TailwindCSS, los estilos se actualizan automáticamente al guardar

3. Para ejecutar los tests (backend):
```bash
cd backend
npm run test
```

## Notas Importantes

- La base de datos SQLite se crea localmente en `backend/prisma/dev.db`
- Los archivos `.env` no están incluidos en el repositorio
- Asegúrate de tener Node.js v18 o superior instalado