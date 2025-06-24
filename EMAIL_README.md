# Servicio de Email para Usuarios - Clean Architecture

## ¿Qué hace?
Envía automáticamente un email de bienvenida cuando se registra un nuevo usuario.

## Arquitectura Clean implementada:

### 📁 Domain (Capa de Dominio)
- `source/user/domain/email-service.interface.ts` - Interfaz que define el contrato

### 📁 Application (Capa de Aplicación)
- `source/user/application/service/SendEmail.ts` - Servicio de aplicación (lógica de negocio)

### 📁 Infrastructure (Capa de Infraestructura)
- `source/user/infrastructure/service/NodemailerEmailService.ts` - Implementación con Nodemailer
- Actualizado `UserRoute.ts` - Inyección de dependencias

## Configuración en `.env`:
```
EMAIL_USER=rodrigorafaelchipacheco@gmail.com
EMAIL_PASSWORD=rzlgjdhkkrflvuus
EMAIL_FROM=noreply@socialapp.com
```

## Flujo de dependencias (Clean Architecture):
```
UserUseCase 
    ↓ depende de
SendEmailService (Application)
    ↓ depende de
EmailService (Interface/Domain)
    ↓ implementada por
NodemailerEmailService (Infrastructure)
```

## ¿Cómo funciona?
1. Usuario se registra con `POST /api/users/register`
2. Se crea el usuario en la base de datos
3. UserUseCase llama a SendEmailService
4. SendEmailService usa la interfaz EmailService
5. NodemailerEmailService (Infrastructure) envía el email real
6. Si el email falla, NO afecta la creación del usuario

## Ventajas de esta arquitectura:
✅ **Separation of Concerns** - Cada capa tiene su responsabilidad
✅ **Dependency Inversion** - Depende de abstracciones, no de implementaciones
✅ **Testeable** - Fácil de mockear la interfaz EmailService
✅ **Flexible** - Puedes cambiar de Nodemailer a otro proveedor sin tocar la lógica
✅ **Clean** - La lógica de negocio no conoce detalles de implementación

## Prueba:
1. Registra un usuario nuevo
2. Revisa la consola para ver logs del email
3. Revisa la bandeja de entrada del email registrado

¡Arquitectura Clean perfectamente implementada! �✨
