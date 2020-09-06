const path = require("path");
const bcrypt = require("bcrypt");

const Book = require("../models/Book");
const Author = require("../models/Author");
const User = require("../models/User");
const Payment = require("../models/Payment");
const Rebate = require("../models/Rebate");

class AdminController
{
    static GetAdminPage(req,res)
    {
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
    }

    static CreateNewBook(req,res)
    {
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
                .then((book) => {
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
    }

    static UpdateBook(req,res)
    {
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
    }

    static DeleteUser(req,res)
    {
        User.findByIdAndDelete(req.body.userID)
        .then(user => res.redirect("/admin"))
        .catch(err => res.json(err));
    }

    static UpdateUser(req,res)
    {
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
    }

    static DeleteBook(req,res)
    {
        Book.findByIdAndDelete(req.body.bookID)
        .then(data => res.redirect("/admin"))
        .catch(err => res.json(err));
    }
    
}

module.exports = AdminController;