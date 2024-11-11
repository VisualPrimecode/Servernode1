import express from 'express'
import RespRoutes from './routes/contactos.routes.js'
import cors from 'cors'

const app = express()
app.use(cors({
    origin: 'https://claudro-cloud.s3.eu-west-1.amazonaws.com/paginaGalvanos/index.html'
}));
app.use(express.json());

app.use(RespRoutes)

export default app