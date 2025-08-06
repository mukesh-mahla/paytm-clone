import { NextFunction, Request, Response } from "express";
import JWT_SECERET from "./config";
import  jwt  from "jsonwebtoken";

interface Jwt{
    id:string
}

const authMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization
    
    if(!authHeader){
        return res.json({msg:"token is not provided"})
    }
    const token = authHeader.replace("Bearer ", "").trim();
   
    try{
         const decode =  jwt.verify(token,JWT_SECERET) as Jwt
        
        if(decode.id){
          // @ts-ignore
         req.userId = decode.id
         next()
        }
        }catch(e){
            console.log(e)
            return res.status(403)
        }
}


export default authMiddleware