import mongoose from "mongoose"
import dotenv from "dotenv"
import { NotFoundError } from "../exceptions/errors"
dotenv.config()

const mongoAtlasUri = process.env.MONGO_ATLAS_URI

export const connectToDb = ()=>{
    try {
        if(!mongoAtlasUri) throw new NotFoundError("No mongoatlas connection string provided")
        mongoose.connect(mongoAtlasUri)
        .then(()=> {
            console.log('Connected to db');
        })
        .catch(error=>{
            console.log('Error connecting to db', error);
            setTimeout(connectToDb, 2000)
        })
    } catch (error) {
        if(error instanceof NotFoundError){
            console.log('Error :', error.message);
        }
    }
  
}

