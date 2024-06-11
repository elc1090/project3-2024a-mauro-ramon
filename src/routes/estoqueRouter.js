import { Router } from 'express';

import { getStock, setStock } from '../db/mongoClient.js'

const router = Router();

router.get('/', async (req, res) => {
    try {
        const {tipo, nome} = req.body;
    
        res.status(200).json(await getStock(tipo, nome));
    } catch (e) {
        res.status(500).json({
            "error": e.message,
            "ok": false 
        })
    }
});

router.post('/', async (req, res) => {
    try {
        const {tipo, nome, qtd} = req.body;
    
        await setStock(tipo, nome, qtd);
    
        res.status(200).json({
            "inserted" : 1,
            "ok": true
        })
    } catch (e) {
        res.status(500).json({
            "error": e.message,
            "ok": false 
        })
    }
});

export { router as estoqueRouter };