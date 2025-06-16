const User = require("../models/User");
const jwt =require("jsonwebtoken");
const sendOTPEmail = require("../utils/sendOTPEmail.js");

// @route POST /api/user/register
// @desc  Register a new user
// @access Public
const registerUserController = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password });
    await user.save();

    // Create JWT payload
    const payload = { user: { id: user._id, role: user.role } };

    // Send OTP email
    const otpResult = await sendOTPEmail(user);

    if (!otpResult.success) {
      return res.status(500).json({ message: 'User created but OTP failed to send', error: otpResult.error });
    }

    // Sign JWT and return user
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (err, token) => {
      if (err) throw err;
      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
        message: "User registered successfully and OTP sent",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

//@route POST /api/user/login
//@desc Authenticate user
//@access Public
const loginUserController = async (req,res)=>{
    const {email,password}=req.body;
    try{
        //Find the user by email
        let user = await User.findOne({ email });

        if(!user) return res.status(400).json({ message:"Invalid Credentials"});
        const isMatch=await user.matchPassword(password);
        if(!isMatch)
            return res.status(400).json({ message:"Invalid Credentials"});

        //create JWT Payload
        const payload={user:{id:user.__id,role:user.role}};

        //Sign and return the token along with user data
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn :"40h"},
            (err,token)=>{
                if(err) throw err;
                //Send the user and token in response
                res.json({
                    user:{
                        __id:user.__id,
                        name: user.name,
                        email:user.email,
                        role:user.role,
                    },
                    token
                })
            }
        );
    }catch(error){
        console.log(error);
        res.status(500).send("Server Error");
    }
}

module.exports ={registerUserController ,loginUserController};