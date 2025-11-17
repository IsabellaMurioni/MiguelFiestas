import { hash } from "bcrypt";
import { db } from "../db/db";
import { JwtService } from "./jwtService";
import { CreateUserBody } from "../utils/types";
import { UserValidation } from "../validations/userValidation";
const jwtService = new JwtService();

export class UserService {

  

  // Register
  async createUser(body: CreateUserBody) {

    UserValidation.validatePassword(body.password);
    await UserValidation.validateNicknameUsed(body.nickName);
    await UserValidation.validateEmail(body.email);
    await UserValidation.validateDni(body.dni);

    const user = await db.user.create({
      data: {
        nickName: body.nickName,
        firstName: body.firstName,
        lastName: body.lastName,
        dni: body.dni,
        email: body.email,
        password: await hash(body.password, 10)
      }
    });

    return user;

  }

  async getJoinedEvents(userId: number): Promise<any[]> {
    
    await this.getUserById(userId)

    const attendances = await db.attendance.findMany({
      where: { userId },
      include: { 
      event: {
        include: {
          images: true,
          attendees: true,
          creator: { 
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      }
    }
  });
  
     // ✅ CALCULAR attendeesCount PARA CADA EVENTO
    return attendances.map((att: { event: any; }) => {
      const event = att.event;
      const attendeesCount = event.attendees.reduce((total: number, attendee: any) => {
        return total + (attendee.ticketsBought || 1);
      }, 0);
      
      return {
        ...event,
        attendeesCount // ✅ AGREGAR LA PROPIEDAD CALCULADA
      };
    });
  }

  async getCreatedEvents(userId: number): Promise<any[]> {
    await this.getUserById(userId)

    const events = await db.event.findMany({
      where: { 
        creatorId: userId,
        status: { not: "CANCELLED" }
      },
      include: {
      images: true,
      attendees: true,
      creator: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  });

    // ✅ CALCULAR attendeesCount PARA CADA EVENTO
    return events.map(event => {
      const attendeesCount = event.attendees.reduce((total: number, attendee: any) => {
        return total + (attendee.ticketsBought || 1);
      }, 0);
      
      return {
        ...event,
        attendeesCount // ✅ AGREGAR LA PROPIEDAD CALCULADA
      };
    });
  }

  // Get Profile
  async getProfile(userID: number) {

      const user = await db.user.findUnique({
        where: { id: userID, deletedAt: null },
        select: {
          id: true,
          nickName: true,
          firstName: true,
          lastName: true,
          dni: true,
          email: true,
          balance: true,
          ticketsBought: true,
          confirmations: true
        },
      });

      if (!user) throw new Error("User not found");
      return user;
  }

  // Update profile
  async updateProfile(userId: number, updateData: Partial<{ firstName: string; lastName: string; email: string }>) {
      const updatedUser = await db.user.update({
        where: { id: userId, deletedAt: null },
        data: updateData,
        select: {
          id: true,
          nickName: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });

    return updatedUser;
  }

  // Get User By Id
  async getUserById(userId: number) {
      const user = await db.user.findFirst({ where: { id: userId, deletedAt: null } });
      if (!user) throw new Error("User not found");
      return user;
  }

  // Delete user
  async deleteUser(userId: number) {
      await this.getUserById(userId);
      return db.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
      });
  }

  // Add Balance (increment only)
  async addBalance(userId: number, amount: number) {
      if (amount <= 0) throw new Error("Invalid amount");

      const updatedUser = await db.user.update({
        where: { id: userId, deletedAt: null },
        data: { balance: { increment: amount } },
        select: { id: true, balance: true },
      });

      const transaction = await db.transaction.create({
        data: { userId, amount },
      });

      return { user: updatedUser, transaction };
  }

  // Subtract Balance
  async subtractBalance(userId: number, amount: number) {
      if (amount <= 0) throw new Error("Invalid amount");

      const user = await this.getUserById(userId);
      if (user.balance < amount) throw new Error("Insufficient balance");

      const updatedUser = await db.user.update({
        where: { id: userId, deletedAt: null },
        data: { balance: { decrement: amount } },
        select: { id: true, balance: true },
      });

      const transaction = await db.transaction.create({
        data: { userId, amount: -amount },
      });

      return { user: updatedUser, transaction };
  }


  // Transaction History
  async getTransactions(userId: number) {
      return db.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { id: true, amount: true, createdAt: true }
      });
  }

  // Increment Bought Tickets
  async incrementTickets(userId: number, count: number) {
    return db.user.update({
      where: { id: userId, deletedAt: null },
      data: { ticketsBought: { increment: count } },
      select: { id: true, ticketsBought: true },
    });
  }

  // Increment Attendance Confirmations
  async incrementConfirmations(userId: number) {
    console.log(`📈 Before increment - User ID: ${userId}`);
    
    const userBefore = await db.user.findUnique({
      where: { id: userId },
      select: { confirmations: true }
    });
    console.log(`📈 Before increment - Confirmations:`, userBefore?.confirmations);
    
    const updatedUser = await db.user.update({
      where: { id: userId, deletedAt: null },
      data: { confirmations: { increment: 1 } },
      select: { id: true, confirmations: true },
    });
    
    console.log(`📈 After increment - Confirmations:`, updatedUser.confirmations);
    
    return updatedUser;
  }

  // Get Top Event Creators
  async getTopCreators(limit: number) {
    const topCreators = await db.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        nickName: true,
        firstName: true,
        lastName: true,
        eventsCreated: {
          where: { status: { not: "CANCELLED" } },
          select: { id: true }
        }
      },
      orderBy: {
        eventsCreated: {
          _count: 'desc'
        }
      },
      take: limit
    });

    return topCreators.map(creator => ({
      id: creator.id,
      nickName: creator.nickName,
      firstName: creator.firstName,
      lastName: creator.lastName,
      eventsCreated: creator.eventsCreated.length
    }));
  }

  
}
