const express=require("express");
const router=express.Router();
const userRouter=require("./user");
const accountRouter=require("./account");
const historyRouter=require("./history");

router.use("/user",userRouter);
router.use("/account",accountRouter);
router.use("/history",historyRouter);

module.exports=router;