const bcrypt = require("bcrypt");

const path = require("path");
const mongoose = require("mongoose");

const User = require("../models/User");
const Author = require("../models/Author");

let rndNum;

randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

sendMail = (rndNum, mail) => {

    let outputHTML = `
        <h2>İki Aşamalı Doğrulama Kodu</h2>
        <ul>
            <li>Kod: ${rndNum}</li>
        </ul>
        <h3>Uyarı</h3>
        <p>Giriş yapabilmek için kodu iki aşamalı doğrulama ekranına doğru bir şekilde giriniz.</p>
    `;

    const nodemailer = require("nodemailer");

    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.NODEMAILER_AUTH_USER, // generated ethereal user
                pass: process.env.NODEMAILER_AUTH_PASS // generated ethereal password
            }
        });
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Library Track Doğrulama Kodu" <vurucuorhan17@gmail.com>', // sender address
            to: mail, // list of receivers
            subject: "Doğrulama Kodu", // Subject line
            text: "Hello world?", // plain text body
            html: outputHTML // html body
        });
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
    main().catch(console.error);
}

sendMail2 = (mail, link) => {

    let outputHTML = `
        <h2>Şifre Sıfırlama Linki</h2>
        <ul>
            <li>Link: <a href="${link}">Sıfırlama Linki</a> </li>
        </ul>
        <h3>Uyarı</h3>
        <p>Şifrenizi sıfırlayabilmek için linke tıklayın.</p>
    `;

    const nodemailer = require("nodemailer");

    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.NODEMAILER_AUTH_USER, // generated ethereal user
                pass: process.env.NODEMAILER_AUTH_PASS // generated ethereal password
            }
        });
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Library Track Doğrulama Kodu" <vurucuorhan17@gmail.com>', // sender address
            to: mail, // list of receivers
            subject: "Doğrulama Kodu", // Subject line
            text: "Hello world?", // plain text body
            html: outputHTML // html body
        });
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
    main().catch(console.error);
}

class UserController
{
    static authCheck(req,res,next)
    {
        if (!req.user) {
            res.redirect("/users/login");
        }
        else {
            next();
        }
    }

