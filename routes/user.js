const express=require("express");
const router=express.Router();
const jwt=require("jsonwebtoken");
const zod=require("zod");
const { User, Account } = require("../DB");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");
const userSchema=zod.object({
    username:zod.string(),
    password:zod.string(),
    firstname:zod.string(),
    lastname:zod.string(),
})
const signinUserSchema=zod.object({
    username:zod.string(),
    password:zod.string()
})
const updateUserSchema=zod.object({
    firstname:zod.string().optional(),
    lastname:zod.string().optional(),
    password:zod.string().optional()
})

router.post("/signup",async(req,res)=>{

    const body=req.body;
    const {success}=userSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user=await User.findOne({
        username:body.username
    })
    console.log("user is here")
    console.log(user)

    if(user){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const newUser=await User.create({
        username:body.username,
        password:body.password,
        firstname:body.firstname,
        lastname:body.lastname
    })
    const userId=newUser._id;
    await Account.create({
        userId,
        balance:1+Math.random()*1000
    })

    const token=jwt.sign({userId:newUser._id},JWT_SECRET);


    res.status(200).json({
        message: "User created successfully",
        token:token
    })
})

router.post("/signin",async(req,res)=>{

    const body=req.body;
    const {success} =signinUserSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user=await User.findOne({
        username:body.username,
        password:body.password
    });

    if(user){
        const token=jwt.sign({userId:user._id},JWT_SECRET); 
        return res.status(200).json({
            token:token
        })
    }

    return res.status(411).json({
        message: "Error while logging in"
    })

})

router.put("/",authMiddleware,async(req,res)=>{
    const body=req.body;
    const {success} =updateUserSchema.safeParse(req.body);

    if(!success){
        res.status(411).json({
            message: "Error while updating information"
        })
    }


        try{
            const user=await User.updateOne({
                _id:req.userId
            },body)
        }
        catch(err){
            console.log("Error in update")
        }

        res.json({
            message: "Updated successfully"
        })
   
})

router.get("/bulk",authMiddleware,async(req,res)=>{
    const filter=req.query.filter || "";
    console.log(filter) 
    const users=await User.find({
        $or:[
            {
                firstname:{
                    "$regex":filter
                }
            },
            {
                lastname:{
                    "$regex":filter
                }
            }
        ]
    })

    res.json({
        users: users.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    })
})
module.exports=router;