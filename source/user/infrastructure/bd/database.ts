import mongoose from 'mongoose';
import { config as dotenvConfig } from 'dotenv';


// Cargar variables de entorno
dotenvConfig();

interface DatabaseConfig {
  uri: string;
  options: {
    serverSelectionTimeoutMS: number;
    maxPoolSize: number;
  }
}

const dbConfig: DatabaseConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/post',
  options: {
    serverSelectionTimeoutMS: parseInt(process.env.MONGODB_TIMEOUT_MS || '5000', 10),
    maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10', 10)
  }
};

const handleConnection = (): void => {
  mongoose.connection.on('error', (err: Error) => 
    console.error(`Error en MongoDB: ${err.message}`)
  );
  
  mongoose.connection.on('disconnected', () => 
    console.warn('Desconectado de MongoDB')
  );
  
  process.on('SIGINT', () => {
    mongoose.connection.close().then(() => {
      console.log('Conexión a MongoDB cerrada');
      process.exit(0);
    });
  });
};

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(dbConfig.uri, dbConfig.options);
    console.log(`✅ Conectado a MongoDB: ${dbConfig.uri}`);
    handleConnection();
  } catch (error) {
    console.error(`❌ Error al conectar con MongoDB: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    process.exit(1);
  }
};

export { connectDB };
