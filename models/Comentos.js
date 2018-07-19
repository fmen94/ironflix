const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const comentariosSchema = new Schema({
    idpelicula: String,
   user: 
       {
           type: Schema.Types.ObjectId,
            ref: 'User',
            childPath: 'comen'
       },
    title: String,
    text:{
        type: String,
        required:true
        }
    
        },{
        timestamps:{
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

module.exports = mongoose.model('Comentarios', comentariosSchema);