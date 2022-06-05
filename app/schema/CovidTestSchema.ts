import { ResultType } from "../../test/result/ResultType"
import { TestType } from "../../test/TestType"
import { UserSchema } from "./UserSchema"

export interface CovidTestSchema {
  id: string,
  type: TestType,
  patient: UserSchema,
  administerer: UserSchema,
  booking: any,
  result: ResultType,
  status: string,
  notes: string,
  datePerformed: string,
  dateOfResults: string,
  createdAt: string,
  updatedAt: string
}