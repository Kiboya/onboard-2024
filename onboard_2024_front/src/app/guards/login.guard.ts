// src/app/guards/login.guard.ts

// Angular Core
import { Injectable } from '@angular/core';
// Angular Router
import { CanActivate, Router } from '@angular/router';
// Services
import { AuthService } from '../services/auth.service';

/**
 * @fileoverview
 * LoginGuard is responsible for protecting the login route.
 * The guard checks if the user is already authenticated before allowing access to the route.
 */
@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  /**
   * Constructor for LoginGuard.
   * @param {AuthService} authService - The Auth Service to manage authentication state.
   * @param {Router} router - The Router to navigate between routes.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Determines whether the login route can be activated.
   * If the user is already authenticated, redirects to the home page.
   * @returns {boolean} True if the user is not authenticated, allowing access to the login route; otherwise, false.
   */
  canActivate(): boolean {
    const token = this.authService.getToken();
    const isLoggedIn = !!token;

    if (isLoggedIn) {
      this.router.navigate(['/home']); 
      return false;
    }

    return true;
  }
}