// src/app/services/home.service.ts

// Angular Core
import { Injectable } from '@angular/core';
// Angular HTTP Client
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// Models
import { Card } from '../interfaces/home-card.interface';
// Environment
import { environment } from '../../environments/environment';

/**
 * @fileoverview HomeService is responsible for handling home card data.
 * The service allows for retrieving home cards.
 */
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  /**
   * API URL for home cards.
   */
  private apiUrl = `${environment.apiUrl}/home/cards`;

  /**
   * Constructor for HomeService.
   * @param {HttpClient} http The Angular HTTP client.
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieves all home cards.
   * @returns {Observable<Card[]>} The response from the get request.
   */
  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(this.apiUrl);
  }
}