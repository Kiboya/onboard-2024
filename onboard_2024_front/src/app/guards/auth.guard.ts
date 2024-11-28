// src/app/guards/auth.guard.ts

// Angular Core
import { Injectable } from '@angular/core';
// Angular Router
import { CanActivate, Router } from '@angular/router';
// Services
import { AuthService } from '../services/auth.service';

/**
 * @fileoverview AuthGuard is responsible for protecting routes that require authentication.
 * The guard checks if the user is authenticated before allowing access to the route.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  /**
   * Constructor for AuthGuard.
   * @param {AuthService} authService - The Auth Service.
   * @param {Router} router - The Router.
   */
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