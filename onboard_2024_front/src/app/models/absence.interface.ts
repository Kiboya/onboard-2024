// src/app/models/absence.interface.ts

/**
 * @fileoverview Absence is an interface for the absence data.
 * The interface defines the shape of the absence data that is used in the application.
 */
export interface Absence {
  startDate: string;
  endDate: string;
  reason: string;
  additionalInfo?: string;
  status?: string;
}