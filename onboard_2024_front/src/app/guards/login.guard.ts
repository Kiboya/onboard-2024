// src/app/guards/login.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * @fileoverview LoginGuard is responsible for protecting the login route.
 * The guard checks if the user is already authenticated before allowing access to the route.
 */
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Checks if the user is authenticated before allowing access to the login route.
   * @returns {boolean} True if the user is not authenticated, false otherwise.
   */
  canActivate(): boolean {
    const isLoggedIn = !!localStorage.getItem('token');
    if (isLoggedIn) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}