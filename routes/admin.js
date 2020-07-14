const express = require("express");
const router = express.Router();

const path = require("path");
const bcrypt = require("bcrypt");

const Book = require("../models/Book");
const Author = require("../models/Author");
const User = require("../models/User");
const Payment = require("../models/Payment");
const Rebate = require("../models/Rebate");

router.get("/", (req, res) => {
    Rebate.aggregate([
        {
            $match:{}
        }
    ])
    .then((rebate) => {
        Payment.aggregate([
            {
                $match:{}
            }
        ])
        .then((payment) => {
            res.render("admin/index",{payment,rebate});
        })
        
    })
    
});

router.post("/books/new", (req, res) => {

    const { name, category, barkod, stok, puan, price } = req.body;
    let myfile = req.files.myfile;
    let bookFile = req.files.bookFile;

    Author.create({ name: req.body.author })
        .then(author => {
            Book.create({
                name,
                category,
                barkod,
                stok,
                puan,
                price,
                authorId: author._id,
                book_picture: `/images/${myfile.name}`,
                book_file: `/books/${bookFile.name}`
            })
            .then(book => {
                res.redirect("/admin");
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));

    myfile.mv(path.resolve(__dirname, "../public/images/", myfile.name), (err) => {
        res.json(err);
    });

    bookFile.mv(path.resolve(__dirname, "../public/books/", bookFile.name), (err) => {
        res.json(err);
    });

});

router.put("/books/update", (req, res) => {

    const { name, category, barkod, stok, puan, price, author } = req.body;

    if(author)
    {
        Author.findOneAndUpdate({name:author},{
            name:author
        })
        .then(author => {
            Book.findByIdAndUpdate(req.body.bookID,{
                name,
                category,
                barkod,
                stok,
                puan,
                price,
                authorId: author._id
            })
            .then(data => res.redirect("/admin"));
        })
    }


    Book.findByIdAndUpdate(req.body.bookID, {
        name,
        category,
        barkod,
        stok,
        puan,
        price
    }).then((data) => res.redirect("/admin"))

});

router.delete("/users/delete",(req,res) => {
    User.findByIdAndDelete(req.body.userID)
    .then(user => res.redirect("/admin"))
    .catch(err => res.json(err));
});

router.put("/users/update",(req,res) => {

    const {phone,email,password,address} = req.body;

    bcrypt.hash(password,10,(err,hash) => {
        User.findByIdAndUpdate(req.body.userID,{
            phone,
            email,
            password:hash,
            address
        })
        .then(user => res.redirect("/admin"))
        .catch(err => res.json(err));
    });

});

router.delete("/books/delete",(req,res) => {
    Book.findByIdAndDelete(req.body.bookID)
    .then(data => res.redirect("/admin"))
    .catch(err => res.json(err));

});

module.exports = router;