import { MongoClient } from 'mongodb';

import { logger } from '../index.js';

async function getClient() {
    const url = process.env.DB_URL;
    let mongoClient;

    try {
        mongoClient = new MongoClient(url);
        await mongoClient.connect();

        return mongoClient;
    } catch (error) {
        logger.fatal('Connection to MongoDB failed: ' + e.message);
        process.exit(1);
    }
}

export async function setStock(prod, qtd, marca) {
    let mongoClient;
 
    try {
        mongoClient = await getClient();
        const db = mongoClient.db('stock');
        const collection = db.collection('stock');

        const item = {
            prod: prod,
            qtd: qtd,
            marca: marca
        };
     
        const insertResult = await collection.insertOne(item);

        return insertResult;
    } catch (e) {
        logger.error(e.message);
    } finally {
        await mongoClient.close();
    }
}

export async function getStock() {
    let mongoClient;
 
    try {
        mongoClient = await getClient();
        const db = mongoClient.db('stock');
        const collection = db.collection('stock');

        return await collection.find({}).toArray();
    } catch (e) {
        logger.error(e.message);
    } finally {
        await mongoClient.close();
    }
}

export async function dropDatabase() {
    let mongoClient;
 
    try {
        mongoClient = await getClient();
        const db = mongoClient.db('stock');

        return await db.dropDatabase();
    } catch (e) {
        logger.error(e.message);
    } finally {
        await mongoClient.close();
    }
}