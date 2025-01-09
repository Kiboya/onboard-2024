// src/app/models/login-response.interface.ts

/**
 * @fileoverview LoginResponse is an interface for the login response.
 * The interface defines the shape of the login response data that is returned from the API.
 */
export interface LoginResponse {
  message: string;
  user: { username: string };
  token: {
    access_token: string;
  };
}
