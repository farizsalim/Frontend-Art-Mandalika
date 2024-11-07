import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/ARTM/api', // Ganti dengan URL backend Anda
    timeout: 10000, // Waktu tunggu 10 detik
    headers: {
        'Content-Type': 'application/json',
    },
});

// Menggunakan interceptor jika perlu
axiosInstance.interceptors.request.use(
    (config) => {
        // Tambahkan token atau header lain jika diperlukan
        const token = localStorage.getItem('token'); // Misalnya menyimpan token di localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
