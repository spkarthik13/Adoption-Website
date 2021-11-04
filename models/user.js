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
    age: {
        type:Number,
    },
    city: {
        type:String,
    },
    squareFt: {
        type: Number,
    },
    children: {
        type: String,
    },
    outdoorArea: {
        type: String,
    },
    fencedArea: {
        type: String,
    },
    adoptedPets:{
        type: Array,    
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true});

const Users = mongoose.model('Users', userSchema);
module.exports = Users;