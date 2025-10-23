import { db } from "../db/db";
export class EventService {

  async createEvent(userId: number, eventData: {
    title: string;
    shortDesc: string;
    longDesc?: string;
    location: string;
    date: Date;
    price?: number;
    category: string;
    maxAttendees?: number;
    images?: string[];
  }) {
    const isFree = !eventData.price || eventData.price <= 0;

    const event = await db.event.create({
      data: {
        ...eventData,
        price: eventData.price || 0,
        isFree,
        creatorId: userId,
        attendees: { create: { userId } } // el creador se autoasigna
      },
      include: { attendees: true }
    });

    return event;
  }

  //Obtener detalle de un evento por ID 
  async getEventById(eventId: number) {
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: { attendees: true, creator: true }
    });
    if (!event) throw new Error("Evento no encontrado");
    return event;
  }

  // Listar eventos con filtros opcionales
  async listEvents(filters?: {
    free?: boolean;
    priceMin?: number;
    priceMax?: number;
    startDate?: Date;
    endDate?: Date;
    category?: string;
    status?: string;
  }) {
    const where: any = {};

    if (filters) {
      if (filters.free !== undefined) where.isFree = filters.free;
      if (filters.priceMin !== undefined) where.price = { gte: filters.priceMin };
      if (filters.priceMax !== undefined) where.price = { lte: filters.priceMax };
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

  // cancelar evento (solo creador)
  async cancelEvent(eventId: number, userId: number) {
    const event = await db.event.findUnique({ where: { id: eventId } });
    if (!event) throw new Error("Evento no encontrado");
    if (event.creatorId !== userId) throw new Error("No autorizado para cancelar");

    return db.event.update({
      where: { id: eventId },
      data: { status: "CANCELLED" }
    });
  }

  // confirmar asistencia de un usuario (evento gratuito)
  async confirmAttendance(userId: number, eventId: number) {
    const event = await db.event.findUnique({ where: { id: eventId } });
    if (!event) throw new Error("Evento no encontrado");
    if (!event.isFree) throw new Error("Este evento requiere pago");

    // Verifica si ya está confirmado
    const existing = await db.attendance.findUnique({
      where: { userId_eventId: { userId, eventId } }
    });
    if (existing) throw new Error("Asistencia ya confirmada");

    return db.attendance.create({
      data: { userId, eventId }
    });
  }

  /** Cancelar asistencia de un usuario (evento gratuito) */
  async cancelAttendance(userId: number, eventId: number) {
    return db.attendance.delete({
      where: { userId_eventId: { userId, eventId } }
    });
  } 

  /** Cancelar asistencia de otro usuario (solo creador) */
  async cancelOtherAttendee(creatorId: number, attendeeId: number, eventId: number) {
    const event = await db.event.findUnique({ where: { id: eventId } });
    if (!event) throw new Error("Evento no encontrado");
    if (event.creatorId !== creatorId) throw new Error("No autorizado");

    return this.cancelAttendance(attendeeId, eventId);
  }

}
