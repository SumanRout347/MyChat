const cloudinary = require('cloudinary').v2;

const upload = async (file) => {
    const image = await cloudinary.uploader.upload(
      file.tempFilePath,
      {folder:"chat"}
    )
    return image;
  };

  module.exports=upload