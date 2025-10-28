export type CreateUserBody = {
nickName: string;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  password: string; 
}

export interface EventData {
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

export type JsonWebTokenBody = {
  id: number;
  email: string;
};

export interface AuthRequest extends Request {
  user?: JsonWebTokenBody;
}