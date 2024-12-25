// src/app/services/language.service.ts

// Angular Core
import { Injectable } from '@angular/core';

// Third Party Libraries
import { TranslocoService, } from '@ngneat/transloco';

/**
 * @fileoverview LanguageService is responsible for handling language switching in the application.
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  /**
   * Constructor for LanguageService.
   * @param {TranslocoService} translocoService - The Transloco Service
   */
  constructor(private translocoService: TranslocoService) { }

  /**
   * Switches the active language in the application.
   * 
   * @param language - The language to switch to.
   */
  switchLanguage(language: string) {
    this.translocoService.setActiveLang(language);
    localStorage.setItem('language', language);
  }

  /**
   * Gets the active language in the application.
   * 
   * @returns The active language.
   */
  getActiveLanguage() {
    return this.translocoService.getActiveLang();
  }
}