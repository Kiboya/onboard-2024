// src/app/planning/filter-selection/filter-selection.component.ts

// Angular Core
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

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
    TranslocoModule
  ],
  templateUrl: './filter-selection.component.html',
  styleUrls: ['./filter-selection.component.scss']
})
export class FilterSelectionComponent implements OnInit {

  // Input and Output properties 
  @Input() title: string = 'Select Items';
  @Input() availableItems: SelectItem[] = [];
  @Output() itemsSelected = new EventEmitter<number[]>();

  // This property is used for adapting the french article based on the gender of the item
  @Input() article: string = 'un'; 


  selectedItems: number[] = [];

  // Add a property for validation message visibility
  showValidationMessage: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  /**
   * Toggles the selection of an item.
   */
  applySelection(): void {
    if (this.selectedItems.length > 0) {
      this.itemsSelected.emit(this.selectedItems);
      this.showValidationMessage = false;
    } else {
      this.showValidationMessage = true;
    }
  }

}
