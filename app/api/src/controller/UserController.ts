import { Router } from "express"
import { UserService } from "src/service/UserService"
import { Endpoint } from "./Endpoint"
const router = Router()

const userService: UserService = new UserService()

router.get('/', async (req, res, next) => {
  userService.getUsers()
  .then(users => {
    res.send(users)
  })
  .catch(err => {
    console.error(err)
    res.sendStatus(500)
  })
})

export const UserController = new Endpoint('/user', router)

