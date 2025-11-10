import { Category, EventStatus } from "@prisma/client";
import { db } from "../db/db";
import { UserService } from "./userService";
import { EventData } from "../utils/types";
import { EventValidation } from "../validations/eventValidation";

const userService = new UserService();

export class EventService {

  // Create New Event
  async createEvent(userId: number, eventData: EventData) {
    EventValidation.validateEventData(eventData);

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
  }

  // Get Event By Id
  async getEventById(eventId: number) {
      const event = await db.event.findUnique({
        where: { id: eventId },
        include: { attendees: true, creator: true }
      });
      if (!event || event.status === "CANCELLED") throw new Error("Evento no encontrado");
      return event;
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
      const where: any = { status: { not: EventStatus.CANCELLED } };

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
  }

  // Update Event
  async updateEvent(eventId: number, userId: number, updateData: Partial<EventData>) {
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
  }


  // Cancel Event Only For Creator
  async cancelEvent(eventId: number, userId: number) {
      const event = await this.getEventById(eventId);
      if (event.creatorId !== userId) throw new Error("No autorizado para cancelar este evento");

      return db.event.update({
        where: { id: eventId },
        data: { status: "CANCELLED" },
      });
  }

  // Confirm Free Attendance 
  async confirmAttendance(userId: number, eventId: number) {
      const event = await this.getEventById(eventId);

      if (!event.isFree) throw new Error("Este evento requiere pago");
      EventValidation.validateAttendance(event);

      const existing = await db.attendance.findFirst({
        where: { userId, eventId }
      });

      if (existing) throw new Error("Asistencia ya confirmada");

      return db.attendance.create({ data: { userId, eventId, confirmed: true } });
  }


// Buy Ticket
async buyTicket(userId: number, eventId: number, quantity: number = 1) {
  const event = await this.getEventById(eventId);
  if (event.isFree) throw new Error("Este evento es gratuito, usa confirmAttendance");

  // Verificar si el usuario ya tiene una asistencia registrada
  const existingAttendance = await db.attendance.findFirst({
    where: { userId, eventId },
  });

  // Calcular cuántos tickets lleva comprados
  const totalTickets = existingAttendance?.ticketsBought ?? 0;
  const totalBought = totalTickets + quantity;

  if (totalBought > 5) {
    throw new Error("Máximo 5 tickets por usuario");
  }

  // Verificar capacidad máxima del evento
  if (event.maxAttendees && event.attendees.length + quantity > event.maxAttendees) {
    throw new Error("No hay suficientes cupos");
  }

  // Verificar saldo del usuario
  const user = await userService.getUserById(userId);
  const totalPrice = event.price * quantity;

  if (user.balance < totalPrice) throw new Error("Saldo insuficiente");

  // Descontar el saldo del usuario
  await userService.subtractBalance(userId, totalPrice);

  // Si ya tenía una asistencia, actualizamos la cantidad
  if (existingAttendance) {
    return db.attendance.update({
      where: { id: existingAttendance.id },
      data: {
        ticketsBought: totalBought,
        paid: true,
        confirmed: true,
      },
    });
  } else {
    // Si no tenía, creamos una nueva asistencia
    return db.attendance.create({
      data: {
        userId,
        eventId,
        ticketsBought: quantity,
        paid: true,
        confirmed: true,
      },
    });
  }
}

  async geAttendance(userId: number, eventId: number){
    const attendance = await db.attendance.findFirst({
      where: {eventId:eventId, userId: userId}
    })

    return attendance
  }

  // Cancel Attendance From An User
  async cancelAttendance(userId: number, eventId: number) {
      const existing = await db.attendance.findFirst({
        where: { userId, eventId }
      });
      if (!existing) throw new Error("Asistencia no encontrada");

      return db.attendance.delete({
        where: { id: existing.id }
      });
  }

  // Cancel Attendance From A Creator
  async cancelOtherAttendee(creatorId: number, attendeeId: number, eventId: number) {
      const event = await this.getEventById(eventId);
      if (event.creatorId !== creatorId) throw new Error("No autorizado");

      return this.cancelAttendance(attendeeId, eventId);
  }

  // History Of Attendance From An User
  async getUserAttendance(userId: number) {
      return db.attendance.findMany({
        where: { userId },
        include: { event: true },
        orderBy: { event: { date: "asc" } }
      });
  }

  // Events Created
  async getUserCreatedEvents(userId: number) {
      return db.event.findMany({
        where: { creatorId: userId, status: { not: "CANCELLED" } },
        include: { attendees: true },
        orderBy: { date: "asc" }
      });
  }

}
