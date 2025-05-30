const products = [];

class ProductModelMemory {

    getNextId = () => {
        const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
        return (maxId + 1).toString();
    };

    getAllProducts = () => products;

    getProductById = id => products.find(p => p.id === id) ?? null;

    createProduct = product => {
        product.id = this.getNextId();
        products.push(product);
        return product
    };

    updateProduct = (id, product) => {
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            return null;
        }
        const updatedProduct = {...product, id}
        products[index] = updatedProduct;
        return updatedProduct;
    };

    updateProductPartial = (id, partialProduct) => {
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            return null;
        }
        const updatedProduct = {...products[index], ...partialProduct, id};
        products[index] = updatedProduct;
        return updatedProduct;
    };

    deleteProduct = id => {
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            return null;
        }
        const deletedProduct = products.splice(index, 1)[0];
        return deletedProduct;
    };    
}

export default ProductModelMemory;
