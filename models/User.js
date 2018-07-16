const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    active: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    photoURL: {
        type: String,
        default: "https://www.weact.org/wp-content/uploads/2016/10/Blank-profile.png"
    }
});
userSchema.plugin(passportLocalMongoose, {usernameField:'email'});

module.exports = mongoose.model('User', userSchema);