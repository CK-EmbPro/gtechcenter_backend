import { Document, model, Schema } from "mongoose";
import bcrypt from 'bcryptjs'
import { User } from "../types";
import { ROLES } from "../constants/userRoles";

interface UserDocument extends Document, User {
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>({
    first_name: {type: String, require: [true, 'firstname are required']},
    last_name: {type: String, require: [true, 'lastname are required']},
    email: {type: String, require: true, unique: true, match: [/.+@.+\..+/, "Please enter a valid email address"]},
    phone_number: {type: Number, require: [true, "Phone_number is required"]},
    password: {type: String, require: [true, "Password is required"], min: [10, "Password must be at least 10 characters"]},
    role: {type: String, enum: {
        values: [ROLES.USER, ROLES.ADMIN],
        message: "Invalid {VALUE} role, accepted ones are USER and ADMIN"
    }, default: ROLES.USER}
})


userSchema.pre('save',  async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10)
})


userSchema.methods.comparePassword = async function(password: string){
    return await bcrypt.compare(password, this.password)

}

export const UserModel = model<UserDocument>('users', userSchema)