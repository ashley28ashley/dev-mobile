// src/services/validation.ts
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isValidEmail = (email: string): boolean => emailRegex.test(email);

// Password must be at least 8 characters (no other constraints)
export const isStrongPassword = (pwd: string): boolean => pwd.length >= 8;
