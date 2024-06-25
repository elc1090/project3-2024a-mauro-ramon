import { Router } from 'express';
import { getStock, setStock, deleteById, updateById } from '../lib/estoque.js';
import { authenticateToken } from '../lib/secure/auth.js';
import { dropDatabase } from '../db/mongoClient.js';

const router = Router();

router.use( authenticateToken );

router.get('/', async (req, res) => {
    try {
        const user = req.user;

        const result = await getStock(user);

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
        const user = req.user;
    
        const result = await setStock(user, cat, atr);
    
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
        const { id } = req.body;
        const user = req.user;

        const result = await deleteById(user, id);

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
        const { id, cat, atr} = req.body;
        const user = req.user;

        const result = await updateById(user, id, cat, atr);

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