import { MongoClient, ObjectId } from 'mongodb';

import { logger } from '../index.js';

async function getClient() {
    const url = process.env.DB_URL;
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

export async function setStock(cat, atr) {
    let mongoClient;
 
    try {
        mongoClient = await getClient();
        const db = mongoClient.db('stock');
        const collection = db.collection('stock');

        const item = {
            cat : cat,
            atr : atr 
        };
     
        const insertResult = await collection.insertOne(item);

        return insertResult;
    } catch (e) {
        logger.error(e.message);
    } finally {
        await mongoClient.close();
    }
}

export async function getStock(cat) {
    let mongoClient;
 
    try {
        mongoClient = await getClient();
        const db = mongoClient.db('stock');
        const collection = db.collection('stock');
        
        // Filtro para a categoria, se fornecida
        const query = cat ? { cat: cat } : {};
                
        return await collection.find(query).toArray();
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

export async function deleteById(id) {
    let mongoClient;
 
    try {
        mongoClient = await getClient();
        const db = mongoClient.db('stock');
        const collection = db.collection('stock');

        return await collection.deleteOne({ _id: ObjectId.createFromHexString(id) });
    } catch (e) {
        logger.error(e.message);
    } finally {
        await mongoClient.close();
    }
}

export async function updateById(id, cat, atr) {
    let mongoClient;
 
    try {
        mongoClient = await getClient();
        const db = mongoClient.db('stock');
        const collection = db.collection('stock');

        const update = { $set: {} };

        if (cat) update.$set.cat = cat;
        if (atr) update.$set.atr = atr;

        return await collection.updateOne({ _id: ObjectId.createFromHexString(id) }, update);
    } catch (e) {
        logger.error(e.message);
    } finally {
        await mongoClient.close();
    }
}