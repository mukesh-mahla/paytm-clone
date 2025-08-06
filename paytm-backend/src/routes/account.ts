import { Router } from "express";
import authMiddleware from "../middleware";
import { Account } from "../db";
import mongoose from "mongoose";

const router = Router()

router.get("/balance",authMiddleware,async(req,res)=>{
   try{ const account= await  Account.findOne({
        // @ts-ignore
        userId:req.userId
    })
        res.json({balance:account?.balance})}catch(e){
        res.json({msg:"invalid token"})
    }
})

router.post("/transfer",authMiddleware,async(req,res)=>{
    const session = await mongoose.startSession()
try{
    session.startTransaction()
    const {amount,to} = req.body
// @ts-ignore
    const account = await Account.findOne({userId:req.userId}).session(session)
 if(!account || account.balance < amount){
    return res.status(400).json({msg:"insufficiant balance"})
 }
  
 const toAccount = await Account.findOne({userId:to}).session(session)

 if(!toAccount){
    await session.abortTransaction();
    return res.status(400).json({msg:"invalid account"})
 }
    //  @ts-ignore
 if (req.userId === to) {
  return res.status(400).json({ msg: "Cannot transfer to self" });
}
// @ts-ignore
 await Account.updateOne({userId:req.userId},{"$inc":{balance: -amount}}).session(session)
await Account.updateOne({userId:to},{"$inc":{balance: amount}}).session(session)

await session.commitTransaction()

res.json({
    msg:"transfer succesfully"
})}catch(e)
{await session.abortTransaction();
    console.log(e)
    res.status(500).json({msg:"transaction failed"})
}finally{
    session.endSession()
}
})


export default router