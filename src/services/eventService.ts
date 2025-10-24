import { Category, EventStatus } from "@prisma/client";
import { db } from "../db/db";
import { UserService } from "./userService";
const userService = new UserService();

interface EventData {
  title: string;
  shortDesc: string;
  longDesc?: string;
  location: string;
  date: Date;
  price?: number; 
  category: string;
  maxAttendees?: number;
  images?: string[];
}

export class EventService {

  // Create New Event
  async createEvent(userId: number, eventData: EventData) {
    try {
      if (!eventData.title || !eventData.shortDesc || !eventData.date || !eventData.location) {
        throw new Error("Campos obligatorios faltantes");
      }

      const isFree = !eventData.price || eventData.price <= 0;

      const event = await db.event.create({
        data: {
          title: eventData.title,
          shortDesc: eventData.shortDesc,
          longDesc: eventData.longDesc || "",
          location: eventData.location,
          date: eventData.date,
          price: eventData.price || 0,
          isFree: !eventData.price || eventData.price <= 0,
          status: EventStatus.SCHEDULED,
          category: Category.CONCERTS,
          maxAttendees: eventData.maxAttendees ?? null,
          images: eventData.images ? eventData.images.join(",") : null,
          creatorId: userId,
          attendees: { create: { userId } }
        },
        include: { attendees: true }
      });

      return event;
    } catch (error: any) {
      console.error("Error creando evento:", error);
      throw new Error("No se pudo crear el evento");
    }
  }

  // Get Event By Id
  async getEventById(eventId: number) {
    try {
      const event = await db.event.findUnique({
        where: { id: eventId },
        include: { attendees: true, creator: true }
      });
      if (!event || event.status === "CANCELLED") throw new Error("Evento no encontrado");
      return event;
    } catch (error: any) {
      console.error("Error obteniendo evento:", error);
      throw new Error("No se pudo obtener el evento");
    }
  }

  // List Events
  async listEvents(filters?: {
    free?: boolean;
    priceMin?: number;
    priceMax?: number;
    startDate?: Date;
    endDate?: Date;
    category?: string;
    status?: string;
  }) {
    try {
      const where: any = { status: { not: "DELETED" } };

      if (filters) {
        if (filters.free !== undefined) where.isFree = filters.free;
        if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
          where.price = {};
          if (filters.priceMin !== undefined) where.price.gte = filters.priceMin;
          if (filters.priceMax !== undefined) where.price.lte = filters.priceMax;
        }
        if (filters.startDate || filters.endDate) {
          where.date = {};
          if (filters.startDate) where.date.gte = filters.startDate;
          if (filters.endDate) where.date.lte = filters.endDate;
        }
        if (filters.category) where.category = filters.category;
        if (filters.status) where.status = filters.status;
      }

      const events = await db.event.findMany({
        where,
        orderBy: { date: "asc" },
        include: { creator: true, attendees: true }
      });

      return events;
    } catch (error: any) {
      console.error("Error listando eventos:", error);
      throw new Error("No se pudieron listar los eventos");
    }
  }

  // Update Event
  async updateEvent(eventId: number, userId: number, updateData: Partial<EventData>) {
    try {
      const event = await this.getEventById(eventId);
      if (event.creatorId !== userId) throw new Error("No autorizado para modificar este evento");

      const data: any = { ...updateData };

      if (updateData.category) {
        data.category = { set: updateData.category as Category };
      }

      return await db.event.update({
        where: { id: eventId },
        data,
      });
    } catch (error: any) {
      console.error("Error actualizando evento:", error);
      throw new Error("No se pudo actualizar el evento");
    }
  }


  // Cancelar evento (solo creador)
  async cancelEvent(eventId: number, userId: number) {
    try {
      const event = await this.getEventById(eventId);
      if (event.creatorId !== userId) throw new Error("No autorizado para cancelar este evento");

      return db.event.update({
        where: { id: eventId },
        data: { status: "CANCELLED" },
      });
    } catch (error: any) {
      console.error("Error cancelando evento:", error);
      throw new Error("No se pudo cancelar el evento");
    }
  }

  // Confirmar asistencia gratuita
  async confirmAttendance(userId: number, eventId: number) {
    try {
      const event = await this.getEventById(eventId);
      if (!event.isFree) throw new Error("Este evento requiere pago");
      //easter egg super secreto
      if (event.maxAttendees && event.attendees.length >= event.maxAttendees) throw new Error("Evento completo");

      const existing = await db.attendance.findUnique({
        where: { userId_eventId: { userId, eventId } }
      });
      if (existing) throw new Error("Asistencia ya confirmada");

      return db.attendance.create({ data: { userId, eventId } });
    } catch (error: any) {
      console.error("Error confirmando asistencia:", error);
      throw new Error(error.message || "No se pudo confirmar asistencia");
    }
  }

  // Comprar ticket (evento de pago)
  async buyTicket(userId: number, eventId: number, quantity: number = 1) {
    try {
      const event = await this.getEventById(eventId);
      if (event.isFree) throw new Error("Este evento es gratuito, usa confirmAttendance");
      if (event.maxAttendees && event.attendees.length + quantity > event.maxAttendees) throw new Error("No hay suficientes cupos");

      const user = await userService.getUserById(userId);
      const totalPrice = event.price * quantity;
      if (user.balance < totalPrice) throw new Error("Saldo insuficiente");

      // Restar saldo
      await userService.addBalance(userId, -totalPrice);

      // Crear asistencias con createMany
      const attendances = await db.attendance.createMany({
        data: Array.from({ length: quantity }, () => ({ userId, eventId })),
      });

      return attendances;
    } catch (error: any) {
      console.error("Error comprando tickets:", error);
      throw new Error(error.message || "No se pudo comprar tickets");
    }
  }

  // Cancelar asistencia de un usuario
  async cancelAttendance(userId: number, eventId: number) {
    try {
      const existing = await db.attendance.findUnique({
        where: { userId_eventId: { userId, eventId } }
      });
      if (!existing) throw new Error("Asistencia no encontrada");

      return db.attendance.delete({
        where: { userId_eventId: { userId, eventId } }
      });
    } catch (error: any) {
      console.error("Error cancelando asistencia:", error);
      throw new Error(error.message || "No se pudo cancelar la asistencia");
    }
  }

  // Cancelar asistencia de otro usuario (solo creador)
  async cancelOtherAttendee(creatorId: number, attendeeId: number, eventId: number) {
    try {
      const event = await this.getEventById(eventId);
      if (event.creatorId !== creatorId) throw new Error("No autorizado");

      return this.cancelAttendance(attendeeId, eventId);
    } catch (error: any) {
      console.error("Error cancelando otro asistente:", error);
      throw new Error(error.message || "No se pudo cancelar la asistencia del usuario");
    }
  }

  // Historial de asistencias del usuario
  async getUserAttendance(userId: number) {
    try {
      return db.attendance.findMany({
        where: { userId },
        include: { event: true },
        orderBy: { event: { date: "asc" } }
      });
    } catch (error: any) {
      console.error("Error obteniendo historial de asistencias:", error);
      throw new Error("No se pudo obtener el historial de asistencias");
    }
  }

  // Eventos creados por un usuario
  async getUserCreatedEvents(userId: number) {
    try {
      return db.event.findMany({
        where: { creatorId: userId, status: { not: "CANCELLED" } },
        include: { attendees: true },
        orderBy: { date: "asc" }
      });
    } catch (error: any) {
      console.error("Error obteniendo eventos creados:", error);
      throw new Error("No se pudieron obtener los eventos creados por el usuario");
    }
  }
}
