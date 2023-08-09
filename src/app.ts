require('dotenv').config()

import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

import { mainRouter } from './routes/index.route'
import { sequelize } from './db'

const PORT = process.env.PORT || 7000

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
	cors({
		credentials: true,
		origin: process.env.CLIENT_URL
	})
)
app.use('/api', mainRouter)

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
