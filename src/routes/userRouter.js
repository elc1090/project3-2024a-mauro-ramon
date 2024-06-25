import { Router } from 'express';
import { createUser, findAll } from '../lib/user.js';

const router = Router();

router.post('/', async (req, res) => {
    
    try {
        const { name, key } = req.body;
        
        const result = await createUser(name, key);
    
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

router.get('/', async (req, res) => {
    
    try {        
        const result = await findAll();
    
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

export { router as userRouter };
