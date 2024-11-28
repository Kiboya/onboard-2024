// src/app/services/planning.service.ts

// Angular Core
import { Injectable } from '@angular/core';
// RxJS
import { BehaviorSubject } from 'rxjs';

/**
 * @fileoverview PlanningService is responsible for managing the current week in the planning view.
 * It provides methods to navigate between weeks and get the start date of the current week.
 */
@Injectable({
  providedIn: 'root',
})
export class PlanningService {
  // BehaviorSubject to store the start date of the current week
  private _currentWeekStart = new BehaviorSubject<Date>(this.getStartOfWeek(new Date()));
  // Observable for the current week start date
  currentWeekStart$ = this._currentWeekStart.asObservable();

  /**
   * Constructor for PlanningService.
   */
  constructor() { }

  /**
   * Gets the start date of the current week.
   * @returns {Date} The start date of the current week.
   */
  get currentWeekStart(): Date {
    return this._currentWeekStart.value;
  }

  /**
   * Sets the start date of the current week.
   * @param {Date} date - The date to set as the start of the current week.
   */
  setCurrentWeek(date: Date): void {
    this._currentWeekStart.next(this.getStartOfWeek(date));
  }

  /**
   * Gets the start date of the week for a given date.
   * @param {Date} date - The date to get the start of the week for.
   * @returns {Date} The start date of the week.
   */
  getStartOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  /**
   * Navigates to the previous week.
   */
  previousWeek(): void {
    const previousWeek = new Date(this.currentWeekStart);
    previousWeek.setDate(previousWeek.getDate() - 7);
    this.setCurrentWeek(previousWeek);
  }

  /**
   * Navigates to the next week.
   */
  nextWeek(): void {
    const nextWeek = new Date(this.currentWeekStart);
    nextWeek.setDate(nextWeek.getDate() + 7);
    this.setCurrentWeek(nextWeek);
  }

  /**
   * Navigates to the current week.
   */
  goToToday(): void {
    this.setCurrentWeek(new Date());
  }
}