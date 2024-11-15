import express, {Express, Request, Response } from "express";
import dotenv from "dotenv"
import {contactRouter} from './routes/contactRoutes'
import { subscriptionRouter } from "./routes/subscriptionRoutes";
import { connectToDb } from "./config/dbConnection";
import { blogRouter } from "./routes/blogRoutes";
import { authRouter } from "./routes/authRoutes";
// Load environment variables
dotenv.config()

const app: Express = express()
const port= process.env.PORT

// Establish connection to mongo_atlas db
connectToDb()

app.use(express.json())
app.use('/api', contactRouter)
app.use('/api',subscriptionRouter )
app.use('/api', blogRouter)
app.use('/api/auth', authRouter)
app.get("/", (req: Request, res: Response)=>{
    res.send("Express with ts")
})

 
app.listen(port, ()=>{
    console.log(`running on http://localhost:${port}`);
})