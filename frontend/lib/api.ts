import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── API helpers ─────────────────────────────────────────
export const destinationsApi = {
  getAll: (params?: any) => api.get('/destinations', { params }),
  getFeatured: () => api.get('/destinations/featured'),
  getBySlug: (slug: string) => api.get(`/destinations/${slug}`),
  create: (data: any) => api.post('/destinations', data),
  update: (id: number, data: any) => api.put(`/destinations/${id}`, data),
  delete: (id: number) => api.delete(`/destinations/${id}`),
};

export const toursApi = {
  getAll: (params?: any) => api.get('/tours', { params }),
  getFeatured: () => api.get('/tours/featured'),
  getById: (id: number) => api.get(`/tours/${id}`),
  create: (data: any) => api.post('/tours', data),
  update: (id: number, data: any) => api.put(`/tours/${id}`, data),
  delete: (id: number) => api.delete(`/tours/${id}`),
};

export const homestaysApi = {
  getAll: (params?: any) => api.get('/homestays', { params }),
  getFeatured: () => api.get('/homestays/featured'),
  getById: (id: number) => api.get(`/homestays/${id}`),
  create: (data: any) => api.post('/homestays', data),
  update: (id: number, data: any) => api.put(`/homestays/${id}`, data),
  delete: (id: number) => api.delete(`/homestays/${id}`),
};

export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { email: string; password: string; name: string; phone?: string }) =>
    api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateMe: (data: any) => api.put('/auth/me', data),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  verifyOTP: (email: string, otp: string) => api.post('/auth/verify-otp', { email, otp }),
  verifyRegister: (otp: string, registrationToken: string) => 
    api.post('/auth/verify-register', { otp, registrationToken }),
  resetPassword: (email: string, otp: string, newPassword: string) => 
    api.post('/auth/reset-password', { email, otp, newPassword }),
};

export const bookingsApi = {
  create: (data: any) => api.post('/bookings', data),
  getMy: (params?: any) => api.get('/bookings/my', { params }),
  getById: (id: number) => api.get(`/bookings/${id}`),
  cancel: (id: number) => api.put(`/bookings/${id}/cancel`),
};

export const paymentsApi = {
  create: (bookingId: number) => api.post('/payments/create', { bookingId }),
  getStatus: (orderCode: string) => api.get(`/payments/status/${orderCode}`),
};

export const searchApi = {
  search: (params: any) => api.get('/search', { params }),
  suggestions: (q: string) => api.get('/search/suggestions', { params: { q } }),
  trending: () => api.get('/search/trending'),
};

export const aiApi = {
  generate: (data: any) => fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/ai/generate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''}`,
      },
      body: JSON.stringify(data),
    }
  ),
  save: (data: any) => api.post('/ai/save', data),
  getTrips: () => api.get('/ai/trips'),
};

export const reviewsApi = {
  get: (type: string, id: number) => api.get(`/reviews/${type}/${id}`),
  create: (data: any) => api.post('/reviews', data),
};

export const wishlistApi = {
  get: () => api.get('/wishlist'),
  add: (data: { itemType: string; itemId: number }) => api.post('/wishlist', data),
  remove: (itemType: string, itemId: number) => api.delete(`/wishlist/${itemType}/${itemId}`),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getBookings: (params?: any) => api.get('/admin/bookings', { params }),
  updateBookingStatus: (id: number, status: string) => api.patch(`/admin/bookings/${id}/status`, { status }),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUserRole: (id: number, role: string) => api.patch(`/admin/users/${id}/role`, { role }),
};

export const uploadApi = {
  uploadSingle: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadMultiple: (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('images', file));
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
