import { AuthService } from '../src/services/authService'
import bcrypt from 'bcrypt'
import { db } from '../src/db/db'
import { JwtService } from '../src/services/jwtService'

jest.mock('../src/db/db')
jest.mock('bcrypt')
jest.mock('../src/services/jwtService')

describe('AuthService', () => {
  let authService: AuthService
  let mockJwtService: jest.Mocked<JwtService>

  beforeEach(() => {
    mockJwtService = {
      generateJsonWebAccessToken: jest.fn(),
      verifyAccessToken: jest.fn()
    } as any

    authService = new AuthService()
    ;(authService as any).jwtService = mockJwtService
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword'
      }

      ;(db.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      mockJwtService.generateJsonWebAccessToken.mockResolvedValue('mockToken')

      const result = await authService.login('test@example.com', 'password')

      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      })
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword')
      expect(mockJwtService.generateJsonWebAccessToken).toHaveBeenCalledWith(mockUser)
      expect(result).toEqual({ user: mockUser, accessToken: 'mockToken' })
    })

    it('should throw error for non-existent user', async () => {
      ;(db.user.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(authService.login('nonexistent@example.com', 'password'))
        .rejects.toThrow('Email incorrecto.')
    })

    it('should throw error for invalid password', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword'
      }

      ;(db.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(authService.login('test@example.com', 'wrongpassword'))
        .rejects.toThrow('Contraseña incorrectos')
    })
  })
})