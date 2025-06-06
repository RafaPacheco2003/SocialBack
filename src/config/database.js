const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    // URI de conexión por defecto basada en tu imagen
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/post';
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });

    logger.info(`✅ Conectado a MongoDB: ${mongoUri}`);
    
    // Verificamos si la colección 'user' existe
    const collections = await mongoose.connection.db.listCollections().toArray();
    const userCollectionExists = collections.some(col => col.name === 'users');
    
    if (!userCollectionExists) {
      logger.warn('La colección "users" no existe en la base de datos');
    }

    mongoose.connection.on('error', (err) => {
      logger.error(`Error de conexión a MongoDB: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Desconectado de MongoDB');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Conexión a MongoDB cerrada por terminación de la aplicación');
      process.exit(0);
    });

  } catch (error) {
    logger.error(`❌ Error al conectar con MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB };