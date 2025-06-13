const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const Chat = require('../models/chat.model');
const Message = require('../models/message.model');

class SocketService {
    constructor() {
        this.io = null;
        this.userSockets = new Map(); // userId -> Set of socket ids
    }

    initialize(server) {
        this.io = socketIo(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        this.io.use(this.authenticateSocket.bind(this));
        this.setupEventHandlers();
    }

    async authenticateSocket(socket, next) {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, authConfig.secret);
            socket.userId = decoded.id;

            // Agregar socket a la colección de sockets del usuario
            if (!this.userSockets.has(decoded.id)) {
                this.userSockets.set(decoded.id, new Set());
            }
            this.userSockets.get(decoded.id).add(socket.id);

            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    }

    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`Usuario conectado: ${socket.userId}`);

            // Unirse a las salas de chat del usuario
            this.joinUserChats(socket);

            // Manejar envío de mensajes
            socket.on('send_message', async (data) => {
                try {
                    const message = await this.handleNewMessage(socket.userId, data);
                    this.broadcastMessage(message);
                } catch (error) {
                    socket.emit('error', { message: error.message });
                }
            });

            // Manejar marcado de mensajes como leídos
            socket.on('mark_read', async (data) => {
                try {
                    await this.handleMarkRead(socket.userId, data.chatId);
                } catch (error) {
                    socket.emit('error', { message: error.message });
                }
            });

            // Manejar typing status
            socket.on('typing', (data) => {
                socket.to(data.chatId).emit('user_typing', {
                    chatId: data.chatId,
                    userId: socket.userId
                });
            });

            // Manejar desconexión
            socket.on('disconnect', () => {
                if (this.userSockets.has(socket.userId)) {
                    this.userSockets.get(socket.userId).delete(socket.id);
                    if (this.userSockets.get(socket.userId).size === 0) {
                        this.userSockets.delete(socket.userId);
                    }
                }
                console.log(`Usuario desconectado: ${socket.userId}`);
            });
        });
    }

    async joinUserChats(socket) {
        try {
            const chats = await Chat.find({
                participants: socket.userId
            });
            
            chats.forEach(chat => {
                socket.join(chat._id.toString());
            });
        } catch (error) {
            console.error('Error al unir usuario a sus chats:', error);
        }
    }

    async handleNewMessage(userId, data) {
        const { chatId, content, type = 'text', fileUrl } = data;

        // Verificar que el usuario pertenece al chat
        const chat = await Chat.findOne({
            _id: chatId,
            participants: userId
        });

        if (!chat) {
            throw new Error('Chat no encontrado o acceso denegado');
        }

        // Crear nuevo mensaje
        const message = await Message.create({
            chat: chatId,
            sender: userId,
            content,
            type,
            fileUrl,
            readBy: [userId]
        });

        return message;
    }

    async handleMarkRead(userId, chatId) {
        // Marcar mensajes como leídos
        await Message.updateMany(
            {
                chat: chatId,
                readBy: { $ne: userId }
            },
            {
                $addToSet: { readBy: userId }
            }
        );

        // Resetear contador de mensajes no leídos
        const chat = await Chat.findById(chatId);
        if (chat && chat.unreadCount) {
            chat.unreadCount.set(userId.toString(), 0);
            await chat.save();
        }

        // Notificar a otros participantes
        this.io.to(chatId).emit('messages_read', {
            chatId,
            userId
        });
    }

    broadcastMessage(message) {
        this.io.to(message.chat.toString()).emit('new_message', message);
    }

    // Método para enviar notificación a un usuario específico
    notifyUser(userId, event, data) {
        if (this.userSockets.has(userId)) {
            this.userSockets.get(userId).forEach(socketId => {
                this.io.to(socketId).emit(event, data);
            });
        }
    }
}

module.exports = new SocketService(); 