import express, {Express, Request, Response } from "express";
import dotenv from "dotenv"
import {contactRouter} from './routes/contactRoutes'
import { subscriptionRouter } from "./routes/subscriptionRoutes";
import { connectToDb } from "./config/dbConnection";
import { blogRouter } from "./routes/blogRoutes";
import { authRouter } from "./routes/authRoutes";
import cors from 'cors'

// Load environment variables
dotenv.config()

const app:Express = express()
const port= process.env.PORT


app.use(cors({
    origin: "*"
}))

// Establish connection to mongo_atlas db
connectToDb()
app.use(express.json())

app.get('/', (req:Request, res: Response)=>{
    res.send('home page')
})
app.use('/api/auth', authRouter)
//@ts-ignore
app.use('/api', contactRouter)
//@ts-ignore
app.use('/api', subscriptionRouter )
//@ts-ignore
app.use('/api', blogRouter)


 
app.listen(port, ()=>{
    console.log(`listening on http://localhost:${port}`);
})