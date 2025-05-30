import api from '../api/products.js';

const renderHome = async (req, res) => {
    // Obtener los datos de los productos usando la función api.getAllProducts().
    // Esta función recupera todos los productos desde la capa de persistencia configurada (ej. memoria, sistema de archivos o MongoDB).
    const products = await api.getAllProducts();

    // Convertir los productos obtenidos a objetos JavaScript planos (POJOs) antes de pasarlos a la plantilla.
    // Esta conversión es esencial para la seguridad y compatibilidad con Handlebars.
    //
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
    // El resultado final (`plainProducts`) es un array de objetos donde cada objeto:
    //   - Tiene una propiedad `id` que es un string.
    //   - No tiene la propiedad `_id` (especialmente relevante para Mongoose).
    //   - Es seguro para pasar a las plantillas Handlebars.
    const plainProducts = products ? products.map(p => {
        if (p && typeof p.toObject === 'function') {
            return p.toObject(); // Utiliza la configuración del esquema de Mongoose (virtuals y transform)
        }
        return p; // Para objetos ya planos (de FS, Memoria, o si `products` es null/undefined)
    }) : [];

    // Nota: La siguiente comprobación `if (!plainProducts)` podría no ser estrictamente necesaria si `products`
    // es un array vacío, ya que `map` devolvería un array vacío. Sin embargo, se mantiene por si `api.getAllProducts()`
    // devolviera `null` o `undefined` en algún caso extremo, aunque la implementación actual de los modelos devuelve arrays.
    if (!plainProducts) { 
        // Si la obtención de productos falla o no devuelve productos (después de la conversión potencial),
        // renderizar la página de inicio con un array de productos vacío.
        // Esto asegura que la página se renderice correctamente incluso sin datos de productos.
        // res.render('home', { title: 'Inicio', products: [] });
    }
    // Renderizar la plantilla `home`, pasando el título y los datos planos (`plainProducts`) que contienen `id` como string.
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
        // con una propiedad `id` (string) y sin `_id`, gracias a la estandarización
        // realizada en las capas de modelo y API.
        const product = await api.getProductById(productId);

        if (product) {
            // Si el producto se encuentra, renderizar la vista de detalle 'productDetail.hbs'.
            // Se pasa el objeto producto completo a la plantilla.
            // El título de la página se establece con el nombre del producto.
            res.render('productDetail', { 
                title: product.name || 'Detalle del Producto', // Título de la página
                product // Objeto producto para usar en la plantilla
            });
        } else {
            // Si el producto no se encuentra (api.getProductById devolvió null),
            // responder con un estado 404 y renderizar la misma vista de detalle
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
