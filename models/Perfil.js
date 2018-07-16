const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const perfilSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:'user'
    },
    amigos:[{
       type: Schema.Types.ObjectId,
        ref: 'user'
    }],

   comentos: [
       {
           type: Schema.Types.ObjectId,
            ref: 'comentos'
       }
   ],
    timestamps:{
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});



module.exports = mongoose.model('Perfil', perfilSchema);