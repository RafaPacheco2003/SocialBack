import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { config as dotenvConfig } from 'dotenv';
import userRoute from './infrastructure/route/UserRoute';
import { connectDB } from './infrastructure/bd/database';
import { handleExceptions } from './infrastructure/middleware/exception-handler.middleware';

// Configurar variables de entorno
dotenvConfig();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// Routes
app.use('/api/users', userRoute);

// Middleware de manejo de errores (debe ir después de las rutas)
app.use(handleExceptions);

// Database connection and server initialization
const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Iniciar el servidor
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar el servidor
startServer();
