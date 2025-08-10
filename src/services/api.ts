import axios from 'axios';
import { Form, Submission } from '../types/form';

// Use relative '/api' on production (same Vercel domain). In dev, allow override with VITE_API_URL or default to localhost.
const API_BASE_URL = (typeof window !== 'undefined' && window.location.hostname !== 'localhost')
  ? '/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const formApi = {
  // Get all forms
  getForms: () => api.get<Form[]>('/forms'),
  
  // Get form by ID
  getForm: (id: string) => api.get<Form>(`/forms/${id}`),
  
  // Create new form
  createForm: (form: Partial<Form>) => api.post<Form>('/forms', form),
  
  // Update form
  updateForm: (id: string, form: Partial<Form>) => api.put<Form>(`/forms/${id}`, form),
  
  // Delete form
  deleteForm: (id: string) => api.delete(`/forms/${id}`),
  
  // Submit form response
  submitForm: (id: string, submission: Partial<Submission>) => 
    api.post<{ message: string; submissionId: string }>(`/forms/${id}/submit`, submission),
  
  // Get form submissions
  getFormSubmissions: (id: string) => api.get<Submission[]>(`/forms/${id}/submissions`),
  
  // Get single submission
  getSubmission: (formId: string, submissionId: string) => 
    api.get<Submission>(`/forms/${formId}/submissions/${submissionId}`),
  
  // Publish/unpublish form
  publishForm: (id: string, isPublished: boolean) => 
    api.patch<Form>(`/forms/${id}/publish`, { isPublished }),
};

export const uploadApi = {
  // Upload image
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    return api.post<{ message: string; imageUrl: string; filename: string }>(
      '/upload/image', 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
  
  // Delete image
  deleteImage: (filename: string) => api.delete(`/upload/image/${filename}`),
};

export default api;