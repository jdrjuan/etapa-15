import {promises as fs} from 'fs';
import path from 'path';

class ProductModelFS {

    productsFileName = 'products.json';
    filePath = path.join(process.cwd(), 'models', this.productsFileName);
    charset = 'utf-8';

    getProductsArrayFromFile = async () => {
        let products = [];
        try {
            const fileContent = await fs.readFile(this.filePath, this.charset);
            const parsedContent = JSON.parse(fileContent);
            if (!Array.isArray(parsedContent)) {
                throw new Error('El archivo JSON no contiene un array');
            }
            products = parsedContent;
        } catch (error) {
            console.error(`Se produjo un error al leer el archivo: ${error.message}`);
        }
        return products;
    };

    saveProductsArrayToFile = async products => {
        try {
            // const serializedProducts = JSON.stringify(products, null, '\t');
            const serializedProducts = JSON.stringify(products);
            await fs.writeFile(this.filePath, serializedProducts);        
        } catch (error) {
            console.error(`Se produjo un error al escribir el archivo: ${error.message}`);
            return false;
        }
        return true;
    };

    getNextId = products => {
        const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
        return (maxId + 1).toString();
    };

    //- CRUD - C: Create -------------------------------------------------------------------------------------------------------------------------o//
    //- Crea un producto nuevo. Todos los productos usan un campo `id` (string) que se genera internamente.                                       -o//
    createProduct = async product => {
        const products = await this.getProductsArrayFromFile();

        // Asignar un nuevo ID (string) al producto.
        product.id = this.getNextId(products);
        console.log(product.id);
        products.push(product);
        const writeOk = await this.saveProductsArrayToFile(products);
        if (!writeOk) {
            return null;
        }
        return product;
    };


    //- CRUD - R: Read ---------------------------------------------------------------------------------------------------------------------------o//
    //- Obtiene todos los productos. Cada producto devuelto incluye su campo `id`.                                                                  -o//
    getAllProducts = async () => {
        const products = await this.getProductsArrayFromFile();
        return products;
    };

    //- Obtiene un producto por su `id`. El producto devuelto incluye su campo `id`.                                                                -o//
    getProductById = async id => {
        const products = await this.getProductsArrayFromFile();
        // Se busca el producto por su `id` (string).
        return products.find(p => p.id === id) ?? null;
    };


    //- CRUD - U: Update -------------------------------------------------------------------------------------------------------------------------o//
    //- Actualiza un producto existente por su `id`. El producto actualizado devuelto incluye su `id`.                                               -o//
    updateProduct = async (id, product) => {
        const products = await this.getProductsArrayFromFile();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            return null;
        }
        // Combinar el producto existente con los campos del producto actualizado.
        // Esto asegura que los campos no proporcionados en el payload de 'product' (actualización parcial)
        // se mantengan del producto original. El 'id' se toma del parámetro para asegurar que no cambie.
        const existingProduct = products[index];
        const updatedProduct = {...existingProduct, ...product, id: existingProduct.id }; // Asegurar que el id no cambie por el payload
        products[index] = updatedProduct;
        const writeOk = await this.saveProductsArrayToFile(products);
        if (!writeOk) {
            return null;
        }
        return updatedProduct;
    };

    //- Actualiza parcialmente un producto existente por su `id`. El producto actualizado devuelto incluye su `id`.                                  -o//
    updateProductPartial = async (id, partialProduct) => {
        const products = await this.getProductsArrayFromFile();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            return null;
        }
        // Asegurar que el ID original se mantenga y se apliquen las propiedades parciales.
        const updatedProduct = {...products[index], ...partialProduct, id};
        products[index] = updatedProduct;
        const writeOk = await this.saveProductsArrayToFile(products);
        if (!writeOk) {
            return null;
        }
        return updatedProduct;
    };

    //- CRUD - D: Delete -------------------------------------------------------------------------------------------------------------------------o//
    //- Elimina un producto por su `id`. El producto eliminado devuelto incluye su `id`.                                                             -o//
    deleteProduct = async id => {
        const products = await this.getProductsArrayFromFile();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            return null;
        }
        const deletedProduct = products.splice(index, 1)[0];
        const writeOk = await this.saveProductsArrayToFile(products);
        if (!writeOk) {
            return null;
        }
        return deletedProduct;
    };
}

export default ProductModelFS;
