// src/app/services/auth.service.ts

// Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// RxJS
import { catchError, Observable, tap, throwError } from 'rxjs';
// Interfaces
import { LoginResponse } from '../models/login-response.interface';
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
  // Token key for local storage
  private readonly TOKEN_KEY = 'access_token';

  /**
   * Constructor for AuthService.
   * @param {HttpClient} http The Angular HTTP client.
   * @param {Router} router The Angular router.
   */
  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Logs the user in and handles the response.
   * @param {string} username The user's username.
   * @param {string} password The user's password.
   * @returns {Observable<LoginResponse>} The response from the login request.
   */
  public login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      username,
      password,
    }).pipe(
      tap((response: LoginResponse) => {
        this.saveToken(response.token.access_token);
        this.router.navigate(['/home']);
      }),
      catchError((error) => {
        console.error('Error logging in:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Saves the user's token to local storage.
   * @param {string} token The user's token.
   */
  saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Retrieves the user's token from local storage.
   * @returns {string | null} The user's token or null if the token is not found.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Logs the user out.
   * Removes the user's token from local storage.
   * @returns {void}
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}

