// src/app/planning/group-planning/group-planning.component.ts

// Angular Core
import { Component, OnInit } from '@angular/core';

// Angular Router
import { Router } from '@angular/router';

// Local Services and Components
import { ClassService } from '../../services/class.service';
import { FilterSelectionComponent } from '../filter-selection/filter-selection.component';

// Transloco
import { TranslocoModule } from '@ngneat/transloco';

/**
 * @fileoverview GroupPlanningComponent is responsible for rendering the group planning component.
 * The component allows users to select groups and navigate to the planning page.
 */
@Component({
  selector: 'app-group-planning',
  imports: [
    FilterSelectionComponent,
    TranslocoModule
  ],
  templateUrl: './group-planning.component.html',
  styleUrls: ['./group-planning.component.scss']
})
export class GroupPlanningComponent implements OnInit {
  availableGroups: { id: number; name: string }[] = [];

  constructor(
    private classService: ClassService,
    private router: Router
  ) { }

  /**
   * Fetches all available groups.
   */
  ngOnInit(): void {
    this.classService.getAllGroups().subscribe({
      next: (groups) => this.availableGroups = groups,
      error: (error) => console.error('Error fetching groups:', error)
    });
  }

  /**
   * Navigates to the planning page with the selected groups.
   * @param selectedGroups - The selected group IDs.
   */
  onGroupsSelected(selectedGroups: number[]): void {
    this.router.navigate(['/planning'], { queryParams: { groupIds: selectedGroups.join(',') } });
  }
}