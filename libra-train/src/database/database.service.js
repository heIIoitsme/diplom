import { MongoClient } from 'mongodb';

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
        serverSelectionTimeoutMS: 5000
      });

      await this.client.connect();
      this.db = this.client.db(process.env.DB_NAME);
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

  async find(collectionName, query = {}, projection = {}, sort = {}, limit = 0) {
    try {
      const collection = await this.getCollection(collectionName);
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
}

export const dbService = new DatabaseService();