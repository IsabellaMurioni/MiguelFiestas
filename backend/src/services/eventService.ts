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
        category: eventData.category as Category, 
        maxAttendees: eventData.maxAttendees ?? null,
        creatorId: userId,
        attendees: { 
          create: { 
            userId, 
            confirmed: true,
            paid: isFree, // Si es gratis, se marca como pagado automáticamente
            ticketsBought: 1
          } 
        }
      },
      include: { 
        attendees: true,
        // Incluir imágenes si las hay
        images: true 
      }
    });

    return event;
  }

  // Get Event By Id
  async getEventById(eventId: number) {
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: { 
        attendees: true, 
        creator: true,
        images: true
      }
    });
    console.log(event);
    if (!event || event.status === "CANCELLED") throw new Error("Event not found");
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
      include: { 
        creator: true, 
        attendees: true,
        images: true // Incluir imágenes en la lista
      }
    });

    return events;
  }

  // Update Event
  async updateEvent(eventId: number, userId: number, updateData: Partial<EventData>) {
    const event = await this.getEventById(eventId);
    if (event.creatorId !== userId) throw new Error("Not authorized to modify this event");

    const data: any = { ...updateData };

    if (updateData.category) {
      data.category = updateData.category as Category;
    }

    return await db.event.update({
      where: { id: eventId },
      data,
      include: {
        images: true // Incluir imágenes al actualizar
      }
    });
  }

  // Cancel Event Only For Creator
  async cancelEvent(eventId: number, userId: number) {
    const event = await this.getEventById(eventId);
    if (event.creatorId !== userId) throw new Error("Not authorized to cancel this event");

    return db.event.update({
      where: { id: eventId },
      data: { status: "CANCELLED" },
      include: {
        images: true // Incluir imágenes al cancelar
      }
    });
  }

  // Confirm Free Attendance 
  async confirmAttendance(userId: number, eventId: number) {
    const event = await this.getEventById(eventId);

    if (!event.isFree) throw new Error("This event requires payment");
    EventValidation.validateAttendance(event);

    const existing = await db.attendance.findFirst({
      where: { userId, eventId }
    });

    if (existing) throw new Error("Attendance already confirmed");

    // Create attendance record
    const attendance = await db.attendance.create({ 
      data: { 
        userId, 
        eventId, 
        confirmed: true,
        paid: true, // Evento gratis = pagado automáticamente
        ticketsBought: 1
      } 
    });

    // Increment user's confirmations counter
    await userService.incrementConfirmations(userId);

    return attendance;
  }

  // Buy Ticket
  async buyTicket(userId: number, eventId: number, quantity: number = 1) {
    const event = await this.getEventById(eventId);
    if (event.isFree) throw new Error("This event is free, use confirmAttendance");

    // Check user balance first
    const user = await userService.getUserById(userId);
    const totalPrice = event.price * quantity;

    if (user.balance < totalPrice) throw new Error("Insufficient balance");

    // Check if user already has attendance registered
    const existingAttendance = await db.attendance.findFirst({
      where: { userId, eventId },
    });

    // Calculate how many tickets have been purchased
    const totalTickets = existingAttendance?.ticketsBought ?? 0;
    const totalBought = totalTickets + quantity;

    if (totalBought > 5) {
      throw new Error("Maximum 5 tickets per person");
    }

    // Check maximum event capacity
    if (event.maxAttendees && event.attendees.length + quantity > event.maxAttendees) {
      throw new Error("Not enough capacity");
    }

    // Deduct user balance
    await userService.subtractBalance(userId, totalPrice);

    // Increment user's tickets bought counter only if new tickets are being added
    const ticketsToAdd = existingAttendance ? quantity : quantity;
    await userService.incrementTickets(userId, ticketsToAdd);

    // If user already had attendance, update the quantity
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
      // If user did not have attendance, create new one
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

  async getAttendance(userId: number, eventId: number){
    const attendance = await db.attendance.findFirst({
      where: {eventId: eventId, userId: userId}
    });

    return attendance;
  }

  // Cancel Attendance From An User
  async cancelAttendance(userId: number, eventId: number) {
    const existing = await db.attendance.findFirst({
      where: { userId, eventId }
    });
    if (!existing) throw new Error("Attendance not found");

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
      include: { 
        event: {
          include: {
            images: true // Incluir imágenes del evento
          }
        } 
      },
      orderBy: { event: { date: "asc" } }
    });
  }

  // Events Created
  async getUserCreatedEvents(userId: number) {
    return db.event.findMany({
      where: { creatorId: userId, status: { not: "CANCELLED" } },
      include: { 
        attendees: true,
        images: true // Incluir imágenes
      },
      orderBy: { date: "asc" }
    });
  }

}