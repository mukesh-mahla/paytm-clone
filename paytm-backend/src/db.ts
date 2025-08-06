import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:String,
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const accountSchema = new mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    balance :{
        type:Number,
        required:true
    }
})

export const User = mongoose.model("user",userSchema)
export const Account = mongoose.model("account",accountSchema)