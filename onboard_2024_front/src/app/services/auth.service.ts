import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../type/loginResponse.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environements/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  public login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      username,
      password,
    });
  }
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }
}

