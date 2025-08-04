import api from '@/services/api.js';

export const loginUser = async ({ username, email, password }) => {
    try {
        const response = await api.post('/users/login', {
            username,
            email,
            password
        })

        if (response?.status === 200) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        } else {
            throw new Error(response.data.message);
        }

    } catch (error) {
        if (error?.message) {
            throw error
        } else if (error?.data?.message) {
            throw new Error(error.data.message)
        } else {
            throw new Error('Login failed')
        }
    }
}

export const registerUser = async (formData) => {
    try {
        const response = await api.post('/users/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        if (response?.status === 201) {
            localStorage.setItem('user', JSON.stringify(response.data.data))
            return response.data
        } else {
            throw new Error(response.data.message)
        }
    } catch (error) {        
        if (error?.message) {
            throw new Error(error.message)
        } else {
            throw new Error("Registration failed")
        }
    }
}