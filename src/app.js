import express from 'express'
import RespRoutes from './routes/contactos.routes.js'
import cors from 'cors'

const app = express()
app.use(cors());
app.use(express.json());

app.use(RespRoutes)

export default app