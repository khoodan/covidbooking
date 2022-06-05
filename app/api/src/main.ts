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
  "@schema": "../../schema",
  "src": __dirname
})

import express from 'express'
import { UserController } from './controller/UserController';
const app = express()

app.use(UserController.path, UserController.router)

app.get('/', (req, res) => res.status(200).send("OK"))

const port = process.env.PORT || 6002;
app.listen(port, () => console.log(`Running on port ${port} on environment ${process.env.NODE_ENV}`))