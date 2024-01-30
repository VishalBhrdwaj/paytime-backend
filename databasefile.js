const mongoose=require("mongoose");

try {
mongoose.connect(`${process.env.MONGODB_URL}`) 
} catch (error) {
    console.log("Helloe",error); 
}

const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
 
})


const historySchema=new mongoose.Schema({
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    amount:{
        type:Number,
        require:true
    }
})

const History=mongoose.model('History',historySchema);

const Account=mongoose.model('Account',accountSchema);

const User=mongoose.model('User',userSchema);

module.exports={
    User,
    Account,
    History
}