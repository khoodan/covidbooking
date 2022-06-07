import { TestSiteSchema } from "./LocationSchema";
import { TestSchema } from "./TestSchema";
import { UserSchema } from "./UserSchema";

export interface BookingSchema {
  id?: string;
  customer?: UserSchema;
  testingSite?: TestSiteSchema;
  createdAt?: string;
  updatedAt?: string;
  startTime?: string;
  smsPin?: string;
  status?: string;
  covidTests?: TestSchema[];
  notes?: string;
  additionalInfo?: any;
}

export interface CreateBookingSchema {
  customerId?: string;
  testingSiteId?: string;
  startTime?: string;
  notes?: string;
  additionalInfo?: any;
}

export interface BookingDBSchema {
  id?: string;
  customerId?: string;
  testingSiteId?: string;
  createdAt?: string;
  updatedAt?: string;
  startTime?: string;
  smsPin?: string;
  status?: string;
  covidTestIds?: string[];
  notes?: string;
  additionalInfo?: any;
}