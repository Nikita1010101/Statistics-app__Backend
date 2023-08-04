require('dotenv').config()

import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

import { authRouter } from './routes/index.route'
import { authMiddleWare } from './middlewares/auth.middleware'
import { roleMiddleWare } from './middlewares/role.middleware'
import { sequelize } from './db'

const PORT = process.env.PORT || 7000

const app = express()

app.use(express.json())
app.use(
	cors({
		credentials: true,
		origin: process.env.CLIENT_URL
	})
)
app.use(cookieParser())
app.use('/api', authRouter)
app.use(authMiddleWare)
app.use(roleMiddleWare)

const start = async () => {
	try {
		await sequelize.authenticate()
		await sequelize.sync()

		app.listen(PORT, () => {
			console.log(`Сервер успешно запущен на ${PORT} порту!`)
		})
	} catch (error) {
		throw new Error()
	}
}

start()
