const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const date = new Date();

const attributeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
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
        type: String,
        required: true,
    },
    sterile: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    otherInfo: {
        type: String,
    },
    pictures: {
        type: Array,
    },
})

const intakeSchema = mongoose.Schema({
    intakeApplyDate: {
        type: String,
        default: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(),
        required: true,
    },
    intakeMember: {
        type: String,
        required: true,
    },
})

const adminInfoSchema = mongoose.Schema({
    appliedMembers: {
        type: Array,
    },
    inventoryApproved: {
        type: Boolean,
        default: false,
    },
    adminSuggestion: {
        type: Object,
        default: {},
    }
});

const petSchema = new Schema ({
    attribute: {
        type: attributeSchema,
        required: true
    },
    intake: {
        type: intakeSchema,
        rquired: true
    },
    adminInfo: {
        type: adminInfoSchema,
        require: true, 
    },
});


const Pet = mongoose.model('Pets', petSchema);
module.exports = Pet;