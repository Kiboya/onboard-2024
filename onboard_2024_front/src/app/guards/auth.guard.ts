// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * @fileoverview AuthGuard is responsible for protecting routes that require authentication.
 * The guard checks if the user is authenticated before allowing access to the route.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  /**
   * Checks if the user is authenticated before allowing access to the route.
   * @returns {boolean} True if the user is authenticated, false otherwise.
   */
  canActivate(): boolean {
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}