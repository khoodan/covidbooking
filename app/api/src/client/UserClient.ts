import { UserSchema } from "@schema/UserSchema";

export interface UserClient {
  getUsers(): Promise<UserSchema[]>
}