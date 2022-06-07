import { BookingSchema } from './BookingSchema'
import { UserSchema } from './UserSchema'

export interface TestSchema {
  id?: string;
  type?: string;
  patient?: UserSchema;
  administerer?: UserSchema;
  booking?: BookingSchema;
  result?: string;
  status?: string;
  notes?: string;
  datePerformed?: string;
  dateOfResults?: string;
  createdAt?: string;
  updatedAt?: string;
  additionalInfo?: any; 
}

export interface CreateTestSchema {
  type?: string;
  patientId?: string;
  administererId?: string;
  bookingId?: string;
  result?: string;
  status?: string;
  notes?: string;
  additionalInfo?: any;
}