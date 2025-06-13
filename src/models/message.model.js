const mongoose = require('mongoose');
const mongooseAutopopulate = require('mongoose-autopopulate');

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        autopopulate: {
            select: 'firstName lastName'
        }
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    type: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text'
    },
    fileUrl: {
        type: String
    }
}, {
    timestamps: true
});

messageSchema.plugin(mongooseAutopopulate);

// Actualizar lastMessage y unreadCount del chat cuando se crea un mensaje
messageSchema.post('save', async function(doc) {
    const Chat = mongoose.model('Chat');
    const chat = await Chat.findById(doc.chat);
    
    // Actualizar último mensaje
    chat.lastMessage = doc._id;
    
    // Incrementar contador de mensajes no leídos para todos los participantes excepto el remitente
    chat.participants.forEach(participantId => {
        if (!participantId.equals(doc.sender)) {
            const currentCount = chat.unreadCount.get(participantId.toString()) || 0;
            chat.unreadCount.set(participantId.toString(), currentCount + 1);
        }
    });
    
    await chat.save();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message; 