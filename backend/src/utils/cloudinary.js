import { v2 as cloudinary } from 'cloudinary';

import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadOnCloudinary = async (localfile) => {
  if (!localfile) return null;
  try {
    const uploadResult = await cloudinary.uploader.upload(localfile, {
      resource_type: 'auto',
    });
    fs.unlinkSync(localfile);
    return uploadResult;
  } catch (error) {
    console.log('cloudinary upload error', error);
    fs.unlinkSync(localfile);
    return null;
  }
};

const delteFromCloudinary = async (id) => {
  try {
    if (!id) return;

    await cloudinary.uploader.destroy(id);
    console.log('Delteted frorm cloudinary');
  } catch (error) {
    console.log('Error while delteting from cloudinary', error);
    return null;
  }
};

export { uploadOnCloudinary, delteFromCloudinary };
