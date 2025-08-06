import express from "express";
import z from "zod";
import { Account, User } from "../db";
import bcrypt from "bcrypt"
import  Jwt  from "jsonwebtoken";
import JWT_SECERET from "../config";
import authMiddleware from "../middleware";

const userRouter = express.Router();


const user = z.object({
    firstName:z.string(),
    lastName:z.string(),
    email: z.string().email(),
    password:z.string().min(6)
})



userRouter.post("/signup",async(req,res)=>{
   const result = user.safeParse(req.body)
     if(!result.success){
               return res.json({msg:"input are incorrect"})
              }
    const {firstName,lastName,email,password} = result.data
    const hashPassword = await bcrypt.hash(password,10)

       const users = await User.create({
            firstName,lastName,email,password:hashPassword
            })

    const userId = users._id
    await Account.create({
        userId,
        balance:1+Math.random()*10000
    })

   return res.json({msg:"signed up succesfully"})

})

userRouter.post("/signin",async(req,res)=>{
    const {email,password} = req.body
    const user = await User.findOne({email})
    if(!user){
        return res.json({msg:"user not found"})
    }
    const iscompare = await bcrypt.compare(password,user?.password)
    if(user && iscompare){
        const token = Jwt.sign({id:user._id},JWT_SECERET)
        return res.json({msg:"signed in succesfully",token:token})
    }
})

const updateBody = z.object({
    firstName:z.string().optional(),
    lastName:z.string().optional(),
    password:z.string().optional()
})

userRouter.put("/update",authMiddleware,async(req,res)=>{
    const result = updateBody.safeParse(req.body)
    if(!result.success){
        return res.status(411).json({msg:"wrong credential"})
    } 
    // @ts-ignore
    await User.updateOne({_id:req.userId},req.body)
 res.json({msg:"updated succesfully"})
})


userRouter.get("/bulk",async(req,res)=>{
const filter =req.query.filter || ""

const users = await User.find({
    $or: [{
        firstName:{
            "$regex":filter,"$options": "i"
        },
        lastName:{
            "$regex":filter,"$options": "i"
        }
    }]
})
  
 return res.json({
    user: users.map(user=>({
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email,
        _id:user._id
    }))
  })

})


export default userRouter