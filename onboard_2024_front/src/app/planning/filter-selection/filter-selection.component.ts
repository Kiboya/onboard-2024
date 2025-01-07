// src/app/planning/filter-selection/filter-selection.component.ts

// Angular Core
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

// Transloco
import { TranslocoModule } from '@ngneat/transloco';

/**
 * Interface for a select item.
 */
interface SelectItem {
  id: number;
  name: string;
}

/**
 * @fileoverview FilterSelectionComponent is responsible for rendering a filter selection component.
 * The component allows users to select items from a list and apply the selection.
 */
@Component({
  selector: 'app-filter-selection',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    TranslocoModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './filter-selection.component.html',
  styleUrls: ['./filter-selection.component.scss']
})
export class FilterSelectionComponent implements OnInit {

  @Input() title: string = 'Select Items';
  @Input() availableItems: SelectItem[] = [];
  @Output() itemsSelected = new EventEmitter<number[]>();
  @Input() article: string = 'un';

  selectedItems: number[] = [];
  filterForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      selectedItems: [[], [Validators.required, this.minSelectedValidator(1)]]
    });
  }

  minSelectedValidator(min: number) {
    return (control: any) => {
      const value = control.value;
      return value && value.length >= min ? null : { minSelected: true };
    };
  }

  applySelection(): void {
    if (this.filterForm.valid) {
      this.itemsSelected.emit(this.filterForm.value.selectedItems);
    }
  }

}
