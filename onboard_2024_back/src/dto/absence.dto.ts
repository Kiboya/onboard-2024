// src/dto/absence.dto.ts

/**
 * @fileoverview Defines the AbsenceDto class to represent the data transfer object for absences.
 */
export class AbsenceDto {
  startDate: string;
  endDate: string;
  reason: string;
  additionalInfo?: string;
}
