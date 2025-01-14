// src/app/interfaces/class-response-dto.interface.ts

/**
 * @fileoverview ClassResponseDto is an interface for the class response data transfer object.
 * The interface defines the shape of the class response data that is returned from the API.
 */
export interface ClassResponseDto {
    id: number;
    date: string;
    startingTime: string;
    endingTime: string;
    classType: string;  
    course: {
        id: number;
        name: string;
    };
    room: {
        id: number;
        name: string;
    };
    groups: {
        name: string;
    }[];
    professors: {
        id: number;
        name: string;
    }[];
    attendees: {
        username: string;
        firstName: string;
        lastName: string;
    }[];
}