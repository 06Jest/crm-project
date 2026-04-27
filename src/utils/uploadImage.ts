export const uploadImageToCloudinary = async (
  file: File
) : Promise <string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || ! uploadPreset) {
    throw new Error (
      'Cloudinary not configured. Check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env'
    );
  }

  const formData = new FormData();
  formData.append('file', file);;
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'avatars');


  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );


  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await response.json();

  return data.secure_url as string;
};

export const validateImageFile = (file: File): string | null => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSizeMB = 5;

  if (!allowedTypes.includes(file.type)) {
    return 'Please upload a JPEG, PNG, WEBP or GIF image';
  }

  if(file.size > maxSizeMB * 1024 * 1024) {
    return `Image must be smaller that ${maxSizeMB}`;
  } 
  return null;
}
