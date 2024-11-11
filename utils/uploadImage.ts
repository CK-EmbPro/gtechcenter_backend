import fs from "fs";
import cloudinary from "../config/cloudinaryConfig";
import path from "path";
import crypto from "crypto";

export const uploadImage = async (filePath: string) => {
  try {
    const folder = "blogs";
    const fileName = path.basename(filePath);
    // now remove the file extension
    const onlyFileName = path.parse(fileName).name;

    // Search if the uploaded file exists there at cloudinary
    const existingImage = await cloudinary.search
      .expression(`folder:${folder} AND filename:${onlyFileName}`)
      .max_results(1)
      .execute();

    // Check if the uploaded file truly exists 
    if (existingImage.resources[0]) {
      console.log("Image already exists in cloud storage.");

      const matchedImage = existingImage.resources[0];
      fs.unlinkSync(filePath);
      const containingDirectoryPath = path.dirname(filePath);
      fs.rmSync(containingDirectoryPath, { recursive: true, force: true });

      return {
        imageUrl: matchedImage.secure_url,
        imagePublicId: matchedImage.public_id,
      };
    }

    // Now upload the image to the cloudinary if is not there
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "blogs",
      use_filename: true,
      unique_filename: false,
    });

    fs.unlinkSync(filePath);
    const containingDirectoryPath = path.dirname(filePath);
    fs.rmSync(containingDirectoryPath, { recursive: true, force: true });

    return { 
      imageUrl: result.secure_url, 
      imagePublicId: result.public_id 
    };

  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
