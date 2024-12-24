// src/app/models/login-response.interface.ts

// User interface
import { User } from "./user.interface";

/**
 * @fileoverview LoginResponse is an interface for the login response.
 * The interface defines the shape of the login response data that is returned from the API.
 */
export interface LoginResponse {
  message: string;
  user: Omit<User, 'password'>;
  token: {
    access_token: string;
  };
}
