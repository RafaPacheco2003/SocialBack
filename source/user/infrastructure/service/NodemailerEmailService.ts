import * as nodemailer from 'nodemailer';
import { EmailService } from '../../domain/email-service.interface';

export class NodemailerEmailService implements EmailService {
    private transporter: nodemailer.Transporter;
    private fromEmail: string;

    constructor() {
        this.fromEmail = process.env.EMAIL_FROM || 'noreply@socialapp.com';
        
        // Configurar el transporter con Gmail
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'rodrigorafaelchipacheco@gmail.com',
                pass: process.env.EMAIL_PASSWORD || 'rzlgjdhkkrflvuus'
            }
        });
    }

    /**
     * Enviar email de bienvenida cuando se registra un usuario
     */
    public async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
        try {
            const subject = '¡Bienvenido a nuestra plataforma!';
            
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">¡Bienvenido!</h1>
                    </div>
                    
                    <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">Hola ${userName},</h2>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6;">
                            ¡Gracias por unirte a nuestra plataforma! Tu cuenta ha sido creada exitosamente.
                        </p>
                        
                        <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
                            <p style="margin: 0; color: #333;">
                                <strong>¿Qué puedes hacer ahora?</strong><br>
                                • Completar tu perfil<br>
                                • Explorar las funcionalidades<br>
                                • Conectar con otros usuarios
                            </p>
                        </div>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6;">
                            Si tienes alguna pregunta, no dudes en contactarnos.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="#" style="background-color: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                Comenzar
                            </a>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; padding: 15px;">
                        <p style="color: #999; font-size: 12px; margin: 0;">
                            Este es un mensaje automático, por favor no responder directamente.
                        </p>
                    </div>
                </div>
            `;

            const mailOptions = {
                from: this.fromEmail,
                to: userEmail,
                subject: subject,
                html: htmlContent
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log(`Email de bienvenida enviado a ${userEmail}:`, result.messageId);
            return true;
        } catch (error) {
            console.error('Error enviando email de bienvenida:', error);
            return false;
        }
    }

    /**
     * Verificar configuración del servicio
     */
    public async verifyConnection(): Promise<boolean> {
        try {
            const verified = await this.transporter.verify();
            console.log('Conexión de email verificada:', verified);
            return verified;
        } catch (error) {
            console.error('Error verificando conexión de email:', error);
            return false;
        }
    }
}
