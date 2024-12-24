// src/app/services/class.service.ts

// Angular Core
import { Injectable } from '@angular/core';
// Angular HTTP Client
import { HttpClient, HttpHeaders } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// Models
import { ClassResponseDto } from '../models/class-response-dto.interface';
// Services
import { AuthService } from './auth.service';

/**
 * @fileoverview
 * ClassService is responsible for managing class data.
 */
@Injectable({
  providedIn: 'root',
})
export class ClassService {
  // API URL
  private apiUrl = 'http://localhost:3000/classes';

  /**
   * Constructor for ClassService.
   * @param {HttpClient} http The Angular HTTP client.
   * @param {AuthService} authService The Auth Service.
   */
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}
  
  /**
   * Retrieves all classes where the user is an attendee.
   * @returns {Observable<ClassResponseDto[]>} The classes where the user is an attendee.
   */
  getUserClasses(): Observable<ClassResponseDto[]> {
    return this.http.get<ClassResponseDto[]>(`${this.apiUrl}/user`);
  }
}