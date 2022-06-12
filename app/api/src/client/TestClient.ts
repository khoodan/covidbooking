import { CreateTestSchema, TestDBSchema } from "@schema/TestSchema";

export interface TestClient {
  getTests(): Promise<TestDBSchema[]>
  addTest(test: CreateTestSchema): Promise<void>
  getTestForId(testId: string): Promise<TestDBSchema>
}