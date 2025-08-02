import api from '@/services/api.js';

export const loginUser = async ({ username, email, password }) => {
    try {
        const response = await api.post('/users/login', {
            username,
            email,
            password
        })

        if (response.status === 200) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        } else {
            throw new Error(response.data.message);
        }

    } catch (error) {
        throw error.response?.data || error;
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}