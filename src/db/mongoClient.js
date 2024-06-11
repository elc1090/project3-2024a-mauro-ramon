import { MongoClient } from 'mongodb';

import { logger } from '../index.js';

async function getClient() {
    const url = process.env.DB_URL;
    let mongoClient;

    try {
        mongoClient = new MongoClient(url);
        logger.info('Connecting to MongoDB...');
        await mongoClient.connect();
        logger.info('Successfully connected to MongoDB!');

        return mongoClient;
    } catch (error) {
        logger.fatal('Connection to MongoDB failed: ' + error);
        process.exit(1);
    }
}

export async function setStock(tipo, nome, qtd) {
    let mongoClient;
 
    try {
        mongoClient = await getClient();
        const db = mongoClient.db('stock');
        const collection = db.collection(tipo);

        const item = {
            name: nome,
            qty: qtd
        };
     
        await collection.insertOne(item);
    } catch (e) {
        logger.error(e);
    } finally {
        await mongoClient.close();
    }
}

export async function getStock(tipo, nome) {
    let mongoClient;
 
    try {
        mongoClient = await getClient();
        const db = mongoClient.db('stock');
        const collection = db.collection(tipo);

        return collection.find({ nome }).toArray();
    } catch (e) {
        logger.error(e);
    } finally {
        await mongoClient.close();
    }
}