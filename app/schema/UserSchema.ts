import { BookingSchema } from "./BookingSchema";
import { TestSchema } from "./TestSchema";

export interface UserSchema {
  id?: string;
  givenName?: string;
  familyName?: string;
  userName?: string;
  phoneNumber?: string;
  isCustomer?: boolean;
  isReceptionist?: boolean;
  isHealthcareWorker?: boolean;
  bookings?: BookingSchema[];
  testsTaken?: TestSchema[];
  testsAdministered?: TestSchema[];
  additionalInfo?: any;
}

export interface CreateUserSchema {
  id?: string;
  givenName: string;
  familyName: string;
  userName: string;
  password: string;
  phoneNumber: string;
  isCustomer: boolean;
  isReceptionist: boolean;
  isHealthcareWorker: boolean;
  additionalInfo: any;
}

export interface UserDBSchema {
  id?: string;
  givenName?: string;
  familyName?: string;
  userName?: string;
  phoneNumber?: string;
  isCustomer?: boolean;
  isReceptionist?: boolean;
  isHealthcareWorker?: boolean;
  bookingsIds?: string[];
  testsTakenIds?: string[];
  testsAdministeredIds?: string[];
  additionalInfo?: any;
}

export interface Credentials {
  userName: string;
  password: string;
}

export interface JWT {
  jwt: string
}
