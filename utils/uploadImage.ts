import fs from "fs";
import cloudinary from "../config/cloudinaryConfig";
import path from "path";
import crypto from "crypto";

export const uploadImage = async (filePath: string) => {
  try {
    const folder = "blogs";
    const fileName = path.basename(filePath);
    // now remove the file extension
    const onlyFileName = path.parse(fileName).name.replace(/\s+/g, '');

    // Search if the uploaded file exists there at cloudinary
    const existingImage = await cloudinary.search
      .expression(`folder:${folder} AND filename:${onlyFileName}`)
      .max_results(1)
      .execute();

    // Check if the uploaded file truly exists 
    if (existingImage.resources[0]) {
      
      const matchedImage = existingImage.resources[0];
      fs.unlinkSync(filePath);
      const containingDirectoryPath = path.dirname(filePath);
      fs.rmSync(containingDirectoryPath, { recursive: true, force: true });

      return {
        imageUrl: matchedImage.secure_url,
        imagePublicId: matchedImage.public_id,
        fileName
      };
    }

    // Now upload the image to the cloudinary if is not there
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "blogs",
      use_filename: true,
      unique_filename: true,
    });

    fs.unlinkSync(filePath);
    const containingDirectoryPath = path.dirname(filePath);
    fs.rmSync(containingDirectoryPath, { recursive: true, force: true });

    return { 
      imageUrl: result.secure_url, 
      imagePublicId: result.public_id,
      fileName
    };

  } catch (error) {
    throw error
  }
};
