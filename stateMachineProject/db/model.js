const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Document = new Schema({
    docName: {
        type: String,
        unique: true
    },
    sourceState: {
        type: String
    },
    currentState: {
        type: String
    },
    event: {
        type: String
    }
})

module.exports = mongoose.model('Document', Document);