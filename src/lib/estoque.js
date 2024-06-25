import { getClient } from '../db/mongoClient.js';
import { getValidId } from '../lib/utils.js';
import { logger } from '../index.js';

export async function setStock(user, cat, atr) {
    let mongoClient;
 
    try {
        mongoClient = await getClient();
        const db = mongoClient.db('stock');
        const collection = db.collection('stock');

        const item = {
            cat : cat,
            atr : atr 
        };

        let insertResult
        const userRes = await collection.findOne({ user });

        if (userRes && userRes.items)
        {
            item.id = getValidId(userRes.items);
            insertResult = await collection.updateOne({ user }, { $push: { items: item } });
        }
        else
        {
            item.id = 0;
            insertResult = await collection.insertOne({ user, items: [item] });
        }
     
        return insertResult;
    } catch (e) {
        logger.error(e.message);
    } finally {
        await mongoClient.close();
    }
}

export async function getStock(user) {
    let mongoClient;
 
    try {
        mongoClient = await getClient();
        const db = mongoClient.db('stock');
        const collection = db.collection('stock');
        
        const query = { user };        
        return await collection.find(query).toArray();
    } catch (e) {
        logger.error(e.message);
    } finally {
        await mongoClient.close();
    }
}

export async function deleteById(user, id) {
    let mongoClient;
 
    try {
        mongoClient = await getClient();
        const db = mongoClient.db('stock');
        const collection = db.collection('stock');

        return await collection.updateOne({ user }, { $pull: { items: { id: id } } });
    } catch (e) {
        logger.error(e.message);
    } finally {
        await mongoClient.close();
    }
}

export async function updateById(user, id, cat, atr) {
    let mongoClient;
 
    try {
        mongoClient = await getClient();
        const db = mongoClient.db('stock');
        const collection = db.collection('stock');

        const newItem = {id : + id};
        if (cat) newItem.cat = cat;
        if (atr) newItem.atr = atr;

        const userRes = await collection.findOne({ user });

        if (userRes && userRes.items)
        {
            const update = userRes.items.map(item => 
                + item.id === + id ? { ...item, ...newItem } : item
            );
            
            return await collection.updateOne({ user }, { $set: { items: update } });
        }
        else
        {
            return "user not found or has no items.";
        }
    } catch (e) {
        logger.error(e.message);
    } finally {
        await mongoClient.close();
    }
}
