import mongoose from 'mongoose';
import config from '../config.js';

class MongoDBClient {
    static connectDB = async () => {
        
        const READY_STATE_DISCONNECTED = 0;
        const READY_STATE_CONNECTED = 1;
        const READY_STATE_CONNECTING = 2;
        const READY_STATE_DISCONNECTING = 3;
        
        if (mongoose.connection.readyState === READY_STATE_CONNECTED) {
            console.warn('Conexión con MongoDB establecida anteriormente');
            return true;
        }

        try {
            await mongoose.connect(config.MONGODB_CONNECTION_STRING, {
                serverSelectionTimeoutMS: config.MONGODB_TIMEOUT,
            });
            console.log('✅ Conexión con MongoDB exitosa');
            return true;
        } catch (error) {
            console.error(`Error al conectar con MongoDB: ${error.message || 'Error desconocido'}`);
            return false;
        }
    };
}

export default MongoDBClient;
