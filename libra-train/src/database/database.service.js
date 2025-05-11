import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

class DatabaseService {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) return this.db;
    
    try {
      this.client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 40000
      });

      await this.client.connect();
      this.db = this.client.db(process.env.VUE_APP_DB_NAME);
      this.isConnected = true;
      console.log('✅ MongoDB connected');
      return this.db;
    } catch (error) {
      console.error('❌ Connection error:', error);
      throw error;
    }
  }

  async getCollection(collectionName) {
    await this.connect();
    return this.db.collection(collectionName);
  }

  async find(collectionName, query = {}, options = {}) {
    const {
      projection = {},
      sort = {},
      limit = 0,
      populate = [] // массив полей для "популяции"
    } = options;
  
    try {
      const collection = await this.getCollection(collectionName);
  
      // Если есть populate — используем aggregate
      if (populate.length > 0) {
        const pipeline = [
          { $match: query },
          ...populate.map(field => ({
            $lookup: {
              from: field.from,
              localField: field.localField,
              foreignField: field.foreignField,
              as: field.as
            }
          })),
          ...(Object.keys(sort).length > 0 ? [{ $sort: sort }] : []), // ← исправление
          ...(limit > 0 ? [{ $limit: limit }] : []),
          ...(Object.keys(projection).length > 0 ? [{ $project: projection }] : [])
        ];
  
        const result = await collection.aggregate(pipeline).toArray();
        return result;
      }
  
      // Если populate не указан — обычный find
      return await collection.find(query)
        .project(projection)
        .sort(sort)
        .limit(limit)
        .toArray();
  
    } catch (error) {
      console.error('Find error:', error);
      throw error;
    }
  }

  async insert(collectionName, data) {
    try {
      const collection = await this.getCollection(collectionName);
      const result = await collection.insertOne(data);
      return { ...data, _id: result.insertedId };
    } catch (error) {
      console.error('Insert error:', error);
      throw error;
    }
  }

  async update(collectionName, filter, update, options = {}) {
    try {
      const collection = await this.getCollection(collectionName);
      const result = await collection.updateOne(filter, { $set: update }, options);
      return result.modifiedCount;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }

  async delete(collectionName, filter) {
    try {
      const collection = await this.getCollection(collectionName);
      const result = await collection.deleteOne(filter);
      return result.deletedCount;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      console.log('MongoDB connection closed');
    }
  }

  async findOne(collectionName, query={}, options = {}) {
    const {
      projection = {},
      sort = {},
      limit = 0,
      populate = []
    } = options;
    try {
      const collection = await this.getCollection(collectionName);

      if (typeof query === 'string') {
        query = { _id: new ObjectId(query) };
      }

      if (populate.length > 0) {
        const pipeline = [
          { $match: query },
          ...populate.map(field => ({
            $lookup: {
              from: field.from,
              localField: field.localField,
              foreignField: field.foreignField,
              as: field.as
            }
          })),
          ...(Object.keys(sort).length ? [{ $sort: sort }] : []),        // ✅ добавлять $sort только если есть ключи
          ...(limit > 0 ? [{ $limit: limit }] : []),
          ...(Object.keys(projection).length ? [{ $project: projection }] : [])
        ];
  
        const result = await collection.aggregate(pipeline).toArray();
        return result[0] || null;
      }
      
      return await collection.findOne(query);
    } catch (error) {
      console.error('FindOne error:', error);
      throw error;
    }
  }
}


export const dbService = new DatabaseService();