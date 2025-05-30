import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema({
    "name": String,
    "price": Number,
    "stock": Number,
    "brand": String,
    "category": String,
    "shortDescription": String,
    "longDescription": String,
    "freeShipping": Boolean,
    "mainPhoto": String
}, {
    versionKey: false,
    toJSON: { 
        // Opciones para cuando el documento se convierte a JSON (ej. al enviar en respuestas res.json()).
        // Estas opciones ayudan a preparar el documento para que la conversión final a POJO en el controlador sea más sencilla.
        virtuals: true, // Incluye los campos virtuales definidos en el esquema (ej. 'id' por defecto de Mongoose).
        getters: true,  // Aplica cualquier getter definido en el esquema a las propiedades correspondientes.
        transform: function (doc, ret, options) {
            // 'ret' es el objeto plano que Mongoose está a punto de devolver.
            // El virtual 'id' ya debería estar presente en 'ret' gracias a `virtuals: true`.
            delete ret._id;      // Elimina la propiedad original _id.
            delete ret.__v;     // Elimina el campo de versión __v.
            return ret;         // Es crucial devolver el objeto 'ret' modificado.
        }
    },
    toObject: { 
        // Opciones para cuando el documento se convierte a un objeto plano (ej. usando el método .toObject()).
        // Similar a toJSON, estas opciones preparan el documento. El controlador realizará la conversión final.
        virtuals: true, // Incluye los campos virtuales.
        getters: true,  // Aplica los getters del esquema.
        transform: function (doc, ret, options) {
            // El virtual 'id' ya debería estar en 'ret'.
            delete ret._id;      // Elimina _id.
            delete ret.__v;     // Elimina __v.
            return ret;         // Devolver el objeto 'ret' modificado.
        }
    }
});

/*
productsSchema.virtual('info').get(function () {
    return `${this.brand ? this.brand.toLocaleUpperCase() : '' } | ${this.name} | $${this.price}`;
});

productsSchema.virtual('priceWithTaxes').get(function () {
    return this.price ? Number((this.price * 1.21).toFixed(2)) : 0;
});
*/

const Product = mongoose.model('Product', productsSchema);

class ProductModelMongoDB {

    ////////////////////////////////////////////////////////////////////////////////
    //                              CRUD - C: Create                              //
    ////////////////////////////////////////////////////////////////////////////////

    createProduct = async product => {
        try {
            const newProduct = new Product(product);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.error(`Error al crear el producto: ${error.message || 'Error desconocido'}`);
            return null;
        }
    };


    ////////////////////////////////////////////////////////////////////////////////
    //                               CRUD - R: Read                               //
    ////////////////////////////////////////////////////////////////////////////////

    getAllProducts = async () => {
        try {
            const foundProducts = await Product.find();
            return foundProducts;
        } catch (error) {
            console.error(`Error al obtener los productos: ${error.message || 'Error desconocido'}`);
            return null;
        }
    };

    getProductById = async id => {
        try {
            const foundProduct = await Product.findById(id);
            return foundProduct;
        } catch (error) {
            console.error(`Error al obtener el producto con ID ${id}: ${error.message || 'Error desconocido'}`);
            return null;
        }
    };


    ////////////////////////////////////////////////////////////////////////////////
    //                              CRUD - U: Update                              //
    ////////////////////////////////////////////////////////////////////////////////

    updateProduct = async (id, product) => {
        try {
            const updatedProduct = await Product.findOneAndReplace(
                { _id: id },
                product,
                { new: true }
            );
            return updatedProduct;
        } catch (error) {
            console.error(`Error al actualizar el producto con ID ${id}: ${error.message || 'Error desconocido'}`);
            return null;
        }
    };

    updateProductPartial = async (id, partialProduct) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                { $set: partialProduct },
                { new: true }
            );
            return updatedProduct;
        } catch (error) {
            console.error(`Error al actualizar parcialmente el producto con ID ${id}: ${error.message || 'Error desconocido'}`);
            return null;
        }
    };


    ////////////////////////////////////////////////////////////////////////////////
    //                              CRUD - D: Delete                              //
    ////////////////////////////////////////////////////////////////////////////////

    deleteProduct = async id => {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            return deletedProduct;
        } catch (error) {
            console.error(`Error al eliminar el producto con ID ${id}: ${error.message || 'Error desconocido'}`);
            return null;
        }
    };
}


export default ProductModelMongoDB;
