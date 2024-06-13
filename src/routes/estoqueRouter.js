import { Router } from 'express';

import { dropDatabase, getStock, setStock } from '../db/mongoClient.js'

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await getStock();

        res.status(200).json({
            "data" : result
        });
    } catch (e) {
        res.status(500).json({
            "error": e.message,
            "ok": false 
        })
    }
});

router.post('/', async (req, res) => {
    try {
        const {prod, qtd, marca} = req.body;
    
        const result = await setStock(prod, qtd, marca);
    
        res.status(200).json({
            "result" : result
        })
    } catch (e) {
        res.status(500).json({
            "error": e.message,
            "ok": false 
        })
    }
});

router.delete('/', async (req, res) => {
    try {    
        const result = await dropDatabase();
    
        res.status(200).json({
            "result" : result
        })
    } catch (e) {
        res.status(500).json({
            "error": e.message,
            "ok": false 
        })
    }
})

export { router as estoqueRouter };