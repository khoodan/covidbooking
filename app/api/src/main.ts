import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  var envResult = dotenv.config();
  if (envResult.error) {
    throw envResult.error
  }
}

// Create modules
import moduleAlias from 'module-alias';
moduleAlias.addAliases({
  "@schema": __dirname + "/../../schema",
  "src": __dirname
})

import express, { NextFunction } from 'express'
import { UserController } from './controller/UserController';
import { Status } from '@schema/Status';
const app = express()


app.use(express.json())

app.use((err, req, res, next) => {
  console.log(req.method + ": " + req.path)
  next(err)
})

app.use(UserController.path, UserController.router)

app.get('/', (req, res) => res.status(200).send("OK"))

app.use((err, req, res, next: NextFunction) => {
  console.log('got error', err)
  if (err.message === Status.BADREQUEST) {
    res.sendStatus(400)
  } else {
    res.sendStatus(500)
  }
})

const port = process.env.PORT || 6002;
app.listen(port, () => console.log(`Running on port ${port} on environment ${process.env.NODE_ENV}`))