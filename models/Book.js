const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
   name:{
       type:String
   },
   category:{
    type:String
   },
   price:{
       type:Number
   },
   stok:{
       type:Number
   },
   barkod:{
       type:Number
   },
   puan:{
       type:Number,
       max:10,
       min:1
   },
   authorId:{
       type:Schema.Types.ObjectId,
       ref:"authors"
   },
   book_picture:{
       type:String
   },
   book_file:
   {
    type:"String"
   },
   createdDate:{
       type:Date,
       default:Date.now()
   }
});

module.exports = mongoose.model("books",BookSchema);
