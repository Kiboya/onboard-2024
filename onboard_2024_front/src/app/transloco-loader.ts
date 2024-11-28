// src/app/transloco-loader.ts

// Angular Core
import { inject, Injectable } from "@angular/core";
// Transloco
import { Translation, TranslocoLoader } from "@ngneat/transloco";
// Angular HttpClient
import { HttpClient } from "@angular/common/http";

/**
 * TranslocoHttpLoader is responsible for loading translations from the server.
 */
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
    // Angular HttpClient
    private http = inject(HttpClient);

    /**
     * Loads the translations from the server.
     * @param lang - The language to load.
     * @returns The translations for the specified language.
     */
    getTranslation(lang: string) {
        return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
    }
}
