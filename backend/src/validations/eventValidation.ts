import { EventData } from "../utils/types";
import { Category } from "@prisma/client";

export class EventValidation {

  // Obligatory
  static validateRequiredFields(eventData: EventData) {
    if (!eventData.title || !eventData.shortDesc || !eventData.date || !eventData.location) {
      throw new Error("Missing required fields: title, shortDesc, date, location");
    }
  }

  // Date 
  static validateDate(eventDate: Date) {
    if (!(eventDate instanceof Date) || isNaN(eventDate.getTime())) {
      throw new Error("Invalid date");
    }
    if (eventDate < new Date()) {
      throw new Error("Event date cannot be in the past");
    }
  }

  // Price
  static validatePrice(price?: number) {
    if (price !== undefined && price < 0) {
      throw new Error("Price cannot be negative");
    }
  }

  // Category
  static validateCategory(category: string) {
    if (!Object.values(Category).includes(category as Category)) {
      throw new Error(`Invalid category. Must be one of: ${Object.values(Category).join(", ")}`);
    }
  }

  // Max Attendees
  static validateMaxAttendees(maxAttendees?: number) {
    if (maxAttendees !== undefined && (!Number.isInteger(maxAttendees) || maxAttendees <= 0)) {
      throw new Error("maxAttendees must be a positive integer");
    }
  }

  // Images
  static validateImages(images?: string[]) {
    if (images && !images.every(img => typeof img === "string" && img.length > 0)) {
      throw new Error("Images must be valid URLs (non-empty strings)");
    }
  }

  // Whole Event
  static validateEventData(eventData: EventData) {
    this.validateRequiredFields(eventData);
    this.validateDate(eventData.date);
    this.validatePrice(eventData.price);
    this.validateCategory(eventData.category);
    this.validateMaxAttendees(eventData.maxAttendees);
    this.validateImages(eventData.images);
  }

  // Attendance
  static validateAttendance(event: any) {
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      throw new Error("Event is full");
    }
  }
}
