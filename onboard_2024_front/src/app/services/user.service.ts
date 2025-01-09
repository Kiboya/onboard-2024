// Angular Core
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RxJS
import { Observable } from 'rxjs';

// Models and Environment
import { UserInfo } from '../models/user.interface';
import { environment } from '../../environments/environment';

/**
 * @fileoverview
 * UserService is responsible for handling all user-related HTTP requests.
 * It provides methods to fetch user profile information from the backend API.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  /**
   * Constructor for UserService.
   * 
   * @param http - Angular's HttpClient for making HTTP requests
   */
  constructor(private http: HttpClient) { }

  /**
   * Gets the current user's profile information from the backend API.
   * 
   * @returns Observable<UserInfo> containing user profile data
   */
  getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${environment.apiUrl}/user/profile`);
  }
}
