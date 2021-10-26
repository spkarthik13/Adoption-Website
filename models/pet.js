const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const date = new Date();
const petSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
    },
    species: {
        type: String,
        required: true
    },
    breed: {
        type: String
    },
    sterile: {
        type: String,
    },
    weight: {
        type: String,
    },
    intakeApplyDate: {
        type: String,
        default: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(),
        required: true,
    },
    intakeMember: {
        type: String,
        required: true,
    },
    appliedMembers: {
        type: Array,
    },
    otherInfo: {
        type: String,
    },
    pictures: {
        type: Array,
    },
    inventoryApproved: {
        type: Boolean,
        default: false,
    },
});

const Pet = mongoose.model('Pets', petSchema);
module.exports = Pet;