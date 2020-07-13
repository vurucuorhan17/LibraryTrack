const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    name:{
        type:String
    }
});

module.exports = mongoose.model("authors",AuthorSchema);