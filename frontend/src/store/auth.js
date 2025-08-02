import { create } from 'zustand';

const useAuthStore = create((set) => {
    return {
        user: null,
        setUser: (userData) => set({ user: userData }),
        logout: () => set({ user: null })
    }
})

export { useAuthStore };