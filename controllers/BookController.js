const Book = require("../models/Book");
const Author = require("../models/Author");
const User = require("../models/User");

exports.GetAllBook = (req,res) => 
{
    Book.aggregate([
        {
            $lookup:{
                from:"authors",
                localField:"authorId",
                foreignField:"_id",
                as:"author"
            }
        },
        {
            $unwind:"$author"
        }
    ])
    .then(books => {
        if(req.session.userId || req.user)
        {
            if(req.user)
            {
                res.render("site/books/booksPage",{books:books,user:req.user,socialProfile:true});
            }
            else if(req.session.userId)
            {
                res.render("site/books/booksPage",{books:books,user:true,socialProfile:false});
            }
            else
            {
                res.render("site/books/booksPage",{books:books,user:false});
            }
            
        }
        else
        {
            res.status(404);
            res.redirect("/users/login");
        }
        
    })
    .catch(err => res.json(err));
};

exports.SearchBooks = (req,res) => 
{
    function escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    
    if(req.query.bookname)
    {
        const regex = new RegExp(escapeRegex(req.query.bookname), 'gi');
        Book.aggregate([
            {
                $match:{
                    name:regex
                }
            },
            {
                $lookup:{
                    from:"authors",
                    localField:"authorId",
                    foreignField:"_id",
                    as:"author"
                }
            },
            {
                $unwind:"$author"
            }
        ])
        .then(books => {
            if(req.session.userId || req.user)
            {
                if(req.user)
                {
                    res.render("site/books/search",{books:books,user:req.user,socialProfile:true});
                }
                else if(req.session.userId)
                {
                    res.render("site/books/search",{books:books,user:true,socialProfile:false});
                }
                else
                {
                    res.render("site/books/search",{books:books,user:false});
                }
            }
            else
            {
                res.status(404);
                res.redirect("/users/login");
            }
        })
        .catch(err => res.json(err));
        
    }

    if(req.query.authorname)
    {
        const regex = new RegExp(escapeRegex(req.query.authorname), 'gi');
        Book.aggregate([
            {
                $lookup:{
                    from:"authors",
                    localField:"authorId",
                    foreignField:"_id",
                    as:"author"
                }
            },
            {
                $unwind:"$author"
            },
            {
                $match:{
                    "author.name":regex
                }
            }
        ])
        .then(bookByAuthor => {
            if(req.session.userId || req.user)
            {
                if(req.user)
                {
                    res.render("site/books/search",{bookByAuthor:bookByAuthor,user:req.user,socialProfile:true});
                }
                else if(req.session.userId)
                {
                    res.render("site/books/search",{bookByAuthor:bookByAuthor,user:true,socialProfile:false});
                }
                else
                {
                    res.render("site/books/search",{bookByAuthor:bookByAuthor,user:false});
                }
            }
            else
            {
                res.status(404);
                res.redirect("/users/login");
            }
            
        })
        .catch(err => res.json(err));
    }

    if(req.query.category)
    {
        const regex = new RegExp(escapeRegex(req.query.category), 'gi');
        Book.aggregate([
            {
                $lookup:{
                    from:"authors",
                    localField:"authorId",
                    foreignField:"_id",
                    as:"author"
                }
            },
            {
                $unwind:"$author"
            },
            {
                $match:{
                    category:regex
                }
            }
        ])
        .then((bookByCategory) => {
            if(req.session.userId || req.user)
            {
                if(req.user)
                {
                    res.render("site/books/search",{bookByCategory:bookByCategory,user:req.user,socialProfile:true});
                }
                else if(req.session.userId)
                {
                    res.render("site/books/search",{bookByCategory:bookByCategory,user:true,socialProfile:false});
                }
                else
                {
                    res.render("site/books/search",{bookByCategory:bookByCategory,user:false});
                }
            }
            else
            {
                res.status(404);
                res.redirect("/users/login");
            }
            
        })
        .catch(err => res.json(err));
    }

};

exports.LastAddedBooks = (req,res) => 
{
    Book.aggregate([
        {
            $lookup:{
                from:"authors",
                localField:"authorId",
                foreignField:"_id",
                as:"author"
            }
        },
        {
            $unwind:"$author"
        },
        {
            $sort:{
                createdDate:-1
            }
        },
        {
            $limit:5
        }
    ])
    .then(data => {
        if (req.session.userId || req.user) {
            if(req.user)
            {
                res.render("site/books/lastAdded",{data:data,user:req.user,socialProfile:true});
            }
            else if(req.session.userId)
            {
                res.render("site/books/lastAdded",{data:data,user:true,socialProfile:false});
                
            }
            else
            {
                res.render("site/books/lastAdded",{data:data,user:false});
            }
        }
        else {
            res.status(404);
            res.redirect("/users/login");
        }
        
    }) 
    .catch(err => res.json(err));
};

exports.Top10Book = (req,res) => 
{
    Book.aggregate([
        {
            $lookup:{
                from:"authors",
                localField:"authorId",
                foreignField:"_id",
                as:"author"
            }
        },
        {
            $unwind:"$author"
        },
        {
            $sort:{
                puan:-1
            }
        },
        {
            $limit:10
        }
    ])
    .then(data => {
        if (req.session.userId || req.user) {
            if(req.user)
            {
                res.render("site/books/top10",{data:data,user:req.user,socialProfile:true});
            }
            else if(req.session.userId)
            {
                res.render("site/books/top10",{data:data,user:true,socialProfile:false});
            }
            else
            {
                res.render("site/books/top10",{data:data,user:false});
            }
        }
        else {
            res.status(404);
            res.redirect("/users/login");
        }
    }) 
    .catch(err => res.json(err));
}

exports.MostRentBooks = (req,res) => 
{
    User.aggregate([
        {
            $match:{}
        },
        {
            $unwind:"$book_id"
        },
        {
            $group:{
                _id:"$book_id",
                count:{$sum:1}
            }
        }
    ])
    .then((data) => {
        let obje = {};
        for(let i=0;i<data.length;i++)
        {
            if(data[i].count > 1)
            {
                obje = data[i];
            }
        }
        console.log(obje);
        Book.findById(obje._id)
        .then((book) => {
            if (req.session.userId || req.user) {
                if(req.user)
                {
                    res.render("site/books/mostRent",{book:book.toJSON(),user:req.user,socialProfile:true});
                }
                else if(req.session.userId)
                {
                    res.render("site/books/mostRent",{book:book.toJSON(),user:true,socialProfile:false});
                    
                }
                else
                {
                    res.render("site/books/mostRent",{book:book.toJSON(),user:false});
                }
            }
            else {
                res.status(404);
                res.redirect("/users/login");
            }
        });
        
    })
};

exports.GetBookById = (req,res) => 
{
    Book.findById(req.params.bookId)
    .then(data => {
        if (req.session.userId || req.user) {
            res.json(data);
        }
        else {
            res.status(404);
            //res.json({message:"Kitabı çekerken hata Oluştu"});
            res.redirect("/users/login");
        }
    })
    .catch(err => res.json(err));
}

exports.CreateBook = (req,res) => 
{
    Book.create(req.body)
    .then(data => res.json(data))
    .catch(err => res.json(err));
};

exports.DeleteBookById = (req,res) => 
{
    Book.findByIdAndDelete(req.params.bookId)
    .then(data => res.json({status:"ok",message:"Book Deleted!"}));
}