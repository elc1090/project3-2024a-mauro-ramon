import { Router } from 'express';
import { createUser, getUsers, findUser } from '../lib/user.js';

const router = Router();

router.post('/', async (req, res) => {
    try
    {
        const { name, key } = req.body;
        
        if ( await findUser(name) )
        {
            res.status(409).json({
                error : 'Username already taken'
            })
        }
        else
        {
            res.status(200).json({
                data : await createUser(name, key)
            })
        }
    }
    catch (e)
    {
        res.status(500).json({
            "error": e.message,
            "ok": false 
        })
    }
});

router.get('/', async (req, res) => {
    try
    {            
        res.status(200).json({
            data : await getUsers()
        })
    }
    catch (e)
    {
        res.status(500).json({
            "error": e.message,
            "ok": false 
        })
    }
});

export { router as userRouter };
