const Chat = require('../models/chat.model');
const Message = require('../models/message.model');
const socketService = require('../services/socket.service');
const AppError = require('../errors/AppError');

class ChatController {
    async createChat(req, res, next) {
        try {
            const { participantId } = req.body;
            const userId = req.user.id;

            // Verificar que no existe un chat entre estos usuarios
            const existingChat = await Chat.findOne({
                participants: { 
                    $all: [userId, participantId],
                    $size: 2
                }
            });

            if (existingChat) {
                return res.json(existingChat);
            }

            // Crear nuevo chat
            const chat = await Chat.create({
                participants: [userId, participantId]
            });

            // Notificar a los participantes
            socketService.notifyUser(participantId, 'chat_created', chat);

            res.status(201).json(chat);
        } catch (error) {
            next(error);
        }
    }

    async getUserChats(req, res, next) {
        try {
            const userId = req.user.id;
            const chats = await Chat.find({
                participants: userId,
                isActive: true
            })
            .populate('lastMessage')
            .sort('-updatedAt');

            res.json(chats);
        } catch (error) {
            next(error);
        }
    }

    async getChatMessages(req, res, next) {
        try {
            const { chatId } = req.params;
            const userId = req.user.id;
            const { page = 1, limit = 20 } = req.query;

            // Verificar acceso al chat
            const chat = await Chat.findOne({
                _id: chatId,
                participants: userId
            });

            if (!chat) {
                throw AppError.notFound('Chat no encontrado');
            }

            // Obtener mensajes paginados
            const messages = await Message.find({ chat: chatId })
                .sort('-createdAt')
                .skip((page - 1) * limit)
                .limit(parseInt(limit))
                .populate('sender', 'firstName lastName');

            res.json(messages);
        } catch (error) {
            next(error);
        }
    }

    async markChatAsRead(req, res, next) {
        try {
            const { chatId } = req.params;
            const userId = req.user.id;

            await Message.updateMany(
                {
                    chat: chatId,
                    readBy: { $ne: userId }
                },
                {
                    $addToSet: { readBy: userId }
                }
            );

            const chat = await Chat.findById(chatId);
            if (chat && chat.unreadCount) {
                chat.unreadCount.set(userId.toString(), 0);
                await chat.save();
            }

            res.json({ message: 'Mensajes marcados como leídos' });
        } catch (error) {
            next(error);
        }
    }

    async deleteChat(req, res, next) {
        try {
            const { chatId } = req.params;
            const userId = req.user.id;

            const chat = await Chat.findOne({
                _id: chatId,
                participants: userId
            });

            if (!chat) {
                throw AppError.notFound('Chat no encontrado');
            }

            chat.isActive = false;
            await chat.save();

            // Notificar a los otros participantes
            chat.participants
                .filter(p => p.toString() !== userId)
                .forEach(participantId => {
                    socketService.notifyUser(participantId, 'chat_deleted', { chatId });
                });

            res.json({ message: 'Chat eliminado' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ChatController(); 