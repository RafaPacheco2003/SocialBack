const mongoose = require('mongoose');
const mongooseAutopopulate = require('mongoose-autopopulate');

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        autopopulate: {
            select: 'firstName lastName'
        }
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        autopopulate: true
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: new Map()
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual para los mensajes
chatSchema.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'chat',
    options: { sort: { createdAt: -1 } }
});

chatSchema.plugin(mongooseAutopopulate);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat; 