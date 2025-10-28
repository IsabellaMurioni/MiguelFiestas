import { EventData } from "../utils/types";
import { Category } from "@prisma/client";

export class EventValidation {

  // Obligatory
  static validateRequiredFields(eventData: EventData) {
    if (!eventData.title || !eventData.shortDesc || !eventData.date || !eventData.location) {
      throw new Error("Campos obligatorios faltantes: title, shortDesc, date, location");
    }
  }

  // Date 
  static validateDate(eventDate: Date) {
    if (!(eventDate instanceof Date) || isNaN(eventDate.getTime())) {
      throw new Error("Fecha inválida");
    }
    if (eventDate < new Date()) {
      throw new Error("La fecha del evento no puede ser pasada");
    }
  }

  // Price
  static validatePrice(price?: number) {
    if (price !== undefined && price < 0) {
      throw new Error("El precio no puede ser negativo");
    }
  }

  // Category
  static validateCategory(category: string) {
    if (!Object.values(Category).includes(category as Category)) {
      throw new Error(`Categoría inválida. Debe ser una de: ${Object.values(Category).join(", ")}`);
    }
  }

  // Máx Attendees
  static validateMaxAttendees(maxAttendees?: number) {
    if (maxAttendees !== undefined && (!Number.isInteger(maxAttendees) || maxAttendees <= 0)) {
      throw new Error("maxAttendees debe ser un número entero positivo");
    }
  }

  // Images
  static validateImages(images?: string[]) {
    if (images && !images.every(img => typeof img === "string" && img.length > 0)) {
      throw new Error("Las imágenes deben ser URLs válidas (strings no vacíos)");
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
      throw new Error("Evento completo");
    }
  }
}
