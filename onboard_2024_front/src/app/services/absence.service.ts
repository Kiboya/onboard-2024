// src/app/services/absence.service.ts
// Angular Core
import { Injectable } from '@angular/core';
// Angular HTTP Client
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// Models
import { Absence } from '../interfaces/absence.interface';
// Environment
import { environment } from '../../environments/environment';

/**
 * @fileoverview AbsenceService is responsible for handling absence data.
 * The service allows for getting all absences and submitting an absence.
 */
@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  /**
   * API URL for absences.
   */
  private apiUrl = `${environment.apiUrl}/absences`;

  /**
   * Constructor for AbsenceService.
   * @param {HttpClient} http The Angular HTTP client.
   */
  constructor(private http: HttpClient) { }

  /**
   * Gets all absences for the user.
   * @returns {Observable<Absence[]>} The response from the get request.
   */
  getUserAbsences(): Observable<Absence[]> {
    return this.http.get<Absence[]>(`${this.apiUrl}/user`);
  }

  /**
   * Submits an absence.
   * @param {Absence} absence The absence to submit.
   * @returns {Observable<Absence>} The response from the post request.
   */
  submitAbsence(absence: Absence): Observable<Absence> {
    return this.http.post<Absence>(this.apiUrl, absence);
  }
}