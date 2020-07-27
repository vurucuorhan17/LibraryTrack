const router = require("express").Router();
const PaymentController = require("../controllers/PaymentController");

router.get("/",(req,res) => {
    res.redirect("/books");
});

router.get("/:id",(req,res) => {
    PaymentController.GetPaymentPage(req,res);
});

router.get("/odemeonaylama/:id",(req,res) => {
    PaymentController.CreatePayment(req,res);
});

router.get("/onay/:bookId/:userId/:price/:paymentId",(req,res) => {
    PaymentController.PaymentApprove(req,res);
});

router.get("/iade/:id",(req,res) => {
    PaymentController.CreateRebate(req,res);
});

router.get("/iadeTamam/:bookId/:userId/:price/:rebateId",(req,res) => {
    PaymentController.RebateApprove(req,res);
})

module.exports = router;