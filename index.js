import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './Database/dbconfig.js'
import userRouter from './Routers/user.router.js'

dotenv.config()
const port=process.env.PORT

const app=express()

app.search(cors())
app.use(express.json())
app.use('/api/user',userRouter)

connectDB();

app.listen(port,()=>{
    console.log("App is Listening",port);
})