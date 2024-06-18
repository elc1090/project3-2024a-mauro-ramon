import { Router } from 'express';

import { dropDatabase, getStock, setStock, deleteById, updateById } from '../db/mongoClient.js'

const router = Router();

router.get('/', async (req, res) => {
    try {
        const cat = req.query.cat;

        const result = await getStock(cat);

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
        const {cat, atr} = req.body;
    
        const result = await setStock(cat, atr);
    
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

router.delete('/all', async (req, res) => {
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
});

router.delete('/', async(req, res) =>{
    try{
        const {id} = req.body;

        const result = await deleteById(id);

        res.status(200).json({
            "result" : result
        })
    }
    catch{
        res.status(500).json({
            "error": e.message,
            "ok": false
        })
    }
});

router.put('/', async(req, res) => {
    try{
        const {id, cat, atr} = req.body;

        const result = await updateById(id, cat, atr);

        res.status(200).json({
            "result" : result
        })
    }
    catch{
        res.status(500).json({
            "error": e.message,
            "ok": false
        })
    }
});

export { router as estoqueRouter };