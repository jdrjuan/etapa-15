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

const getAllProducts = async () => {
    const products = await model.getAllProducts();
    return products;
};


///////////////////////////////////////////////////////////////////////////////
//                                API Get One                                //
///////////////////////////////////////////////////////////////////////////////

const getProductById = async id => {
    const product = await model.getProductById(id);
    return product;
};


///////////////////////////////////////////////////////////////////////////////
//                                API Create                                 //
///////////////////////////////////////////////////////////////////////////////

const createProduct = async product => {
    const createdProduct = await model.createProduct(product);
    return createdProduct;
};


///////////////////////////////////////////////////////////////////////////////
//                                API Update                                 //
///////////////////////////////////////////////////////////////////////////////

const updateProduct = async (id, product) => {
    const updatedProduct = await model.updateProduct(id, product);
    return updatedProduct
};


///////////////////////////////////////////////////////////////////////////////
//                                API Partial Update                         //
///////////////////////////////////////////////////////////////////////////////

const updateProductPartial = async (id, partialProduct) => {
    const updatedProduct = await model.updateProductPartial(id, partialProduct);
    return updatedProduct;
};


///////////////////////////////////////////////////////////////////////////////
//                                API Delete                                 //
///////////////////////////////////////////////////////////////////////////////

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
