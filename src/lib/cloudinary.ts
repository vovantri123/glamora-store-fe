import axios from 'axios';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  [key: string]: unknown;
}

export const uploadToCloudinary = async (
  file: File,
  uploadPreset: string = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
    'glamora_store'
): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error('Cloudinary cloud name is not configured');
  }

  const response = await axios.post<CloudinaryUploadResponse>(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  // Note: Deletion requires server-side implementation for security
  // This is just a placeholder
  console.warn('Cloudinary deletion should be handled server-side');
};
