// src/app/services/class.service.ts

// Angular Core
import { Injectable } from '@angular/core';
// Angular HTTP Client
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// Models
import { ClassResponseDto } from '../models/class-response-dto.interface';
// Services
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

/**
 * @fileoverview
 * ClassService is responsible for managing class data.
 */
@Injectable({
  providedIn: 'root',
})
export class ClassService {
  // API URL
  private classApiUrl = `${environment.apiUrl}/classes`;
  private groupApiUrl = `${environment.apiUrl}/groups`;
  private roomApiUrl = `${environment.apiUrl}/rooms`;

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
    return this.http.get<ClassResponseDto[]>(`${this.classApiUrl}/user`);
  }

  /**
   * Retrieves all classes for given groups.
   * @param {number} groupIds The IDs of the groups.
   * @returns {Observable<ClassResponseDto[]>} The classes for the groups.
   */
  getClassesByGroups(groupIds: number[]): Observable<ClassResponseDto[]> {
    let params = new HttpParams().set('groupIds', groupIds.join(','));
    return this.http.get<ClassResponseDto[]>(`${this.classApiUrl}/group`, { params });
  }

  /**
   * Retrieves all classes for given rooms.
   * @param {number} roomIds The IDs of the rooms.
   * @returns {Observable<ClassResponseDto[]>} The classes for the rooms.
   */
  getClassesByRooms(roomIds: number[]): Observable<ClassResponseDto[]> {
    let params = new HttpParams().set('roomIds', roomIds.join(','));
    return this.http.get<ClassResponseDto[]>(`${this.classApiUrl}/rooms`, { params });
  }

  /**
   * Retrieves all groups.
   * @returns {Observable<{ id: number; name: string }[]>} The groups.
   */
  getAllGroups(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(`${this.groupApiUrl}`);
  }

  /**
   * Retrieves all rooms.
   * @returns {Observable<{ id: number; name: string }[]>} The rooms.
   */
  getAllRooms(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(`${this.roomApiUrl}`);
  }
}