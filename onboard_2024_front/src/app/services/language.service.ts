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
}