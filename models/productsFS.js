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

    ////////////////////////////////////////////////////////////////////////////////
    //                              CRUD - C: Create                              //
    ////////////////////////////////////////////////////////////////////////////////

    createProduct = async product => {
        const products = await this.getProductsArrayFromFile();

        product.id = this.getNextId(products);
        console.log(product.id);
        products.push(product);
        const writeOk = await this.saveProductsArrayToFile(products);
        if (!writeOk) {
            return null;
        }
        return product;
    };


    ////////////////////////////////////////////////////////////////////////////////
    //                               CRUD - R: Read                               //
    ////////////////////////////////////////////////////////////////////////////////

    getAllProducts = async () => {
        const products = await this.getProductsArrayFromFile();
        return products;
    };

    getProductById = async id => {
        const products = await this.getProductsArrayFromFile();
        return products.find(p => p.id === id) ?? null;
    };


    ////////////////////////////////////////////////////////////////////////////////
    //                              CRUD - U: Update                              //
    ////////////////////////////////////////////////////////////////////////////////

    updateProduct = async (id, product) => {
        const products = await this.getProductsArrayFromFile();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            return null;
        }
        const updatedProduct = {...product, id}
        products[index] = updatedProduct;
        const writeOk = await this.saveProductsArrayToFile(products);
        if (!writeOk) {
            return null;
        }
        return updatedProduct;
    };

    updateProductPartial = async (id, partialProduct) => {
        const products = await this.getProductsArrayFromFile();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            return null;
        }
        const updatedProduct = {...products[index], ...partialProduct, id};
        products[index] = updatedProduct;
        const writeOk = await this.saveProductsArrayToFile(products);
        if (!writeOk) {
            return null;
        }
        return updatedProduct;
    };

    ////////////////////////////////////////////////////////////////////////////////
    //                              CRUD - D: Delete                              //
    ////////////////////////////////////////////////////////////////////////////////

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
