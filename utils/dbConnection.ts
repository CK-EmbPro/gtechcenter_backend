import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const mongoAtlasUri = process.env.MONGO_ATLAS_URI || ""

export const connectToDb = ()=>{
    mongoose.connect(mongoAtlasUri)
    .then(()=> {
        console.log('Connected to db');
    })
    .catch(error=>{
        console.log('Error connecting to db', error);
    })
}

