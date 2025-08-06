import 'dotenv/config'
import express from "express"
import mongoose from "mongoose"
import router from "./routes/mainRouter"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/v1',router)


 function main(){
 mongoose.connect(process.env.MONGO_URL!).then(()=>{console.log("mongo connected")})
    app.listen(3000)
}

main()