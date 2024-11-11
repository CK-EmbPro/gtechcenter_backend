import cloudinary from "../config/cloudinaryConfig"

// Use publicId to destroy / delete an image from cloudinary
export const deleteCloudinaryImage =async (imagePublicId: string)=>{
    try {
        const result= await cloudinary.uploader.destroy(imagePublicId)
        console.log('deleted cloudinary image', result);
        return result;
    } catch (error) {
        throw new Error("Failed to delete image from cloudinary")
    }
}