// Registration schema.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }, 
    phoneNumber: {
        type: Number,
        required: true
    },
    hashedPass: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    gender: {
        type:String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isEmployee: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

const Users = mongoose.model('Users', userSchema);
module.exports = Users;