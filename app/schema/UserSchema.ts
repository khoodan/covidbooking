export interface UserSchema {
  id?: string;
  givenName?: string;
  familyName?: string;
  userName?: string;
  phoneNumber?: string;
  isCustomer?: boolean;
  isReceptionist?: boolean;
  isHealthcareWorker?: boolean;
  bookings?: any;
  testsTaken?: any;
  testsAdministered?: any;
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

export interface Credentials {
  userName: string;
  password: string;
}

export interface JWT {
  jwt: string
}
