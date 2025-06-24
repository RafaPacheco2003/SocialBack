export interface EmailService {
    /**
     * Enviar email de bienvenida cuando se registra un usuario
     */
    sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean>;

    /**
     * Verificar configuración del servicio
     */
    verifyConnection(): Promise<boolean>;
}
