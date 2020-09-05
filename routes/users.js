const express = require('express');
const router = express.Router();
const passport = require("passport");

const UserController = require("../controllers/UserController");

router.get("/register",(req,res) => {
  res.render("site/register");
});

router.get("/login",(req,res) => {
  res.render("site/login");
});

router.get("/login/google",passport.authenticate("google",{
    scope: ["profile","email"]
}));

router.get("/login/github",passport.authenticate("github",{
  scope: ["profile","email"]
}));

router.get("/login/google/redirect",passport.authenticate("google",{failureRedirect: "/users/login"}),(req,res) => {
  res.redirect("/books");
});

router.get("/login/github/redirect",passport.authenticate("github",{failureRedirect: "/users/login"}),(req,res) => {
  res.redirect("/books");
});

router.get("/socialProfile",UserController.authCheck,(req,res) => {
  UserController.GetSocialProfile(req,res);
});

router.get("/profile",(req,res) => {
  UserController.GetNormalProfile(req,res);
});

router.get("/twoAuth",(req,res) => {
  res.render("site/ikiasamalidogrulama");
});

router.get("/forgetPass",(req,res) => {
  res.render("site/sifremiUnuttum");
});

router.post("/forgetPass",(req,res) => {
  UserController.ForgetPassManager(req,res);
});

router.get("/updatePass/:id",(req,res) => {
  res.render("site/sifreGuncelle",{id:req.params.id});
});

router.post("/updatePass/:id",(req,res) => {
  UserController.UpdateUser(req,res);
});

router.post("/twoAuth",(req,res) => {
  UserController.TwoAuthVerification(req,res);
});

router.post("/register",(req,res) => {
  UserController.RegisterUser(req,res);
});

router.post("/login",(req,res) => {
  UserController.LoginUser(req,res);
});

router.delete("/delete/:userId",(req,res) => {
  UserController.DeleteUserById(req,res);
});

router.put("/update/:userId",(req,res) => {
  UserController.UpdateUserById(req,res);
});

router.get("/logout",(req,res) => {
  req.session.destroy(() => {
    res.redirect("/books");
  });
});

router.get("/logoutSocialAccount",(req,res) => {
  req.logout();
  res.redirect("/books");
});


module.exports = router;
