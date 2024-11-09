    import fs from "fs";
    import cloudinary from "./cloudinaryConfig";

    export const uploadImage = async (filePath:string) => {
        try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "blogs", // Optional: specify a folder in your Cloudinary account
        });


        fs.unlinkSync(filePath)
        return result.url; // URL of the uploaded image
        } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
        }
    };
    