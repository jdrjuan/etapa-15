// import Model from '../models/productsMem.js';
// import Model from '../models/productsFS.js';
// import Model from '../models/productsMongoDB.js';
import Model from '../models/products.js';
import config from '../config.js';

// const model = await Model.get('MEM');
// const model = await Model.get('FS');
// const model = await Model.get('MONGODB');
const model = await Model.get(config.PERSISTENCE_TYPE);

///////////////////////////////////////////////////////////////////////////////
//                                API Get All                                //
///////////////////////////////////////////////////////////////////////////////

// Obtiene todos los productos.
// La capa del modelo subyacente es responsable de devolver objetos producto que incluyen un campo `id`.
const getAllProducts = async () => {
    const products = await model.getAllProducts();
    return products;
};


///////////////////////////////////////////////////////////////////////////////
//                                API Get One                                //
///////////////////////////////////////////////////////////////////////////////

// Obtiene un producto por su ID.
// Se pasa el `id` (string) a la capa del modelo.
// La capa del modelo es responsable de devolver un objeto producto que incluye el campo `id`.
const getProductById = async id => {
    const product = await model.getProductById(id);
    return product;
};


///////////////////////////////////////////////////////////////////////////////
//                                API Create                                 //
///////////////////////////////////////////////////////////////////////////////

// Crea un nuevo producto.
// La capa del modelo es responsable de generar y asignar el `id`, y devolver el producto creado con su `id`.
const createProduct = async product => {
    const createdProduct = await model.createProduct(product);
    return createdProduct;
};


///////////////////////////////////////////////////////////////////////////////
//                                API Update                                 //
///////////////////////////////////////////////////////////////////////////////

// Actualiza un producto existente por su ID.
// Se pasa el `id` (string) y los datos del producto a la capa del modelo.
// La capa del modelo es responsable de devolver el producto actualizado con su `id`.
const updateProduct = async (id, product) => {
    const updatedProduct = await model.updateProduct(id, product);
    return updatedProduct
};


///////////////////////////////////////////////////////////////////////////////
//                                API Partial Update                         //
///////////////////////////////////////////////////////////////////////////////

// Actualiza parcialmente un producto existente por su ID.
// Se pasa el `id` (string) y los datos parciales del producto a la capa del modelo.
// La capa del modelo es responsable de devolver el producto actualizado con su `id`.
const updateProductPartial = async (id, partialProduct) => {
    const updatedProduct = await model.updateProductPartial(id, partialProduct);
    return updatedProduct;
};


///////////////////////////////////////////////////////////////////////////////
//                                API Delete                                 //
///////////////////////////////////////////////////////////////////////////////

// Elimina un producto por su ID.
// Se pasa el `id` (string) a la capa del modelo.
// La capa del modelo es responsable de devolver el producto eliminado con su `id`.
const deleteProduct = async id => {
    const deletedProduct = await model.deleteProduct(id);
    return deletedProduct;
};


export default {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    updateProductPartial,
    deleteProduct
};
