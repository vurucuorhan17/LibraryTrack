const express = require("express");
const router = express.Router();

const BookController = require("../controllers/BookController");

router.get("/",(req,res) => {
    BookController.GetAllBook(req,res);
});

router.get("/search",(req,res) => {
    BookController.SearchBooks(req,res);
});

router.get("/lastAdded",(req,res) => {
    BookController.LastAddedBooks(req,res);
});

router.get("/top10",(req,res) => {
    BookController.Top10Book(req,res);
});

router.get("/mostRent",(req,res) => {
    BookController.MostRentBooks(req,res);
});

router.get("/:bookId",(req,res) => {
    BookController.GetBookById(req,res);
});

router.post("/new",(req,res) => {
    BookController.CreateBook(req,res);
});

router.delete("/delete/:bookId",(req,res) => {
    BookController.DeleteBookById(req,res);
});

module.exports = router;
