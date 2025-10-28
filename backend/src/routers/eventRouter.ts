import { Router } from "express";
import { EventService } from "../services/eventService";
import { JwtService } from "../services/jwtService";

const eventRouter = Router();
const eventService = new EventService();

import { requireAuth } from "../middleware/requireAuth";

/**
 * Middleware auth
 */

/**
 * POST /events
 * Crear un nuevo evento
 */
eventRouter.post("/", requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const eventData = { ...req.body, date: new Date(req.body.date) };
    const created = await eventService.createEvent(userId, eventData);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

eventRouter.post("/:id/buy", requireAuth, async (req: any, res) => {
  try {

    const userId = req.user.id;

    const eventID = Number(req.params.id)

    await eventService.getEventById(eventID)

    const quantity = req.body.quantity

    const ticket = await eventService.buyTicket(userId, eventID, quantity)

    res.status(200).json({
      data: ticket,
      message: "Ticket purchased successfully."
    })
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /events
 * Lista de eventos (con filtros opcionales)
 */
eventRouter.get("/", async (req, res) => {
  try {
    const filters: any = {};

    if (req.query.free !== undefined) filters.free = req.query.free === "true";
    if (req.query.priceMin) filters.priceMin = Number(req.query.priceMin);
    if (req.query.priceMax) filters.priceMax = Number(req.query.priceMax);
    if (req.query.startDate) filters.startDate = new Date(String(req.query.startDate));
    if (req.query.endDate) filters.endDate = new Date(String(req.query.endDate));
    if (req.query.category) filters.category = String(req.query.category);
    if (req.query.status) filters.status = String(req.query.status);

    const events = await eventService.listEvents(filters);
    res.json(events);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /events/:id
 */
eventRouter.get("/:id", async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const event = await eventService.getEventById(eventId);
    res.json(event);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /events/:id/cancel
 */
eventRouter.post("/:id/cancel", requireAuth, async (req: any, res) => {
  try {
    const eventId = Number(req.params.id);
    const result = await eventService.cancelEvent(eventId, req.user.id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /events/:id/confirm
 * Confirmar asistencia (evento gratuito)
 */
eventRouter.post("/:id/confirm", requireAuth, async (req: any, res) => {
  try {
    const eventId = Number(req.params.id);
    const confirmed = await eventService.confirmAttendance(req.user.id, eventId);
    res.status(201).json(confirmed);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE /events/:id/attendance
 * Cancelar asistencia del propio usuario
 */
eventRouter.delete("/:id/attendance", requireAuth, async (req: any, res) => {
  try {
    const eventId = Number(req.params.id);
    const cancelled = await eventService.cancelAttendance(req.user.id, eventId);
    res.json(cancelled);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * PATCH /events/:id
 * Actualizar un evento (solo el creador)
 */
eventRouter.patch("/:id", requireAuth, async (req: any, res) => {
  try {
    const eventId = Number(req.params.id);
    const userId = req.user.id;

    if (isNaN(eventId)) return res.status(400).json({ error: "ID inválido" });

    const updatedEvent = await eventService.updateEvent(eventId, userId, req.body);
    res.status(200).json(updatedEvent);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default eventRouter;
