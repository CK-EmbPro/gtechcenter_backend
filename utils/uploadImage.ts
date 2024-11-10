import fs from "fs";
import cloudinary from "../config/cloudinaryConfig";
import path from "path";
import crypto from "crypto"
import { match } from "assert";

export const uploadImage = async (filePath: string) => {
  try {
    const folder = "blogs";
    const fileName = path.basename(filePath);
    const fileHash = crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')

    const existingImage = await cloudinary.search
      .expression(`folder:${folder} AND filename:${fileName} AND public_id:${fileHash}`)
      .max_results(10)
      .execute();

      const matchedImage = existingImage.resources.find((image)=>{
        return image.public_id&& image.signature === fileHash
    }
    )
      
    if (matchedImage) {
      console.log("IMage exists there in cloud storage");
      const existingImageUrl = matchedImage.secure_url;
      const existingImagePublicId = matchedImage.public_id;

      fs.unlinkSync(filePath);
      
      const containingDirectoryPath = path.dirname(filePath);
      fs.rmSync(containingDirectoryPath, { recursive: true, force: true });

      return {
        imageUrl: existingImageUrl,
        imagePublicId: existingImagePublicId,
      };
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "blogs", // Optional: specify a folder in your Cloudinary account
    });

    fs.unlinkSync(filePath);
    // determine the containing folder
    const containingDirectoryPath = path.dirname(filePath);
    // remove the folder and all its contents after uploading to cloudinary
    fs.rmSync(containingDirectoryPath, { recursive: true, force: true });

    return { imageUrl: result.url, imagePublicId: result.public_id }; // URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
