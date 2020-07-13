const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    price:{
        type:Number
    },
    bookId:{
        type:mongoose.Types.ObjectId
    },
    userId:{
        type:mongoose.Types.ObjectId
    },
    date:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model("payments",PaymentSchema);