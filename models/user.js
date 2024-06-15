const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    facebookId: String,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);



