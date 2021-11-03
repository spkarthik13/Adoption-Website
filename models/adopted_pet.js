const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const date = new Date();

const intakeSchema = mongoose.Schema({
    intakeApplyDate: {
        type: String,
        default: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(),
    },
    intakeMember: {
        type: String,
    },
})

const outgoingSchema = mongoose.Schema({
    outgoingDate: {
        type: String,
    },
    adoptee: {
        type: String,
    },
})

const adoptedPetSchema = new Schema({
    name: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    },
    species: {
        type: String,
    },
    breed: {
        type: String,
    },
    sterile: {
        type: String,
    },
    weight: {
        type: Number,        
    },
    otherInfo: {
        type: String,
    },
    pictures: {
        type: Array,
    },
    appliedMembers: {
        type: Array,
    },
    inventoryApproved: {
        type: Boolean,
        default: false,
    },
    adminSuggestion: {
        type: Object,
    },
    outgoing: {
        type: Object,
    },
    intake: {
        type: intakeSchema,
    },
}, {timestamps: true});

const AdoptedPet = mongoose.model('adopted_pet', adoptedPetSchema);
module.exports = AdoptedPet;