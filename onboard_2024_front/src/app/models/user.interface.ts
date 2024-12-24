// src/app/models/user.interface.ts

/**
 * @fileoverview This file contains interfaces for the user model.
 */

/**
 * User interface.
 */
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

/**
 * User request interface.
 */
export interface userRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}
