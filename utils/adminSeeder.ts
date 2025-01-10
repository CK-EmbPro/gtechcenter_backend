import { UserModel } from "../models/User";
import dotenv from "dotenv"

dotenv.config()

export const seedAdminUser = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL; // Replace or load from environment
        const adminPassword = process.env.ADMIN_PASSWORD
        const existingAdmin = await UserModel.findOne({ email: adminEmail });
        if (existingAdmin) {
            return;
        }

        const adminUser = new UserModel({
            first_name: "Admin",
            last_name: "admin",
            email: adminEmail,
            phone_number: 2345768879, // Replace with a valid phone number
            password: adminPassword, // Replace with a secure password
        });

        await adminUser.save();

        console.log("Admin user created successfully.");

    } catch (error) {
        if(error instanceof Error){
            throw new Error(error.message)
        }
    }
};
