import { EventService } from '../src/services/eventService'
import { db } from '../src/db/db'
import { UserService } from '../src/services/userService'

import { Category } from '@prisma/client'

jest.mock('../db/db')
jest.mock('./userService')

describe('EventService', () => {
  let eventService: EventService
  let mockUserService: jest.Mocked<UserService>

  beforeEach(() => {
    mockUserService = {
      getUserById: jest.fn(),
      subtractBalance: jest.fn()
    } as any

    eventService = new EventService()
    ;(eventService as any).userService = mockUserService
    jest.clearAllMocks()
  })

  describe('createEvent', () => {
    it('should create a new event successfully', async () => {
      const mockEventData = {
        title: 'Test Event',
        shortDesc: 'Test Description',
        location: 'Test Location',
        category: Category.CONCERTS,
        date: new Date(),
        price: 0,
        maxAttendees: 100
      }

      const mockEvent = {
        id: 1,
        ...mockEventData,
        creatorId: 1
      }

      ;(db.event.create as jest.Mock).mockResolvedValue(mockEvent)

      const result = await eventService.createEvent(1, mockEventData)

      expect(db.event.create).toHaveBeenCalled()
      expect(result).toEqual(mockEvent)
    })
  })

  describe('buyTicket', () => {
    it('should buy ticket successfully', async () => {
      const mockEvent = {
        id: 1,
        title: 'Paid Event',
        price: 50,
        isFree: false,
        maxAttendees: 100,
        attendees: []
      }

      const mockUser = {
        id: 1,
        balance: 100
      }

      ;(eventService as any).getEventById = jest.fn().mockResolvedValue(mockEvent)
      ;(db.attendance.findFirst as jest.Mock).mockResolvedValue(null)
      mockUserService.getUserById.mockResolvedValue(mockUser.id as any)
      mockUserService.subtractBalance.mockResolvedValue({ user: { id: 1, balance: 50 } } as any)
      ;(db.attendance.create as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
        eventId: 1,
        ticketsBought: 1,
        paid: true,
        confirmed: true
      })

      const result = await eventService.buyTicket(1, 1, 1)

      expect(mockUserService.subtractBalance).toHaveBeenCalledWith(1, 50)
      expect(result.ticketsBought).toBe(1)
    })

    it('should throw error for free event', async () => {
      const mockEvent = {
        id: 1,
        isFree: true
      }

      ;(eventService as any).getEventById = jest.fn().mockResolvedValue(mockEvent)

      await expect(eventService.buyTicket(1, 1, 1))
        .rejects.toThrow('Este evento es gratuito, usa confirmAttendance')
    })
  })
})