import { CreateUserSchema, UserDBSchema } from "@schema/UserSchema";

export interface UserClient {
  getUsers(): Promise<UserDBSchema[]>
  addUser(user: CreateUserSchema): Promise<void>
}