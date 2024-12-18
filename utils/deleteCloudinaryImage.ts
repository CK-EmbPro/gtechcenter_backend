import cloudinary from "../config/cloudinaryConfig"
import { BadRequestError, NotFoundError } from "../exceptions/errors";

// Use publicId to destroy / delete an image from cloudinary
export const deleteCloudinaryImage =async (imagePublicId: string)=>{
    try {
        if(!imagePublicId){
            throw new NotFoundError("No image public id found")
        }
        const result= await cloudinary.uploader.destroy(imagePublicId)        
        return result;
    } catch (error) {
        throw error
    }
}