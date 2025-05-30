const products = [];

class ProductModelMemory {

    getNextId = () => {
        const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
        return (maxId + 1).toString();
    };

    //- CRUD - C: Create -------------------------------------------------------------------------------------------------------------------------o//
    //- Crea un producto nuevo en memoria. Todos los productos usan un campo `id` (string) que se genera internamente.                             -o//
    createProduct = product => {
        // Asignar un nuevo ID (string) al producto.
        product.id = this.getNextId();
        products.push(product);
        return product
    };

    //- CRUD - R: Read ---------------------------------------------------------------------------------------------------------------------------o//
    //- Obtiene todos los productos de la memoria. Cada producto devuelto incluye su campo `id`.                                                    -o//
    getAllProducts = () => products;

    //- Obtiene un producto de la memoria por su `id`. El producto devuelto incluye su campo `id`.                                                  -o//
    getProductById = id => {
        // Se busca el producto por su `id` (string).
        return products.find(p => p.id === id) ?? null;
    };

    //- CRUD - U: Update -------------------------------------------------------------------------------------------------------------------------o//
    //- Actualiza un producto existente en memoria por su `id`. El producto actualizado devuelto incluye su `id`.                                    -o//
    updateProduct = (id, product) => {
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            return null;
        }
        // Asegurar que el ID original se mantenga en el objeto actualizado.
        const updatedProduct = {...product, id}
        products[index] = updatedProduct;
        return updatedProduct;
    };

    //- Actualiza parcialmente un producto existente en memoria por su `id`. El producto actualizado devuelto incluye su `id`.                       -o//
    updateProductPartial = (id, partialProduct) => {
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            return null;
        }
        // Asegurar que el ID original se mantenga y se apliquen las propiedades parciales.
        const updatedProduct = {...products[index], ...partialProduct, id};
        products[index] = updatedProduct;
        return updatedProduct;
    };

    //- CRUD - D: Delete -------------------------------------------------------------------------------------------------------------------------o//
    //- Elimina un producto de la memoria por su `id`. El producto eliminado devuelto incluye su `id`.                                               -o//
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
