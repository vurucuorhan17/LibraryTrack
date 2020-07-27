const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/AdminController");

router.get("/", (req, res) => {
    AdminController.GetAdminPage(req,res);
});

router.post("/books/new", (req, res) => {
    AdminController.CreateNewBook(req,res);
});

router.put("/books/update", (req, res) => {
    AdminController.UpdateBook(req,res);
});

router.delete("/users/delete",(req,res) => {
    AdminController.DeleteUser(req,res);
});

router.put("/users/update",(req,res) => {
    AdminController.UpdateUser(req,res);
});

router.delete("/books/delete",(req,res) => {
    AdminController.DeleteBook(req,res);
});

module.exports = router;