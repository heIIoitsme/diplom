import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

// Глобальные переменные для кеширования соединения
let client;
let clientPromise;

class DatabaseService {
  constructor() {
    this.db = null;
  }

  // Устанавливаем соединение и кешируем клиент
  async connect() {
    if (!clientPromise) {
      // Инициализируем MongoClient один раз
      client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 40000,
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      clientPromise = client.connect();
    }
    // Ждем подключения
    const connectedClient = await clientPromise;
    // Сохраняем объект базы
    this.db = connectedClient.db(process.env.MONGODB_DB_NAME);
    console.log('✅ MongoDB connected');
    return this.db;
  }

  async getCollection(collectionName) {
    await this.connect();
    return this.db.collection(collectionName);
  }

  async find(collectionName, query = {}, options = {}) {
    const { projection = {}, sort = {}, limit = 0, populate = [] } = options;
    const collection = await this.getCollection(collectionName);

    if (populate.length > 0) {
      const pipeline = [
        { $match: query },
        ...populate.map(field => ({
          $lookup: {
            from: field.from,
            localField: field.localField,
            foreignField: field.foreignField,
            as: field.as,
          }
        })),
        ...(Object.keys(sort).length ? [{ $sort: sort }] : []),
        ...(limit ? [{ $limit: limit }] : []),
        ...(Object.keys(projection).length ? [{ $project: projection }] : []),
      ];
      return await collection.aggregate(pipeline).toArray();
    }

    return await collection.find(query)
      .project(projection)
      .sort(sort)
      .limit(limit)
      .toArray();
  }

  async findOne(collectionName, query = {}, options = {}) {
    const { projection = {}, sort = {}, limit = 0, populate = [] } = options;
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
            as: field.as,
          }
        })),
        ...(Object.keys(sort).length ? [{ $sort: sort }] : []),
        ...(limit ? [{ $limit: limit }] : []),
        ...(Object.keys(projection).length ? [{ $project: projection }] : []),
      ];
      const results = await collection.aggregate(pipeline).toArray();
      return results[0] || null;
    }

    return await collection.findOne(query, { projection });
  }

  async insert(collectionName, data) {
    const collection = await this.getCollection(collectionName);
    const result = await collection.insertOne(data);
    return { ...data, _id: result.insertedId };
  }

  async update(collectionName, filter, update, options = {}) {
    const collection = await this.getCollection(collectionName);
    const result = await collection.updateOne(filter, { $set: update }, options);
    return result.modifiedCount;
  }

  async delete(collectionName, filter) {
    const collection = await this.getCollection(collectionName);
    const result = await collection.deleteOne(filter);
    return result.deletedCount;
  }

  async disconnect() {
    if (client) {
      await client.close();
      clientPromise = null;
      console.log('MongoDB connection closed');
    }
  }
}

export const dbService = new DatabaseService();