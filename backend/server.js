const express= require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const connectDB = require('./config/db.js');
const userRoutes=require("./routes/userRoutes.js");

const app=express();
app.use(express.json());
app.use(cors());

//add environmental variables
dotenv.config();

//connect to MongoDb
connectDB();

const PORT=process.env.PORT || 3000;


app.get("/",(req,res)=>{
  res.send("Welcome");  
});

//API Routes
app.use("/api/user",userRoutes);

app.listen(PORT,()=>{
    console.log(`Server Running at http://localhost:${PORT}`);
});
