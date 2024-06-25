import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUser } from '../user.js';

function generateToken(user) {
    const payload = { 
        user: user.name 
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '6h' });

    return token;
}

export async function login(req, res) {
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
};

export function authenticateToken(req, res, next) {
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