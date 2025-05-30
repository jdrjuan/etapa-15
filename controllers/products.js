import api from '../api/products.js';

////////////////////////////////////////////////////////////////////////////////
//                               GET Controller                               //
////////////////////////////////////////////////////////////////////////////////`

const getAllProducts = async (req, res) => {
    const products = await api.getAllProducts();
    if (!products) {
        return res.status(404).json({ success: false, message: 'Productos no encontrados', data: [] });
    }
    res.json({ success: true, message: 'OK', data: products });
};

const getProductById = async (req, res) => {
    const {id} = req.params;
    const product = await api.getProductById(id);
    if (!product) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado', data: null });
    }
    res.json({ success: true, message: 'OK', data: product });
};


///////////////////////////////////////////////////////////////////////////////
//                             CREATE Controller                             //
///////////////////////////////////////////////////////////////////////////////

const createProduct = async (req, res) => {
    const product = req.body;
    const createdProduct = await api.createProduct(product);
    res.status(201).json({ success: true, message: 'Producto creado con éxito', data: createdProduct });
};


////////////////////////////////////////////////////////////////////////////////
//                             UPDATE Controller                              //
////////////////////////////////////////////////////////////////////////////////

const updateProduct = async (req, res) => {
    const {id} = req.params;
    const product = req.body;
    const updatedProduct = await api.updateProduct(id, product);
    if (!updatedProduct) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado', data: null });
    }
    res.json({ success: true, message: 'Producto modificado con éxito', data: updatedProduct });
};


////////////////////////////////////////////////////////////////////////////////
//                         PARTIAL UPDATE Controller                          //
////////////////////////////////////////////////////////////////////////////////

const updateProductPartial = async (req, res) => {
    const {id} = req.params;
    const partialProduct = req.body;
    const updatedProduct = await api.updateProductPartial(id, partialProduct);
    if (!updatedProduct) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado', data: null });
    }
    res.json({ success: true, message: 'Producto modificado con éxito', data: updatedProduct });
};


////////////////////////////////////////////////////////////////////////////////
//                               DELETE Controller                            //
////////////////////////////////////////////////////////////////////////////////

const deleteProduct = async (req, res) => {
    const {id} = req.params;
    const deletedProduct = await api.deleteProduct(id);
    if (!deletedProduct) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado', data: null });
    }
    res.json({ success: true, message: 'Producto eliminado con éxito', data: deletedProduct });
};


export default {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    updateProductPartial,
    deleteProduct
};
