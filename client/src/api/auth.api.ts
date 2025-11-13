// src/api/auth.api.ts

import axios from 'axios';
import Cookies from 'js-cookie';
import { SignInFormData } from '@/screens/auth/signin/schema/schema';
import { SignupFormData } from '@/screens/auth/signup/schema/schema';
 
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/auth";

// Name of the cookie to store the JWT
const TOKEN_COOKIE_NAME = 'authToken';

 
export const setAuthTokenCookie = (token: string): void => {
    Cookies.set(TOKEN_COOKIE_NAME, token, {
        expires: 1, // 1 day expiration
        secure: process.env.NODE_ENV === 'production', // Use secure in production
        sameSite: 'Strict',
        path: '/',
    });
};

/**
 * Removes the JWT token cookie.
 */
export const removeAuthTokenCookie = (): void => {
    Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });
};

/**
 * Retrieves the token from the cookie.
 */
export const getAuthToken = (): string | undefined => {
    return Cookies.get(TOKEN_COOKIE_NAME);
};


// --- Authentication API Calls ---

/**
 * Calls the /api/auth/signup endpoint
 */
export const apiSignup = async (data: SignupFormData): Promise<void> => {
    // We omit confirmPassword as the backend doesn't need it
    const { fullName, email, password } = data;
    
    try {
        await axios.post(`${API_URL}/signup`, {
            full_name: fullName, // Mapped to backend's required field name
            email,
            password,
        });
        // On success, no token is returned, just a 201 status
    } catch (error) {
        // Axios wraps the error. We extract the message from the backend response.
        const errorMessage = axios.isAxiosError(error) 
            ? error.response?.data.message || "Signup failed due to a network error."
            : "An unexpected error occurred during signup.";
        
        throw new Error(errorMessage);
    }
};

/**
 * Calls the /api/auth/login endpoint
 */
export const apiLogin = async (data: SignInFormData): Promise<string> => {
    try {
        const response = await axios.post<{ token: string }>(`${API_URL}/login`, data);
        const token = response.data.token;
        
        // Store the token in the cookie
        setAuthTokenCookie(token);

        return token;
    } catch (error) {
        const errorMessage = axios.isAxiosError(error) 
            ? error.response?.data.message || "Login failed due to a network error."
            : "An unexpected error occurred during login.";
        
        throw new Error(errorMessage);
    }
};

/**
 * Placeholder for the /api/auth/logout endpoint
 */
export const apiLogout = (): void => {
    
    removeAuthTokenCookie();
 
};