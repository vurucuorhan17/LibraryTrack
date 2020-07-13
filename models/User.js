const mongoose = require("mongoose");
const Schema = mongoose.Schema;

randomNumber = (min,max) => {
    return Math.floor(Math.random() * (max-min)) + min;
}

const UserSchema = new Schema({
    name:{
        type:String
    },
    googleID: {
        type: String
    },
    githubID: {
        type: String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        minlength:[10,`{PATH} alanı {VALUE} 10 karakterden az olamaz`]
    },
    phone:{
        type:Number,
        maxlength:[10,`{PATH} alanı {VALUE} 10 karakterden fazla olamaz`]
    },
    address:{
        type:String,
    },
    picture:{
        type:String
    },
    credit:{
        type:Number,
        default: randomNumber(100,1000)
    },
    book_id:[
        {
            id:{
                type:Schema.Types.ObjectId,
                ref:"books"
            },
            rentDate:{
                type:Date
            }
        }
    ]
});

module.exports = mongoose.model("users",UserSchema);