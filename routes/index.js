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
  
});

module.exports = router;
