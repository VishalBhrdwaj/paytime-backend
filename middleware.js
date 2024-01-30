const jwt=require("jsonwebtoken");
const { JWT_SECRET } = require("./config");
const authMiddleware=(req,res,next)=>{

    const authorization=req.headers.authorization;
    console.log("I am in Auth")
    console.log(req.headers.authorization)
    console.log("Bye auth")
    if(!authorization || !authorization.startsWith("Bearer "))
        return res.status(403).json({
            
    })

    const token=authorization.split(" ")[1];
    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        if(decoded.userId){
            req.userId=decoded.userId;
             next();
        }
        else
            return res.status(403).json({
                mesg:"Invalid Token"
            })
    }catch(error){
        return res.status(403).json({
            mesg:"Unexpected error in auth"
        });
    }
}

module.exports={
    authMiddleware
}