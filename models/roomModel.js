const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    roomID: {
        type: String, required: true
    },
    msg_list: [{
        msg: { type: String },
        from: { type: String },
        date: { type: Date, default: Date.now }
    }],
})

module.exports = Room = mongoose.model("Room", RoomSchema);
