const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema=new mongoose.Schema({
    name:{
        type : String,
        required : [true,"provide email"],
        trim : true,
    },
    email:{
        type: String,
        required: true,
        unique : true,
        trim : true,
        match : [/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Please Enter a valid email address"]
    },
    password:{
        type : String,
        required : [true,"provide password"],
        minLength : 6,
    },
    role:{
        type : String,
        enum : ["customer","admin"],
        default : "customer",
    },
  refresh_token:{
    type : String,
    default : ""
  },
  verify_email:{
    type : Boolean,
    default : false
  },
  orderHistory:[{
    type: mongoose.Schema.ObjectId,
    ref : "Order"
  }],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref : "Product",
    }
  ],
  forgot_password_otp:{
    type : String,
    defaukt : null
  },
  forgot_password_expiry:{
    type : Date,
    default : ""
  }
},{timestamps: true}
);


//Password Hashing middleware (during register)
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next;
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password,salt);
    next();
});

// compare user entered password with Hashed password
userSchema.methods.matchPassword= async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
};

module.exports=mongoose.model("User",userSchema);