import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { findUser } from '../lib/user.js';
import { logger } from '../index.js';

function generateToken(user) {
    try
    {
        const payload = { 
            user: user.name 
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '6h' });
    
        return token;
    } 
    catch (e)
    {
        logger.error(e.message);
        throw e;
    }
}

export async function login(req, res) {
    try
    {
        const { name, key } = req.body;
        
        // busca pelo usuário no banco
        const userRes = await findUser(name);
        if (!userRes)
        {
            return res.status(401).json({ error: 'User does not exist' });
        }
            
        // check password
        const pass = await bcrypt.compare(key, userRes.key);
        if (!pass)
        {
            return res.status(401).json({ error: 'Invalid password' });
        }
        
        res.status(200).json({
            token : generateToken(userRes)
        });
    }
    catch (e) 
    {
        logger.error(e.message);

        res.status(500).json({
            error : e.message,
            ok : false
        });
    }
};

export function authenticateToken(req, res, next) {
    try
    {
        const token = req.headers['authorization'];
        
        if (!token)
        {
            return res.status(401).json({ error: 'Token not found'});
        }
            
        jwt.verify(token.split(' ')[1], process.env.SECRET_KEY, (err, payload) => {
            if (err)
                return res.status(403).json({ error: 'Token invalid'});
            else req.user = payload.user;
            
            next();
        });
    }
    catch (e)
    {
        logger.error(e.message);
        
        return res.status(500).json({
            error : e.message,
            ok : false
        });
    }
}