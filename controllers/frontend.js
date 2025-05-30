import api from '../api/products.js';

const renderHome = async (req, res) => {
    // Obtener los datos de los productos usando la función api.getAllProducts().
    // Esta función recupera todos los productos desde la capa de persistencia configurada (ej. memoria, sistema de archivos o MongoDB).
    const products = await api.getAllProducts();

    // Convertir los productos obtenidos a objetos JavaScript planos (POJOs) antes de pasarlos a la plantilla.
    // Esta conversión es esencial para la seguridad y compatibilidad con Handlebars.
    //
    // Por defecto, Handlebars (a partir de la v4.6.0+) deshabilita el acceso a propiedades y métodos del prototipo
    // por razones de seguridad. Esta es una buena práctica de seguridad para prevenir el acceso no intencionado
    // a datos o métodos potencialmente sensibles en los prototipos de los objetos.
    // Si necesitamos mostrar datos de objetos con prototipos (por ejemplo, objetos de Mongoose),
    // deberíamos convertirlos a objetos JavaScript planos (POJOs) antes de pasarlos a la plantilla.
    // Por ejemplo, usando `.lean()` con consultas de Mongoose, o `JSON.parse(JSON.stringify(obj))`.
    
    // Para productos de Mongoose:
    //   - Se invoca el método `toObject()` en cada producto de Mongoose.
    //   - La configuración del esquema de Mongoose (`models/productsMongoDB.js`) para `toObject` incluye:
    //     - `virtuals: true`: Esto asegura que el campo virtual `id` (que Mongoose provee por defecto como `_id.toString()`) se incluya.
    //     - `transform`: Esta función elimina las propiedades `_id` y `__v` del objeto resultante.
    //   - Como resultado, cada producto de Mongoose se convierte en un objeto plano con una propiedad `id` (string) y sin `_id` ni `__v`.
    //
    // Para productos de otros modelos (FS, Memoria):
    //   - Estos modelos ya devuelven objetos que son inherentemente planos o se espera que tengan una estructura similar,
    //     incluyendo una propiedad `id` (string). La condición `p && typeof p.toObject === 'function'` maneja esto;
    //     si `toObject` no existe, el objeto `p` se usa tal cual.
    //
    // Asegurarse de que cada producto sea un objeto JavaScript plano (POJO).
    // Esta conversión es crucial para la seguridad, la compatibilidad con Handlebars y para garantizar una estructura de datos predecible.
    const plainProducts = products ? products.map(p => {
        if (!p) return null; // Manejar posible producto nulo en la lista original.

        // Para documentos de Mongoose, .toObject() es la forma preferida de obtener un POJO.
        // Incluir { virtuals: true, getters: true } asegura que los campos virtuales (como 'id') y getters se apliquen.
        // La configuración del esquema de Mongoose (`models/productsMongoDB.js`) para `toObject` ya incluye
        // `virtuals: true` y una transformación para eliminar `_id` y `__v`.
        // Para otros tipos de objetos (ej. de FS o Memoria, que ya deberían ser planos),
        // se crea una copia superficial para asegurar que no se modifiquen los objetos originales de la caché del modelo.
        let productObject = (typeof p.toObject === 'function')
            ? p.toObject({ virtuals: true, getters: true })
            : { ...p };

        // Doble verificación y normalización del ID como string.
        // Aunque `p.toObject({ virtuals: true })` debería haber creado 'id' a partir de '_id' para Mongoose,
        // esta sección actúa como un refuerzo y asegura la consistencia.
        if (productObject._id) { // Si _id todavía existe (inesperado para Mongoose con la configuración de esquema correcta)
            if (!productObject.id || typeof productObject.id !== 'string') {
                productObject.id = productObject._id.toString();
            }
            delete productObject._id; // Eliminar _id definitivamente.
        } else if (productObject.id && typeof productObject.id !== 'string') {
            // Si 'id' existe pero no es un string (ej. un ObjectId si la virtual no funcionó como se esperaba).
            productObject.id = productObject.id.toString();
        }

        // Eliminar el campo de versión de Mongoose si aún existe.
        delete productObject.__v;

        return productObject;
    }).filter(p => p !== null) : []; // Filtrar cualquier producto que haya resultado nulo.

    // Renderizar la plantilla `home`, pasando el título y el array de productos ya procesados (`plainProducts`).
    // Cada producto en `plainProducts` está garantizado (o se intenta con alta probabilidad) de ser un POJO
    // con una propiedad `id` (string) y sin `_id` o `__v`.
    res.render('home', { title: 'Inicio', products: plainProducts });
};

