import { configureDB } from './db';
import bodyParser from 'body-parser'
import express from 'express'
import authRouter from './routers/authRouter'

const app: express.Application = express()

const PORT: number = process.env.PORT as unknown as number || 8000

configureDB()

app.use(bodyParser.json())
app.use('/api', authRouter) // Authentication routes

app.listen(PORT, () => {
    console.log('Server started and running....')
})