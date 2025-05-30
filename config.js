import 'dotenv/config'; // Carga variables de entorno desde un archivo .env si existe.

// Objeto de configuración principal para la aplicación.
const config = {
    // Puerto en el que escuchará el servidor.
    // Se lee desde la variable de entorno PORT; si no está definida, usa 3000 por defecto.
    PORT: process.env.PORT || 3000,

    // El tipo de persistencia a utilizar (ej: MONGODB, FS, MEM).
    // Se lee desde la variable de entorno PERSISTENCE_TYPE; si no está definida, usa 'MONGODB' por defecto.
    PERSISTENCE_TYPE: process.env.PERSISTENCE_TYPE || 'MONGODB',

    // Tiempo de espera para las operaciones de MongoDB (en milisegundos).
    // Se lee desde la variable de entorno MONGODB_TIMEOUT; si no está definida, usa 2000ms por defecto.
    MONGODB_TIMEOUT: process.env.MONGODB_TIMEOUT || 2000,

    // URL de conexión a MongoDB.
    // Se lee desde la variable de entorno MONGODB_CONNECTION_STRING; si no está definida, usa una URL local por defecto.
    // Es recomendable usar '127.0.0.1' en lugar de 'localhost' para evitar posibles problemas de resolución de DNS.
    MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/ecommerce',
};

export default config;
