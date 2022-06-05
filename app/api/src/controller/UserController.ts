import { Router } from "express"
import { Endpoint } from "./Endpoint"
const router = Router()

router.get('/', (req, res, next) => {
  
})

export const UserController = new Endpoint('/user', router)

