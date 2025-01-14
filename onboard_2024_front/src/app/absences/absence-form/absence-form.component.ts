// Angular Core
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

// Third-Party Libraries
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

// Services
import { AbsenceService } from '../../services/absence.service';

// Models
import { Absence } from '../../interfaces/absence.interface';

/**
 * @fileoverview
 * AbsenceFormComponent is responsible for rendering the form to submit a new absence.
 * It handles form validation and submission.
 */
@Component({
  selector: 'app-absence-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    TranslocoModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './absence-form.component.html',
  styleUrls: ['./absence-form.component.scss'],
  providers: [DatePipe]
})
export class AbsenceFormComponent implements OnInit {
  absenceForm!: FormGroup;

  /**
   * Constructor for AbsenceFormComponent.
   * 
   * @param fb - FormBuilder for creating the form.
   * @param absenceService - Service for handling absences.
   * @param router - Router for navigation.
   * @param dateAdapter - Adapter for handling date localization.
   * @param translocoService - Service for handling translations.
   * @param datePipe - Pipe for formatting dates.
   */
  constructor(
    private fb: FormBuilder,
    private absenceService: AbsenceService,
    private router: Router,
    private dateAdapter: DateAdapter<Date>,
    private translocoService: TranslocoService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.absenceForm = this.fb.group({
      reason: ['', Validators.required],
      dateRange: this.fb.group({
        start: ['', Validators.required],
        end: ['', Validators.required],
      }),
      additionalInfo: ['']
    });

    // Set initial locale
    const currentLang = this.translocoService.getActiveLang();
    this.dateAdapter.setLocale(currentLang);

    // Update locale on language change. This allows the date picker to display the date in the correct locale.
    this.translocoService.langChanges$.subscribe((lang) => {
      this.dateAdapter.setLocale(lang);
    });
  }

  /**
   * Getter for the dateRange form group.
   * @returns The dateRange form group.
   */
  get dateRange(): FormGroup {
    return this.absenceForm.get('dateRange') as FormGroup;
  }

  /**
   * Submit the form data.
   * If the form is valid, it creates an absence object and submits it via the AbsenceService.
   */
  onSubmit(): void {
    if (this.absenceForm.valid) {
      const { reason, dateRange, additionalInfo } = this.absenceForm.value;
      const absence: Absence = {
        reason,
        startDate: this.datePipe.transform(dateRange.start, 'yyyy-MM-dd')!,
        endDate: this.datePipe.transform(dateRange.end, 'yyyy-MM-dd')!,
        additionalInfo
      };
      this.absenceService.submitAbsence(absence).subscribe({
        next: () => this.router.navigate(['/absences/list']),
        error: () => console.error('Error submitting absence')
      });
    }
  }
}