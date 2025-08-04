import api from '@/services/api'

export const updateAccountDetails = async ({
    fullName,
    email
}) => {
    try {
        const response = await api.patch('/users/update-account-details', {
            fullName,
            email
        })
        if (response?.status === 200) {
            return response
        } else {
            throw new Error(response.data.message)
        }
    } catch (error) {
        if (error?.message) {
            throw new Error(error.message)
        } else {
            throw new Error('Failed to update account details')
        }
    }
}

export const updatePassword = async ({
    currentPassword,
    newPassword
}) => {
    try {
        const response = await api.post('/users/change-password', {
            currentPassword,
            newPassword
        })
        if (response?.status === 200) {
            return response
        } else {
            throw new Error(response.data.message)
        }
    } catch (error) {
        if (error?.message) {
            throw new Error(error.message)
        } else {
            throw new Error('Failed to update password')
        }
    }
}