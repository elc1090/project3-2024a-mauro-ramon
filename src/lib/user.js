import bcrypt from 'bcryptjs';

import { getClient } from "../db/mongoClient.js";
import { logger } from '../index.js';

export async function findUser(name) {
    let mongoClient;
 
    try {
        mongoClient = await getClient();
        const db = mongoClient.db('stock');
        const collection = db.collection('user');

        return await collection.findOne({ name });
    } catch (e) {
        logger.error(e.message);
        throw e;
    } finally {
        await mongoClient.close();
    } 
}

export async function createUser(name, key) {
    let mongoClient;
 
    try {
        mongoClient = await getClient();
        const db = mongoClient.db('stock');
        const collection = db.collection('user');

        const hash = await bcrypt.hash(key, 10);
        return await collection.insertOne({ name, key: hash });
    } catch (e) {
        logger.error(e.message);
        throw e;
    } finally {
        await mongoClient.close();
    } 
}

export async function getAllUsers() {
    let mongoClient;
 
    try {
        mongoClient = await getClient();
        const db = mongoClient.db('stock');
        const collection = db.collection('user');

        return await collection.find({}).toArray();
    } catch (e) {
        logger.error(e.message);
        throw e;
    } finally {
        await mongoClient.close();
    } 
}