    static GetSocialProfile(req,res)
    {
        if (req.user) {
            User.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.user._id)
                    }
                },
                {
                    $lookup: {
                        from: "books",
                        foreignField: "_id",
                        localField: "book_id.id",
                        as: "books"
                    }
                }
            ])
                .then((data) => {
    
                    let rentDate;
                    let teslimTarihi = new Date();
                    let dateNow = new Date();
    
                    for (let i = 0; i < data[0].book_id.length; i++) {
                        rentDate = data[0].book_id[i].rentDate;
                        teslimTarihi.setDate(rentDate.getDate() + 7);
                        if (teslimTarihi.getDate() - dateNow.getDate() <= 0) {
                            User.findOneAndUpdate({ _id: data[0]._id }, {
                                $pull: {
                                    book_id: {
                                        _id: data[0].book_id[i]._id
                                    }
                                },
                            }, (err, data) => {
                                console.log(data);
                            });
                        }
                    }
    
                    res.render("site/profile", { book: data[0].books, user: true, socialProfile: true, credit: Math.floor(data[0].credit) });
    
                })
                .catch(err => res.json(err));
        }
    }

    static GetNormalProfile(req,res)
    {
        if (req.session.userId) {
            User.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.session.userId)
                    }
                },
                {
                    $lookup: {
                        from: "books",
                        localField: "book_id.id",
                        foreignField: "_id",
                        as: "books"
                    }
                }
            ])
                .then((data) => {
    
                    let rentDate;
                    let teslimTarihi = new Date();
                    let dateNow = new Date();
    
                    for (let i = 0; i < data[0].book_id.length; i++) {
                        rentDate = data[0].book_id[i].rentDate;
                        teslimTarihi.setDate(rentDate.getDate() + 7);
                        if (teslimTarihi.getDate() - dateNow.getDate() <= 0) {
                            User.findOneAndUpdate({ _id: data[0]._id }, {
                                $pull: {
                                    book_id: {
                                        _id: data[0].book_id[i]._id
                                    }
                                },
                            }, (err, data) => {
                                console.log(data);
                            });
                        }
                    }
    
                    res.render("site/profile", { book: data[0].books, user: true, socialProfile: false, credit: Math.floor(data[0].credit) });
    
                })
                .catch(err => res.json(err));
        }
    }

    static ForgetPassManager(req,res)
    {
        const email = req.body.email;

        User.findOne({ email })
            .then(user => {
                if (user) {
                    sendMail2(user.email, `http://127.0.0.1:3000/users/updatePass/${user._id}`);
                    res.redirect("/users/login");
                }
                else {
                    res.json({ message: "Şifresini değiştirmek istediğiniz kullanıcı bulunamadı" })
                }
            })
            .catch(err => res.json(err));
    }

    static UpdateUser(req,res)
    {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            User.findByIdAndUpdate({ _id: req.params.id }, {
                password: hash
            })
                .then(data => res.redirect("/users/login"))
                .catch(err => res.json(err));
        });
    }

    static TwoAuthVerification(req,res)
    {
        const code = req.body.code;
        if(typeof code === "object") // Prevent NoSQL Injection
        {
            res.redirect(404,"/users/login");
        }
        else
        {
            if (parseInt(code) === parseInt(rndNum)) {
                res.redirect("/books");
            }
            else {
                req.session.destroy(() => {
                    res.redirect("/users/login");
                });
            }
        }
        
    }

    static RegisterUser(req,res)
    {
        const { password } = req.body;

        bcrypt.hash(password, 10, (err, hash) => {
            if (req.files != null) {
                User.create({
                    ...req.body,
                    password: hash,
                    picture: `/images/${req.files.imageFile.name}`
                })
                    .then(data => res.redirect("/users/login"))
                    .catch(err => res.render("site/register", { message: "Hata oluştu" }));
    
                req.files.imageFile.mv(path.resolve(__dirname, "../public/images/", req.files.imageFile.name), (err) => {
                    console.log(err);
                });
    
            }
            if (req.files === null) {
                User.create({
                    ...req.body,
                    password: hash,
                    picture: null
                })
                    .then(data => res.redirect("/users/login"))
                    .catch(err => res.render("site/register", { message: "Hata oluştu" }));
            }
    
        }); 
    }

    static LoginUser(req,res)
    {
        const { email, password } = req.body;
        if(typeof email === "object" || typeof password === "object") // Prevent NoSQL Injection
        {
            res.json({"message":"Meşru yollar ile giriş yapmayı dene."});
        }
        else
        {
            User.findOne({ email })
            .then((user) => {
                if (!user) {
                    res.render("site/login", { message: "Giriş Başarısız. Girdiğiniz kullanıcı adı veya parola yanlış" });
                }
                else {
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (result === false) {
                            res.render("site/login", { message: "Giriş Başarısız. Girdiğiniz kullanıcı adı veya parola yanlış" });
                        }
                        else {
                            rndNum = randomNumber(100000, 900000);
                            sendMail(rndNum, user.email);
                            req.session.userId = user._id;
                            res.redirect("/users/twoAuth");
                        }
                    });
                }
            })
            .catch(err => res.json(err));
        }
        
    }

    static DeleteUserById(req,res)
    {
        User.findByIdAndDelete(req.params.userId)
        .then((user) => {
            res.json({ status: "ok", message: "User Deleted!" });
        })
        .catch(err => res.json(err));
    }

    static UpdateUserById(req,res)
    {
        const {password} = req.body;

        if (!password) {
            User.findByIdAndUpdate(req.params.userId, {
                ...req.body
            })
                .then(user => res.json(user))
                .catch(err => res.json(err));
        }
        else {
            bcrypt.hash(password, 10, (err, hash) => {
                User.findByIdAndUpdate(req.params.userId, {
                    ...req.body,
                    password: hash
                })
                    .then(user => res.json(user))
                    .catch(err => res.json(err));
            });
        }
    }

}

module.exports = UserController;