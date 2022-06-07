import { BookingSchema } from "./BookingSchema";

export interface AddressSchema {
  latitude?: number;
  longitude?: number;
  unitNumber?: string;
  street?: string;
  street2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  additionalInfo?: any
}

export interface TestSiteSchema {
  id?: string;
  name?: string;
  description?: string;
  websiteUrl?: string;
  phoneNumber?: string;
  address?: AddressSchema
  additionalInfo?: any;
  bookings?: BookingSchema[];
  createdAt?: string;
  updatedAt?: string;
}