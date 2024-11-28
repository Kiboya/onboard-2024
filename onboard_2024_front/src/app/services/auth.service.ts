// src/app/services/auth.service.ts

// Angular Core
import { Injectable } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// Interfaces
import { LoginResponse } from '../type/loginResponse.interface';
// Angular HTTP
import { HttpClient } from '@angular/common/http';
// Environments
import { environment } from '../../environements/environment';

/**
 * @fileoverview AuthService is responsible for handling user authentication.
 * The service allows for user login and logout.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // API URL
  private apiUrl = `${environment.apiUrl}/auth`;

  /**
   * Constructor for AuthService.
   * @param {HttpClient} http The Angular HTTP client.
   */
  constructor(private http: HttpClient) { }

  /**
   * Logs the user in.
   * @param {string} username The user's username.
   * @param {string} password The user's password.
   * @returns {Observable<LoginResponse>} The response from the login request.
   */
  public login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      username,
      password,
    });
  }

  /**
   * Saves the user's token to local storage.
   * @param {string} token The user's token.
   */
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  /**
   * Logs the user out.
   * Removes the user's token from local storage.
   * @returns {void}
   */
  logout(): void {
    localStorage.removeItem('token');
  }
}

