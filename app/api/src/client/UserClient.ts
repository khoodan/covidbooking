import { UserDBSchema } from "@schema/UserSchema";

export interface UserClient {
  getUsers(): Promise<UserDBSchema[]>
  addUser(user: UserDBSchema): Promise<void>
  getTestById(userId: string): Promise<UserDBSchema>
}