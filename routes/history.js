const express=require("express");
const { authMiddleware } = require("../middleware");
const { History } = require("../DB");
const router=express.Router();


router.get("/",authMiddleware,async(req,res)=>{
    const userHistory=await History.find({
        $or:[{
            to:req.userId
        },
        {
            from:req.userId
        }
            
        ]
    }).populate(
        'to'
    ).populate('from').exec()
    console.log("======")
    console.log(userHistory);
    console.log("******")

    return res.status(200).json({
        history:userHistory
    })
});

module.exports=router;