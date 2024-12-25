// src/app/planning/room-planning/room-planning.component.ts

// Angular Core
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Local Services and Components
import { ClassService } from '../../services/class.service';
import { FilterSelectionComponent } from '../filter-selection/filter-selection.component';

// Transloco
import { TranslocoModule } from '@ngneat/transloco';

/**
 * @fileoverview RoomPlanningComponent is responsible for rendering the room planning component.
 * The component allows users to select rooms and navigate to the planning page.
 */
@Component({
  selector: 'app-room-planning',
  imports: [
    FilterSelectionComponent,
    TranslocoModule
  ],
  templateUrl: './room-planning.component.html',
  styleUrls: ['./room-planning.component.scss']
})
export class RoomPlanningComponent implements OnInit {
  availableRooms: { id: number; name: string }[] = [];

  constructor(
    private classService: ClassService,
    private router: Router
  ) { }

  /**
   * Fetches all available rooms.
   */
  ngOnInit(): void {
    this.classService.getAllRooms().subscribe({
      next: (rooms) => this.availableRooms = rooms,
      error: (error) => console.error('Error fetching rooms:', error)
    });
  }

  /**
   * Navigates to the planning page with the selected rooms.
   * @param selectedRooms - The selected room IDs.
   */
  onRoomsSelected(selectedRooms: number[]): void {
    this.router.navigate(['/planning'], { queryParams: { roomIds: selectedRooms.join(',') } });
  }
}