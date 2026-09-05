import api from './api';
import axios from 'axios';

export const uploadImage = async (file) => {
  // 1. Get a signed upload signature from OUR backend (proves the user is authorized)
  const { data: sig } = await api.get('/upload/signature');

  // 2. Upload the file directly to Cloudinary using that signature
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', sig.apiKey);
  formData.append('timestamp', sig.timestamp);
  formData.append('signature', sig.signature);
  formData.append('folder', sig.folder);

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`;
  const { data } = await axios.post(cloudinaryUrl, formData); // plain axios — NOT our `api` instance, this goes to Cloudinary, not our backend

  return { url: data.secure_url, publicId: data.public_id };
};

export const deleteImage = async (publicId) => {
  await api.post('/upload/delete', { publicId });
};