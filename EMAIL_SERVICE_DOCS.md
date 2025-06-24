# Servicio de Email - Documentación

## Configuración

### Variables de Entorno
Crea un archivo `.env` basado en `.env.example`:

```env
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_de_aplicacion
EMAIL_FROM=noreply@tudominio.com
```

**Importante**: Para Gmail, usa una contraseña de aplicación, no tu contraseña normal.

## Endpoints de Email

### 1. Verificar Servicio de Email
```http
GET /api/users/email/verify-service
```

**Respuesta:**
```json
{
  "emailServiceWorking": true,
  "message": "Email service is working correctly"
}
```

### 2. Enviar Email de Recuperación de Contraseña
```http
POST /api/users/password-reset/send
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "resetToken": "ABC123"
}
```

### 3. Enviar Notificación a Usuario
```http
POST /api/users/{uuid}/send-notification
Content-Type: application/json

{
  "title": "Título de la notificación",
  "message": "Mensaje de la notificación"
}
```

### 4. Enviar Email de Confirmación de Cuenta
```http
POST /api/users/{uuid}/send-confirmation
Content-Type: application/json

{
  "confirmationToken": "TOKEN123"
}
```

## Funcionalidades Automáticas

### Email de Bienvenida
Se envía automáticamente cuando se crea un nuevo usuario a través de:
```http
POST /api/users/register
```

## Estructura del Servicio

```
source/user/
├── domain/
│   └── email-service.interface.ts     # Interfaz del servicio
├── application/
│   ├── UserUseCase.ts                 # Casos de uso principales
│   └── EmailUseCase.ts                # Casos de uso de email
└── infrastructure/
    └── service/
        └── NodemailerEmailService.ts  # Implementación con Nodemailer
```

## Tipos de Email Disponibles

1. **Email de Bienvenida**: Se envía automáticamente al registrar usuario
2. **Email de Recuperación**: Para reset de contraseña
3. **Email de Confirmación**: Para confirmar cuenta
4. **Email de Notificación**: Para notificaciones generales
5. **Email de Cambio de Contraseña**: Notificación de cambio exitoso

## Ejemplo de Uso

```typescript
// El servicio ya está configurado automáticamente
// Solo necesitas usar los endpoints o llamar los métodos

// Ejemplo en el código:
const emailSent = await userUseCase.sendUserNotification(
  uuid, 
  "Bienvenido", 
  "Tu cuenta ha sido verificada"
);
```

## Manejo de Errores

- Si el servicio de email falla, la creación de usuarios NO se detiene
- Los errores se logean en consola
- Los endpoints retornan `success: false` si hay errores
- Se recomienda implementar un sistema de reintentos para emails críticos

## Configuración de Gmail

1. Habilitar autenticación de 2 factores
2. Generar contraseña de aplicación
3. Usar la contraseña de aplicación en `EMAIL_PASSWORD`

## Personalización

Para cambiar los templates de email, edita los métodos en:
- `EmailUseCase.ts` - Lógica de negocio
- `NodemailerEmailService.ts` - Templates HTML
