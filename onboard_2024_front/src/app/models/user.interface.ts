// src/app/models/user.interface.ts

/**
 * @fileoverview This file contains interfaces for the user model.
 */

/**
 * User interface.
 */
export interface User {
  username: string;
  firstName: string;
  lastName: string;
  password?: string;
}

/**
 * User profile information interface.
 */
export interface UserInfo {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  mobilePhone: string;
  email: string;
  groups: {
    name: string;
  }[];
  courses: {
    id: number;
    name: string;
  }[];
}
