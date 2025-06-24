# User Management API - Clean Architecture

Esta API está construida siguiendo los principios de **Arquitectura Limpia** (Clean Architecture) con Node.js, TypeScript, Express y MongoDB.

## 🏗️ Arquitectura

La aplicación está estructurada en tres capas principales:

### 1. **Domain Layer** (Capa de Dominio)
- **Entities**: Representan las entidades de negocio (`UserEntity`)
- **Value Objects**: Implementaciones concretas de las entidades (`UserValue`)
- **Repository Interfaces**: Contratos para acceso a datos (`UserRepository`)

### 2. **Application Layer** (Capa de Aplicación)
- **Use Cases**: Lógica de aplicación (`UserUseCase`)
- **Sin DTOs**: Trabaja directamente con entidades de dominio y parámetros primitivos

### 3. **Infrastructure Layer** (Capa de Infraestructura)
- **Controllers**: Manejo de peticiones HTTP
- **DTOs**: Request/Response DTOs para la API
- **Mappers**: Conversión entre DTOs y entidades
- **Repository Implementation**: Implementación concreta del repositorio
- **Models**: Esquemas de base de datos
- **Routes**: Definición de rutas
- **Validation**: Validación de entrada
- **Middleware**: Middleware personalizado

## 📁 Estructura del Proyecto

```
source/user/
├── domain/
│   ├── user-entity.ts          # Interfaz de la entidad User
│   ├── user-repository.ts      # Interfaz del repositorio
│   └── user-value.ts           # Implementación de la entidad User
├── application/
│   └── UserUseCase.ts          # Casos de uso de negocio (sin DTOs)
└── infrastructure/
    ├── controller/
    │   └── UserController.ts   # Controlador HTTP
    ├── dto/
    │   ├── user-request.dto.ts # DTOs de petición
    │   └── user-response.dto.ts# DTOs de respuesta
    ├── mapper/
    │   ├── user-request.mapper.ts  # Mapeo de requests
    │   └── user-response.mapper.ts # Mapeo de responses
    ├── model/
    │   └── UserSchema.ts       # Esquema de MongoDB
    ├── repository/
    │   └── MongoRepository.ts  # Implementación del repositorio
    ├── route/
    │   └── UserRoute.ts        # Definición de rutas
    ├── validation/
    │   └── user.validation.ts  # Validaciones de entrada
    └── middleware/
        └── validation.middleware.ts # Middleware de validación
```

## 🔄 Flujo de Datos

1. **Request** → **Controller** → **Mapper (extract params)** → **Use Case (primitives/entities)** → **Repository** → **Database**
2. **Database** → **Repository** → **Use Case** → **Mapper (to DTO)** → **Controller** → **Response**

## 🚀 Endpoints

### POST /api/users/register
Registra un nuevo usuario.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "email": "john.doe@example.com",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "isActive": true,
  "message": "User created successfully"
}
```

### GET /api/users
Obtiene todos los usuarios.

**Response:**
```json
{
  "users": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+1234567890",
      "email": "john.doe@example.com",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "isActive": true,
      "lastLogin": null
    }
  ],
  "total": 1
}
```

### GET /api/users/:uuid
Obtiene un usuario por UUID.

### PUT /api/users/:uuid
Actualiza un usuario.

### DELETE /api/users/:uuid
Elimina un usuario.

## 🛠️ Principios de Arquitectura Limpia Aplicados

### 1. **Separación de Responsabilidades**
- Cada capa tiene una responsabilidad específica
- Los DTOs están separados por contexto (request, response, use case)

### 2. **Dependency Inversion**
- La capa de dominio no depende de las capas externas
- Los repositorios son interfaces que se implementan en infraestructura

### 3. **Mappers**
- Conversión explícita entre DTOs y entidades
- No hay lógica de negocio en los DTOs

### 4. **Single Responsibility**
- Cada clase tiene una única responsabilidad
- Los use cases encapsulan la lógica de negocio

### 5. **Validación**
- Validación en la capa de infraestructura
- Middleware dedicado para manejo de errores

## 📝 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar
npm run build

# Ejecutar en producción
npm start
```

## 🔧 Variables de Entorno

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/userdb
```

## ✅ Beneficios de esta Arquitectura

1. **Testabilidad**: Fácil de testear cada capa independientemente
2. **Mantenibilidad**: Código organizado y fácil de mantener
3. **Flexibilidad**: Fácil cambio de base de datos o framework
4. **Escalabilidad**: Nueva funcionalidad sin afectar código existente
5. **Separación de Concerns**: Cada capa tiene su responsabilidad específica

## 🎯 Patrones Implementados

- **Repository Pattern**: Abstracción del acceso a datos
- **Mapper Pattern**: Transformación entre objetos
- **DTO Pattern**: Transferencia de datos entre capas
- **Dependency Injection**: Inyección de dependencias
- **Validation Pattern**: Validación centralizada
