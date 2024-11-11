import { Document, model, Schema } from "mongoose";
import bcrypt from 'bcryptjs'
import { User } from "../types";

interface UserDocument extends Document, User {
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>({
    names: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true}
})


userSchema.pre('save',  async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10)
})


userSchema.methods.comparePassword = async function(password: string){
    return await bcrypt.compare(password, this.password)

}

export const UserModel = model<UserDocument>('users', userSchema)