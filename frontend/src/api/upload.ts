import apiClient, { unwrapData } from './client';

export interface UploadSingleResponse {
  url: string;
}

export interface UploadMultipleResponse {
  urls: string[];
}

export function uploadCover(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return unwrapData<UploadSingleResponse>(
    apiClient.post('/uploads/cover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
}

export function uploadContentImages(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  return unwrapData<UploadMultipleResponse>(
    apiClient.post('/uploads/content-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
}
