import { apiClient } from "./apiClient";

export interface ImageKitAuth {
  token: string;
  expire: number;
  signature: string;
}

export const getImageKitAuthAPI =
  async (): Promise<ImageKitAuth> => {
    const result = await apiClient("/api/imagekit/auth", {
      method: "GET",
    });

    return result.data as ImageKitAuth;
  };

export interface ImageKitUploadResult {
  url: string;
  fileId: string;
}

export const uploadImageToImageKit = async (
  file: File
): Promise<ImageKitUploadResult> => {
  const auth = await getImageKitAuthAPI();

  const formData = new FormData();

  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append(
    "publicKey",
    import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY
  );
  formData.append("token", auth.token);
  formData.append("expire", auth.expire.toString());
  formData.append("signature", auth.signature);

  const response = await fetch(
    "https://upload.imagekit.io/api/v1/files/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ?? "Failed to upload image."
    );
  }

  if (!data?.url || !data?.fileId) {
    throw new Error(
      "ImageKit did not return the required file information."
    );
  }

  return {
    url: data.url,
    fileId: data.fileId,
  };
};