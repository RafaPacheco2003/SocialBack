const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const imgShema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, 'La url es requerida']
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'El post es requerido']
        }
})

imgShema.plugin(mongoosePaginate);

const Img = mongoose.model('Img', imgShema);

module.exports = Img;