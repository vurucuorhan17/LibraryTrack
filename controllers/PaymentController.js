const Book = require("../models/Book");
const Author = require("../models/Author");
const User = require("../models/User");
const Payment = require("../models/Payment");
const Rebate = require("../models/Rebate");
const mongoose = require("mongoose");

exports.GetPaymentPage = (req,res) => 
{
    Book.findById(req.params.id)
    .then((book) => {
        let bookJson = book.toJSON();
        Author.findById(book.authorId)
        .then((author) => {
            if(req.session.userId)
            {
                User.findById(req.session.userId)
                .then((user) => {
                    res.render("site/payment",{book:bookJson,author:author.name,user:user.toJSON()});
                })
            }
            if(req.user)
            {
                User.findById(req.user._id)
                .then((user) => {
                    res.render("site/payment",{book:bookJson,author:author.name,user:user.toJSON()});
                })
            }
            
            
        })
        
    })
    .catch(err => res.json(err));
};

exports.CreatePayment = (req,res) => 
{
    Book.findById(req.params.id)
    .then((book) => {
        let bookJson = book.toJSON();
        
        if(req.session.userId)
        {
            User.findById(req.session.userId)
            .then((user) => {
                Payment.create({
                    price:bookJson.price,
                    bookId:mongoose.Types.ObjectId(bookJson._id),
                    userId:user._id
                })
                .then((payment) => {
                    res.status(200);
                    res.redirect("/books");
                })
                .catch(err => res.json(err));
            })
        }
        if(req.user)
        {
            User.findById(req.user._id)
            .then((user) => {
                Payment.create({
                    price:bookJson.price,
                    bookId:mongoose.Types.ObjectId(bookJson._id),
                    userId:user._id
                })
                .then((payment) => {
                    res.status(200);
                    res.redirect("/books");
                })
                .catch(err => res.json(err));
            })
        }
        
    })
    .catch(err => res.json(err));
};

exports.PaymentApprove = (req,res) => 
{
    User.findById(req.params.userId)
    .then((user) => {
        User.findByIdAndUpdate(req.params.userId,{
            $push:{
                book_id:{
                    id: req.params.bookId,
                    rentDate: Date.now()
                }
            },
            credit: user.credit -= req.params.price
        })
        .then((data) => {
            Payment.findByIdAndDelete(req.params.paymentId)
            .then((paymentOk) => {
                res.redirect("/books");
            })
        })
        .catch(err => res.json(err));
    })
};

exports.CreateRebate = (req,res) => 
{
    Book.findById(req.params.id)
    .then((book) => {
        let bookJson = book.toJSON();
        
        if(req.session.userId)
        {
            User.findById(req.session.userId)
            .then((user) => {
                Rebate.create({
                    price:bookJson.price,
                    bookId:mongoose.Types.ObjectId(bookJson._id),
                    userId:user._id
                })
                .then((rebate) => {
                    res.status(200);
                    res.redirect("/books");
                })
                .catch(err => res.json(err));
            })
        }
        if(req.user)
        {
            User.findById(req.user._id)
            .then((user) => {
                Rebate.create({
                    price:bookJson.price,
                    bookId:mongoose.Types.ObjectId(bookJson._id),
                    userId:user._id
                })
                .then((rebate) => {
                    res.status(200);
                    res.redirect("/books");
                })
                .catch(err => res.json(err));
            })
        }
        
    })
    .catch(err => res.json(err));
};

exports.RebateApprove = (req,res) => 
{
    User.findById(req.params.userId)
    .then((user) => {
        User.findByIdAndUpdate(req.params.userId,{
            $pull:{
                book_id:{
                    id: req.params.bookId
                },
            },
            credit: user.credit += Number(req.params.price),
        })
        .then((data) => {
            Rebate.findByIdAndDelete(req.params.rebateId)
            .then((rebate) => {
                res.redirect("/books");
            })
        })
        .catch(err => res.json(err));
    })
}