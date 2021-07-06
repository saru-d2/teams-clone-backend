const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//TODO legit everything

const MsgSchema = new Schema ({
    from: {
        type: String, 
        required: true,
    },
    msg: {
        type: String, 
        required: true,
    }
})

module.exports = Msg = mongoose.model("Msg", MsgSchema);
