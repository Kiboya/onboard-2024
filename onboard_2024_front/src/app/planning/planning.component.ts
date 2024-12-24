// src/app/planning/planning.component.ts

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
import { ClassService } from '../services/class.service';

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
  groups: {
    name: string;
  }[];
  course: {
    name: string;
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
    private classService: ClassService,
    private translocoService: TranslocoService
  ) { }

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

    // Fetch classes from backend
    const classSub = this.classService.getUserClasses().subscribe({
      next: (classes) => {
        this.events = classes.map(cls => ({
          title: cls.course.name,
          start: new Date(`${cls.date}T${cls.startingTime}`),
          end: new Date(`${cls.date}T${cls.endingTime}`),
          classType: cls.classType,
          room: cls.room.name,
          instructors: cls.professors.map(prof => prof.name),
          learners: cls.attendees.map(user => `${user.firstName} ${user.lastName}`),
          groups: cls.groups.map(group => ({ name: group.name })), 
          course: {
            name: cls.course.name,
          },
        }));
        this.computeEventsMapping();
      },
      error: (error) => {
        console.error('Error fetching classes:', error);
      }
    });
    this.subscriptions.add(classSub);
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