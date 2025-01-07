// Angular Core
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// Third-Party Libraries
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

// Services
import { AbsenceService } from '../../services/absence.service';

// Models
import { Absence } from '../../models/absence.interface';

/**
 * @fileoverview
 * AbsenceListComponent is responsible for displaying a list of user absences.
 * It fetches the absences from the AbsenceService and displays them in a card format.
 */
@Component({
  selector: 'app-absence-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    TranslocoModule,
  ],
  templateUrl: './absence-list.component.html',
  styleUrls: ['./absence-list.component.scss']
})
export class AbsenceListComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  absences: Absence[] = [];
  currentLanguage: string = 'fr';

  /**
   * Constructor for AbsenceListComponent.
   * 
   * @param absenceService - Service for handling absences.
   * @param translocoService - Service for handling translations.
   */
  constructor(
    private absenceService: AbsenceService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    const absSub = this.absenceService.getUserAbsences().subscribe({
      next: (data) => this.absences = data,
      error: () => console.error('Error fetching absences')
    });
    this.subscriptions.add(absSub);

    const langSub = this.translocoService.langChanges$.subscribe(lang => {
      this.currentLanguage = lang;
    });
    this.subscriptions.add(langSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}