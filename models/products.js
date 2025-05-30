import ProductModelMem from './productsMem.js';
import ProductModelFS from './productsFS.js';
import ProductModelMongoDB from './productsMongoDB.js';
import MongoDBClient from '../db/MongoDBClient.js';

class ProductModel {
    static async get (type) {
        console.log(`########## Persistence Type: ${type} ##########`);
        switch (type) {
            case 'MEM':
                return new ProductModelMem();
            case 'FS':
                return new ProductModelFS();
            case 'MONGODB':
                if (!await MongoDBClient.connectDB()) {
                    console.error('No se pudo conectar a la base de datos. El servidor no se iniciará.');
                    process.exit(1);
                }
                
                return new ProductModelMongoDB();
            default:
                throw new Error(`Persistence type "${type}" inválido.`);
        }
    }
}

export default ProductModel;
