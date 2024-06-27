import { Router } from 'express';
import { getStock, setStock, deleteById, updateById } from '../lib/estoque.js';
import { authenticateToken } from '../secure/auth.js';

const router = Router();

router.use( authenticateToken );

router.get('/', async (req, res) => {
    try
    {
        const user = req.user;

        res.status(200).json({
            data : await getStock(user)
        });
    } 
    catch (e)
    {
        res.status(500).json({
            "error": e.message,
            "ok": false 
        });
    }
});

router.post('/', async (req, res) => {
    try
    {
        const {cat, atr} = req.body;
        const user = req.user;
        
        res.status(200).json({
            data : await setStock(user, cat, atr)
        });
    }
    catch (e)
    {
        res.status(500).json({
            "error": e.message,
            "ok": false 
        });
    }
});

router.delete('/', async(req, res) =>{
    try
    {
        const { id } = req.body;
        const user = req.user;

        res.status(200).json({
            data : await deleteById(user, id)
        });
    }
    catch (e)
    {
        res.status(500).json({
            "error": e.message,
            "ok": false
        });
    }
});

router.put('/', async(req, res) => {
    try
    {
        const { id, cat, atr} = req.body;
        const user = req.user;

        res.status(200).json({
            data : await updateById(user, id, cat, atr)
        });
    }
    catch (e)
    {
        res.status(500).json({
            "error": e.message,
            "ok": false
        });
    }
});

export { router as estoqueRouter };