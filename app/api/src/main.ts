import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  var envResult = dotenv.config();
  if (envResult.error) {
    throw envResult.error
  }
}

import express from 'express'
const app = express()

app.get('/', (req, res) => res.status(200).send("OK"))

const port = process.env.PORT || 6002;
app.listen(port, () => console.log(`Running on port ${port} on environment ${process.env.NODE_ENV}`))