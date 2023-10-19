import User from "../Models/user.schema.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
//Email config
const transporter = nodemailer.createTransport({
      service:"gmail",
      auth:{
         user:"sanjaysanjay132002@gmail.com",
         pass:"ahov jnwv ayrm oxcm"
      }
})
 
export const registerUser =async(req,res)=>{
    try {
        console.log(req.body);
        const {username,password,email}=req.body
        if(!password){
            return res.status(400).json({message:"password required"})
        }
        const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
       const hashPassword= await bcrypt.hash(password,10)
       //console.log("hashPassword",hashPassword);

       const newUser=new User({username,email,password:hashPassword})
       await newUser.save()
      res.status(200).json({message:"User registered Successfully", data:newUser})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Register failed, Internal error"})
    }
}

export const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body
       const user= await User.findOne({email})
       if(!user){
        return res.status(401).json({message:"User not found"})
       }

      const passwordMatch= await bcrypt.compare(password,user.password)
      if(!passwordMatch){
        return res.status(401).json({message:"Invalid user password"})
      }

      const token=jwt.sign({_id:user._id},process.env.JWT_SECRET)
      res.status(200).json({message:"Login Successfully",token:token})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Login failed, Internal error"})
    }
}

 export const getUserById=async(req,res)=>{
    try {
        const userId=req.user._id
        const user=await User.findById(userId)
        res.status(200).json(user)
    } catch (error) {
        console.log(err);
        res.status(500).json({err:"eroor in get user by id"})
    }
}

export const passwordResetviamail=async(req,res)=>{
    console.log(req.body);

    const {email} =req.body;

    if(!email){
        res.status(400).json({status:400,message:"Enter your Email"})
    }

    try {
        const user=await User.findOne({email:email})

        const token =jwt.sign({_id:user._id},process.env.JWT_SECRET)
       res.status(200).json({expiresIn:"150s",token:token})
        //console.log("token",token);
        const setusertoken=await User.findByIdAndUpdate({_id:user._id},{verifytoken:token},{new:true})
        //console.log("setusertoken",setusertoken);

        if(setusertoken){
            const mailOptions={
                from:"sanjaysanjay132002@gmail.com",
                to:email,
                subject:"Sending Email for password Reset",
                text:`This Link Valid for 3 MINUTES http://localhost:5173/forgotpassword/${user.id}/${setusertoken.verifytoken}`
            }

            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log("error",error);
                    res.status(400).json({status:400,message:"email not send"})
                }else{
                    console.log("Email send",info.response);
                    res.status(200).json({status:200,message:"email sent Succesccfully"})
                }
            })
        }
    } catch (error) {
        res.status(400).json({status:400,message:"Invalid user"})
    }
}