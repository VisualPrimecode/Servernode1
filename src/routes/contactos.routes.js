import { Router } from 'express'
import {actResp, crearResp, delResp, getResp, obtResp} from '../controllers/contactos.controller.js'
const router = Router()

    router.get('/',getResp);

    router.get("/respuestas", getResp); 

    router.get("/respuestas/:id", obtResp);

    router.post('/respuestas', crearResp);

    router.put('/respuestas/:id', actResp);
    
    router.delete("/respuestas/:id", delResp);
        
export default router;