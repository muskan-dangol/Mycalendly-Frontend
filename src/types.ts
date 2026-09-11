export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
}