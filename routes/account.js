const express=require("express");
const { authMiddleware } = require("../middleware");
const { Account, History } = require("../DB");
const mongoose=require("mongoose")
const router=express.Router();

router.get("/balance",authMiddleware,async(req,res)=>{
    const account=await Account.findOne({
        userId:req.userId
    })

    return res.status(200).json({
        balance:account.balance
    })
})

router.post("/transfer",authMiddleware,async(req,res)=>{
    const session = await mongoose.startSession();
    console.log(req.body)
    session.startTransaction();
    const {to,amount}=req.body;

    const fromAccount=await Account.findOne({
        userId:req.userId
    }).session(session);

    if(!fromAccount || fromAccount.balance <amount)
    {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount=await Account.findOne({
        userId:to
    }).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    await Account.updateOne({ userId: req.userId },{$inc:{balance:-amount}}).session(session);
    await Account.updateOne({userId:to},{$inc:{balance:amount}}).session(session);

    await session.commitTransaction();

    await History.create({
        to:to,
        from:req.userId,
        amount:amount
    });

    res.json({
        message: "Transfer successful"
    });    
})


module.exports=router