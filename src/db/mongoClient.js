import { MongoClient } from 'mongodb';
import { logger } from '../index.js';

export async function getClient() {
    const url = process.env.DB_URL;
    if (!url) throw new Error('DB credentials not found');

    let mongoClient;
    try {
        mongoClient = new MongoClient(url);
        await mongoClient.connect();

        return mongoClient;
    } catch (e) {
        logger.fatal('Connection to MongoDB failed: ' + e.message);
        process.exit(1);
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
