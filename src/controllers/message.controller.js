const Message = require('../models/message.model');
const Chat = require('../models/chat.model');
const socketService = require('../services/socket.service');
const AppError = require('../errors/AppError');

class MessageController {
    async sendMessage(req, res, next) {
        try {
            const { chatId } = req.params;
            const { content, type = 'text', fileUrl } = req.body;
            const userId = req.user.id;

            // Verificar acceso al chat
            const chat = await Chat.findOne({
                _id: chatId,
                participants: userId
            });

            if (!chat) {
                throw AppError.notFound('Chat no encontrado');
            }

            // Crear mensaje
            const message = await Message.create({
                chat: chatId,
                sender: userId,
                content,
                type,
                fileUrl,
                readBy: [userId] // El remitente ya lo leyó
            });

            // Notificar a los otros participantes
            chat.participants
                .filter(p => p.toString() !== userId)
                .forEach(participantId => {
                    socketService.notifyUser(participantId, 'new_message', message);
                });

            res.status(201).json(message);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MessageController(); 