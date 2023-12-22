import express from 'express'
import { bootstrap } from './index.routes.js'
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT
const app = express()


// bootstrap Routes
bootstrap(app, express)

app.listen(port, () => {
    console.log("server is running...", port);
})