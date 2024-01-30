const express = require("express");
const app=express();
const mainRouter=require("./routes/index");
const cors=require('cors')
require("dotenv").config({path:"./env"})
const PORT=3000;

app.use(cors());
app.use(express.json());
app.use("/api/v1",mainRouter);

app.listen(PORT,()=>{
    console.log(`Server Started${PORT}`)
})




