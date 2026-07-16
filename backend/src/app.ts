import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import rateLimit from 'express-rate-limit'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'

const { PORT = 3000 } = process.env
const app = express()

app.set('trust proxy', 1)

app.use(cookieParser())

const corsOptions = {
    origin: process.env.ORIGIN_ALLOW || '*',
    credentials: true,
}
app.use(cors(corsOptions))

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
})
app.use(globalLimiter)

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // всего 10 попыток за 15 минут
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Слишком много запросов, попробуйте позже',
    },
})

const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Слишком много загрузок, попробуйте позже',
    },
})

app.use('/auth', authLimiter)
app.use('/upload', uploadLimiter)

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true, limit: '1mb' }))
app.use(json({ limit: '1mb' }))

app.use(routes)
app.use(errors())
app.use(errorHandler)

const bootstrap = () => {
    mongoose
        .connect(DB_ADDRESS)
        .then(() => {
            app.listen(PORT, () => console.log('ok'))
        })
        .catch(console.error)
}

bootstrap()