const renderAboutUs = (req, res) => {
    res.render('aboutUs', { title: 'Nosotros' });
};

const renderFaq = (req, res) => {
    res.render('faq', { title: 'Preguntas frecuentes' });
};

// Controlador para renderizar la página de detalle de un producto específico.
const renderProductDetail = async (req, res) => {
    // Obtener el ID del producto desde los parámetros de la ruta (ej. /productos/123)
    const productId = req.params.id;

    try {
        // Llamar a la capa API para obtener el producto por su ID.
        // Se espera que `api.getProductById` devuelva:
        // - Un objeto producto si se encuentra.
        // - `null` si no se encuentra.
        // El objeto producto devuelto ya debería ser un objeto JavaScript plano (POJO)
        // con una propiedad `id` (string) y sin `_id`. (Verificación adicional abajo)
        const product = await api.getProductById(productId);

        if (product) {
            // Asegurar que el producto individual sea un objeto JavaScript plano (POJO)
            // antes de pasarlo a la plantilla, aplicando la misma lógica que para la lista de productos.
            let plainProduct = (typeof product.toObject === 'function')
                ? product.toObject({ virtuals: true, getters: true })
                : { ...product };

            // Doble verificación y normalización del ID como string para el producto individual.
            if (plainProduct._id) {
                if (!plainProduct.id || typeof plainProduct.id !== 'string') {
                    plainProduct.id = plainProduct._id.toString();
                }
                delete plainProduct._id; // Eliminar _id definitivamente.
            } else if (plainProduct.id && typeof plainProduct.id !== 'string') {
                plainProduct.id = plainProduct.id.toString();
            }

            // Eliminar el campo de versión de Mongoose si aún existe.
            delete plainProduct.__v;

            // Si el producto se encuentra y se ha procesado a POJO, renderizar la vista de detalle.
            res.render('productDetail', {
                title: plainProduct.name || 'Detalle del Producto', // Título de la página
                product: plainProduct // Objeto producto plano para usar en la plantilla
            });
        } else {
            // Si el producto no se encuentra (api.getProductById devolvió null),
            // responder con un estado 404 y renderizar la misma vista de detalle (o una específica de error)
            // pero indicando que el producto no fue encontrado.
            // Opcionalmente, se podría tener una plantilla específica para errores 404.
            res.status(404).render('productDetail', {
                title: 'Producto no encontrado',
                error: 'El producto que buscas no existe o no está disponible.',
                productId: productId // Se puede pasar el ID para mostrarlo en el mensaje
            });
        }
    } catch (error) {
        // Manejar cualquier error inesperado que pueda ocurrir durante la obtención de datos
        // (ej. problemas de conexión con la base de datos, errores en la capa API/modelo).
        console.error(`Error al obtener el producto con ID ${productId}:`, error);
        // Responder con un estado 500 y renderizar la vista de detalle
        // indicando un error genérico.
        // Opcionalmente, usar una plantilla de error global.
        res.status(500).render('productDetail', {
            title: 'Error del servidor',
            error: 'Ocurrió un error al intentar obtener los detalles del producto. Por favor, intenta más tarde.'
        });
    }
};

export default {
    renderHome,
    renderAboutUs,
    renderFaq,
    renderProductDetail // Nueva función exportada
};
