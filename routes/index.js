const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  if(req.session.userId || req.user)
  {
    res.redirect("/books");
  }
  else
  {
    res.redirect("/users/login");
  }
  
  // if(req.user)
  // {
  //   res.render("site/books/booksPage",{user:req.user,socialProfile:true});
  // }
  // else if(req.session.userId)
  // {
  //   res.render("site/books/booksPage",{user:true,socialProfile:false});
  // }
  // else
  // {
  //   res.render("site/books/booksPage",{user:false});
  // }
  
});

module.exports = router;
