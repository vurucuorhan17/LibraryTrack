const express = require("express");
const router = express.Router();

const Author = require("../models/Author");

router.post("/new",(req,res) => {
    Author.create(req.body)
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

module.exports = router;