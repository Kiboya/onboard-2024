// planning.component.ts

// Angular Core
import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

// Third-Party Libraries
import { TranslocoService } from '@ngneat/transloco';

// RxJS
import { Subscription } from 'rxjs';

// Local Services and Components
import { PlanningService } from '../services/planning.service';

/**
 * Interface for a calendar event.
 */
interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  classType: string;
  room: string;
  instructors: string[];
  learners: string[];
  group: {
    code: string;
    label: string;
  };
  course: {
    code: string;
    label: string;
    moduleName: string;
  };
}

/**
 * Interface for mapping events by day and hour.
 */
interface EventsMapping {
  [day: string]: {
    [hour: number]: CalendarEvent[];
  };
}

/**
 * @fileoverview
 * PlanningComponent is responsible for rendering the planning page of the application.
 * It displays a weekly calendar with scheduled events and handles event interactions.
 */
@Component({
    selector: 'app-planning',
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatTabsModule,
    ],
    templateUrl: './planning.component.html',
    styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit, OnDestroy {
  // ViewChild for the event details modal template.
  @ViewChild('eventDetailsModal') eventDetailsModal!: TemplateRef<any>;

  // Properties
  events: CalendarEvent[] = [];
  weekDays: Date[] = [];
  hours: number[] = [];
  eventsByDayAndHour: EventsMapping = {};
  currentLanguage: string = 'en';

  // Subscriptions
  private subscriptions = new Subscription();

  /**
   * Constructor for PlanningComponent.
   * 
   * @param dialog - Service to open dialogs.
   * @param planningService - Service to manage planning data.
   * @param translocoService - Service for handling translations.
   */
  constructor(
    private dialog: MatDialog,
    private planningService: PlanningService,
    private translocoService: TranslocoService
  ) {}

  /**
   * Initializes the component by subscribing to language changes and setting up the current week.
   */
  ngOnInit(): void {
    // Subscribe to language changes
    const langSub = this.translocoService.langChanges$.subscribe(lang => {
      this.currentLanguage = lang;
    });
    this.subscriptions.add(langSub);

    // Initialize hours
    this.hours = Array.from({ length: 13 }, (_, i) => i + 8);

    // Subscribe to current week changes
    const weekSub = this.planningService.currentWeekStart$.subscribe(date => {
      this.setCurrentWeek(date);
    });
    this.subscriptions.add(weekSub);

    // Initialize events
    this.initializeEvents();

    // Compute events mapping
    this.computeEventsMapping();
  }

  /**
   * Initializes the events array with predefined events.
   */
  private initializeEvents(): void {
    this.events = [
      {
        title: 'AMC',
        start: new Date(2024, 10, 4, 8, 0),
        end: new Date(2024, 10, 4, 12, 15),
        classType: 'Lab',
        room: 'Room A101',
        instructors: ['Dr. Smith', 'Prof. Johnson'],
        learners: ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Helen', 'Ivy', 'Jack', 'Karl', 'Liam', 'Mia', 'Nina', 'Oscar', 'Paul', 'Quinn', 'Rose', 'Sam', 'Tina', 'Uma', 'Vera', 'Will', 'Xena', 'Yann', 'Zoe'],
        group: {
          code: 'G1',
          label: 'Group 1',
        },
        course: {
          code: 'AMC101',
          label: 'Architectures multi-cœur',
          moduleName: 'UV_203',
        },
      },
      {
        title: 'GL',
        start: new Date(2024, 10, 4, 13, 45),
        end: new Date(2024, 10, 4, 15, 45),
        classType: 'Lecture',
        room: 'Room A102',
        instructors: ['Dr. Smith', 'Prof. Johnson'],
        learners: ['Alice', 'Bob', 'Charlie'],
        group: {
          code: 'G1',
          label: 'Group 1',
        },
        course: {
          code: 'GL101',
          label: 'Génie logiciel',
          moduleName: 'UV_203',
        },

      },
      {
        title: 'GPU',
        start: new Date(2024, 10, 4, 16, 0),
        end: new Date(2024, 10, 4, 18, 0),
        classType: 'Tutorial',
        room: 'Room A103',
        instructors: ['Dr. Smith', 'Prof. Johnson'],
        learners: ['Alice', 'Bob', 'Charlie'],
        group: {
          code: 'G1',
          label: 'Group 1',
        },
        course: {
          code: 'GPU101',
          label: 'GPU',
          moduleName: 'UV_203',
        },
      },
      {
        title: 'IA',
        start: new Date(2024, 10, 5, 8, 0),
        end: new Date(2024, 10, 5, 12, 15),
        classType: 'Lab',
        room: 'Room A101',
        instructors: ['Dr. Smith', 'Prof. Johnson'],
        learners: ['Alice', 'Bob', 'Charlie'],
        group: {
          code: 'G1',
          label: 'Group 1',
        },
        course: {
          code: 'IA101',
          label: 'Intelligence artificielle',
          moduleName: 'UV_203',
        },
      },
      {
        title: 'ISC',
        start: new Date(2024, 10, 5, 13, 45),
        end: new Date(2024, 10, 5, 18, 0),
        classType: 'Tutorial',
        room: 'Room A103',
        instructors: ['Dr. Smith', 'Prof. Johnson'],
        learners: ['Alice', 'Bob', 'Charlie'],
        group: {
          code: 'G1',
          label: 'Group 1',
        },
        course: {
          code: 'ISC101',
          label: 'Ingénierie de systèmes complexes',
          moduleName: 'UV_203',
        },
      },
      {
        title: 'PW',
        start: new Date(2024, 10, 6, 8, 0),
        end: new Date(2024, 10, 6, 12, 15),
        classType: 'Lab',
        room: 'Room A101',
        instructors: ['Dr. Smith', 'Prof. Johnson'],
        learners: ['Alice', 'Bob', 'Charlie'],
        group: {
          code: 'G1',
          label: 'Group 1',
        },
        course: {
          code: 'PW101',
          label: 'Programmation web',
          moduleName: 'UV_203',
        },

      },
      {
        title: 'RLP',
        start: new Date(2024, 10, 6, 13, 45),
        end: new Date(2024, 10, 6, 15, 45),
        classType: 'Lecture',
        room: 'Room A102',
        instructors: ['Dr. Smith', 'Prof. Johnson'],
        learners: ['Alice', 'Bob', 'Charlie'],
        group: {
          code: 'G1',
          label: 'Group 1',
        },
        course: {
          code: 'RLP101',
          label: 'Robotique et langage Python',
          moduleName: 'UV_203',
        },
      },
      {
        title: 'ROS',
        start: new Date(2024, 10, 6, 16, 0),
        end: new Date(2024, 10, 6, 18, 0),
        classType: 'Tutorial',
        room: 'Room A103',
        instructors: ['Dr. Smith', 'Prof. Johnson'],
        learners: ['Alice', 'Bob', 'Charlie'],
        group: {
          code: 'G1',
          label: 'Group 1',
        },
        course: {
          code: 'ROS101',
          label: 'Robot Operating System',
          moduleName: 'UV_203',
        },
      },
      {
        title: 'SIE',
        start: new Date(2024, 10, 7, 8, 0),
        end: new Date(2024, 10, 7, 10, 0),
        classType: 'Lab',
        room: 'Room A101',
        instructors: ['Dr. Smith', 'Prof. Johnson'],
        learners: ['Alice', 'Bob', 'Charlie'],
        group: {
          code: 'G1',
          label: 'Group 1',
        },
        course: {
          code: 'SIE101',
          label: 'Systèmes informatiques embarqués',
          moduleName: 'UV_203',
        },
      },
      {
        title: 'VPO',
        start: new Date(2024, 10, 7, 10, 15),
        end: new Date(2024, 10, 7, 12, 15),
        classType: 'Lecture',
        room: 'Room A102',
        instructors: ['Dr. Smith', 'Prof. Johnson'],
        learners: ['Alice', 'Bob', 'Charlie'],
        group: {
          code: 'G1',
          label: 'Group 1',
        },
        course: {
          code: 'VPO101',
          label: 'Vision par ordinateur',
          moduleName: 'UV_203',
        },
      },
      {
        title: 'AMC',
        start: new Date(2024, 10, 7, 13, 45),
        end: new Date(2024, 10, 7, 15, 45),
        classType: 'Tutorial',
        room: 'Room A103',
        instructors: ['Dr. Smith', 'Prof. Johnson'],
        learners: ['Alice', 'Bob', 'Charlie'],
        group: {
          code: 'G1',
          label: 'Group 1',
        },
        course: {
          code: 'AMC101',
          label: 'Architectures multi-cœur',
          moduleName: 'UV_203',
        },
      },
      {
        title: 'GL',
        start: new Date(2024, 10, 7, 16, 0),
        end: new Date(2024, 10, 7, 18, 0),
        classType: 'Lab',
        room: 'Room A101',
        instructors: ['Dr. Smith', 'Prof. Johnson'],
        learners: ['Alice', 'Bob', 'Charlie'],
        group: {
          code: 'G1',
          label: 'Group 1',
        },
        course: {
          code: 'GL101',
          label: 'Génie logiciel',
          moduleName: 'UV_203',
        }
      },
      {
        title: 'GPU',
        start: new Date(2024, 10, 8, 8, 0),
        end: new Date(2024, 10, 8, 12, 15),
        classType: 'Lecture',
        room: 'Room A102',
        instructors: ['Dr. Smith', 'Prof. Johnson'],
        learners: ['Alice', 'Bob', 'Charlie'],
        group: {
          code: 'G1',
          label: 'Group 1',
        },
        course: {
          code: 'GPU101',
          label: 'GPU',
          moduleName: 'UV_203',
        },
      },
      {
        title: 'IA',
        start: new Date(2024, 10, 8, 13, 45),
        end: new Date(2024, 10, 8, 15, 45),
        classType: 'Tutorial',
        room: 'Room A103',
        instructors: ['Dr. Smith', 'Prof. Johnson'],
        learners: ['Alice', 'Bob', 'Charlie'],
        group: {
          code: 'G1',
          label: 'Group 1',
        },
        course: {
          code: 'IA101',
          label: 'Intelligence artificielle',
          moduleName: 'UV_203',
        },
      },
      {
        title: 'ISC',
        start: new Date(2024, 10, 8, 16, 0),
        end: new Date(2024, 10, 8, 18, 0),
        classType: 'Lab',
        room: 'Room A101',
        instructors: ['Dr. Smith', 'Prof. Johnson'],
        learners: ['Alice', 'Bob', 'Charlie'],
        group: {
          code: 'G1',
          label: 'Group 1',
        },
        course: {
          code: 'ISC101',
          label: 'Ingénierie de systèmes complexes',
          moduleName: 'UV_203',
        },
      }
    ];
  }

  /**
   * Sets the current week based on the provided date.
   * 
   * @param date - The start date of the current week.
   */
  setCurrentWeek(date: Date): void {
    this.weekDays = Array.from({ length: 6 }, (_, i) => {
      const day = new Date(date);
      day.setDate(date.getDate() + i);
      return day;
    });
    this.computeEventsMapping();
  }

  /**
   * Computes the mapping of events by day and hour.
   */
  private computeEventsMapping(): void {
    this.eventsByDayAndHour = {};

    for (const event of this.events) {
      const dayKey = event.start.toDateString();

      if (!this.eventsByDayAndHour[dayKey]) {
        this.eventsByDayAndHour[dayKey] = {};
      }

      const hour = event.start.getHours();

      if (!this.eventsByDayAndHour[dayKey][hour]) {
        this.eventsByDayAndHour[dayKey][hour] = [];
      }

      this.eventsByDayAndHour[dayKey][hour].push(event);
    }
  }

  /**
   * Calculates the position of an event for rendering.
   * 
   * @param event - The calendar event.
   * @returns An object containing the top position and height for the event.
   */
  getEventPosition(event: CalendarEvent): { top: number; height: number } {
    const startMinutes = event.start.getMinutes();
    const duration = (event.end.getTime() - event.start.getTime()) / (60 * 1000);
    return {
      top: (startMinutes / 60) * 100,
      height: (duration / 60) * 100,
    };
  }

  /**
   * Opens the event details modal when an event is clicked.
   * 
   * @param event - The calendar event to display details for.
   */
  onEventClick(event: CalendarEvent): void {
    this.dialog.open(this.eventDetailsModal, {
      data: event,
      disableClose: false, // Allows closing by clicking outside
      autoFocus: false,    // Prevents automatic focus on the first input
      width: '450px',
      maxWidth: '75vw',
    });
  }

  /**
   * Unsubscribes from all subscriptions when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}