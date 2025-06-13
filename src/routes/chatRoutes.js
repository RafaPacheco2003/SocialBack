const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chat.controller');
const MessageController = require('../controllers/message.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas de chat
router.post('/', ChatController.createChat);
router.get('/', ChatController.getUserChats);
router.get('/:chatId/messages', ChatController.getChatMessages);
router.post('/:chatId/read', ChatController.markChatAsRead);
router.delete('/:chatId', ChatController.deleteChat);

// Rutas de mensajes
router.post('/:chatId/messages', MessageController.sendMessage);

module.exports = router; 