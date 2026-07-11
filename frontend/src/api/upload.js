import apiClient, { unwrapData } from './client';
export function uploadCover(file) {
    const formData = new FormData();
    formData.append('file', file);
    return unwrapData(apiClient.post('/uploads/cover', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }));
}
export function uploadContentImages(files) {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });
    return unwrapData(apiClient.post('/uploads/content-images', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }));
}
