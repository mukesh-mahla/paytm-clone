import express from "express"
import mongoose from "mongoose"
import router from "./routes/mainRouter"
import cors from "cors"
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/v1',router)


function main(){
mongoose.connect("mongodb+srv://mukeshmahla7014:TAdqB7YQT7p%25bKR@paytm-db.nq5fv2u.mongodb.net/").then(()=>{console.log("mongo connected")})
    app.listen(3000)
}

main()