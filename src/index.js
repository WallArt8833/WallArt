require("dotenv").config();
const express = require("express");
const cors = require("cors");

console.log('MONGO_URL:', process.env.MONGODB_URL); 

const wallRouter = require("./routes/wallroutes");
const mongoose  = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Wall Art API by Maverick Bits")
});

app.use("/wall",wallRouter);
 
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(()=>{
    app.listen(PORT,()=>{
        console.log("server started at port no 5000");
    });
}).catch((error)=>{
  console.log(error);
});