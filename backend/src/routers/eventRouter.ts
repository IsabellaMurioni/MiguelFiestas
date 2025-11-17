import { Router } from "express";
import { EventService } from "../services/eventService";
import { imageService } from "../services/imageService";
import { upload } from "../middleware/upload";
import { requireAuth } from "../middleware/requireAuth";
import { Image } from "@prisma/client";

const eventRouter = Router();
const eventService = new EventService();

/**
 * POST /events
 * Create a new event with optional images
 */
eventRouter.post(
  "/",
  requireAuth,
  upload.array("images", 10), // máximo 10 imágenes
  async (req: any, res: any) => {
    try {
      const userId = req.user.id;

      // Parsear los datos del evento
      const eventData = {
        title: req.body.title,
        shortDesc: req.body.shortDesc,
        longDesc: req.body.longDesc,
        date: new Date(req.body.date),
        location: req.body.location,
        category: req.body.category,
        price: parseFloat(req.body.price),
        maxAttendees: parseInt(req.body.maxAttendees),
      };

      // Validar datos requeridos
      if (!eventData.title || !eventData.shortDesc || !eventData.date || !eventData.location) {
        return res.status(400).json({ error: "Missing required fields: title, shortDesc, date, location" });
      }

      // Crear el evento
      const event = await eventService.createEvent(userId, eventData as any);

      // Procesar imágenes si existen
      const files = req.files as Express.Multer.File[];
      let images: Image[] = [];

      if (files && files.length > 0) {
        images = await imageService.saveEventImages(event.id, files);
      }

      res.status(201).json({ 
        data: { 
          event, 
          images 
        }, 
        message: "Event created successfully" 
      });
    } catch (error: any) {
      console.error("Error creating event:", error);
      const statusCode = error.message.includes("not found") || error.message.includes("Invalid") ? 400 : 500;
      res.status(statusCode).json({ error: error.message });
    }
  }
);

/**
 * GET /events
 * Get events with optional filters
 */
eventRouter.get("/", async (req, res) => {
  try {
    console.log('Query parameters received:', req.query);
    console.log('Headers:', req.headers);

    const filters: any = {};

    if (req.query.free !== undefined) {
      console.log('Free filter:', req.query.free);
      filters.free = req.query.free === "true";
    }
    if (req.query.priceMin) {
      console.log('Price min:', req.query.priceMin);
      filters.priceMin = Number(req.query.priceMin);
    }
    if (req.query.priceMax) {
      console.log('Price max:', req.query.priceMax);
      filters.priceMax = Number(req.query.priceMax);
    }
    if (req.query.category) {
      console.log('Category:', req.query.category);
      filters.category = String(req.query.category);
    }
    if (req.query.status) {
      console.log('Status:', req.query.status);
      filters.status = String(req.query.status);
    }

    console.log('Applied filters:', filters);

    const events = await eventService.listEvents(filters);
    
    console.log('Events found:', events.length);
    
    res.json(events);
  } catch (err: any) {
    console.error('Error in /events:', err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /events/:id
 * Get event by ID
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
 * POST /events/:id/buy
 * Buy tickets for an event
 */
eventRouter.post("/:id/buy", requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const eventID = Number(req.params.id);
    const quantity = req.body.quantity;

    await eventService.getEventById(eventID);
    const ticket = await eventService.buyTicket(userId, eventID, quantity);

    res.status(200).json({
      data: ticket,
      message: "Ticket purchased successfully."
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /events/:id/cancel
 * Cancel an event (only creator)
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
 * Confirm attendance (free event)
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
 * Cancel user's attendance
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
 * Update an event (only creator)
 */
eventRouter.patch("/:id", requireAuth, async (req: any, res) => {
  try {
    const eventId = Number(req.params.id);
    const userId = req.user.id;

    if (isNaN(eventId)) return res.status(400).json({ error: "Invalid ID" });

    const updatedEvent = await eventService.updateEvent(eventId, userId, req.body);
    res.status(200).json(updatedEvent);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default eventRouter;