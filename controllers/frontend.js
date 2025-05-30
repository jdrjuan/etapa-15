import api from '../api/products.js';

const renderHome = async (req, res) => {
    // Obtener los datos de los productos usando la función api.getAllProducts().
    // Esta función recupera todos los productos desde la capa de persistencia configurada (ej. memoria, sistema de archivos o MongoDB).
    const products = await api.getAllProducts();

    // Convertir los productos obtenidos a objetos JavaScript planos (POJOs) antes de pasarlos a la plantilla.
    // Si los productos son documentos de Mongoose u otros objetos complejos con prototipos,
    // esta conversión es crucial por varias razones:
    // 1. Seguridad: Previene el acceso no intencionado a propiedades o métodos del prototipo en las plantillas Handlebars,
    //    lo cual es una buena práctica de seguridad (Handlebars deshabilita el acceso a prototipos por defecto desde v4.6.0+).
    //    Esto ayuda a mitigar riesgos como la contaminación de prototipos (prototype pollution).
    // 2. Compatibilidad: Asegura que las plantillas solo manejen datos planos, haciéndolas más robustas
    //    y menos propensas a errores si la estructura del objeto subyacente cambia o contiene métodos
    //    no destinados a la renderización.
    // 3. Claridad: Define explícitamente la estructura de datos que se pasa a la plantilla.
    // Verificamos si `products` existe y si cada producto tiene un método `toObject` (común en objetos ORM/ODM).
    // Si no, asumimos que ya es un objeto plano o que el array está vacío.
    const plainProducts = products ? products.map(p => p && typeof p.toObject === 'function' ? p.toObject() : p) : [];

    if (!plainProducts) { // Ahora se debería verificar plainProducts, aunque el .map maneja un array de productos nulo/indefinido.
        // Si la obtención de productos falla o no devuelve productos (después de la conversión potencial),
        // renderizar la página de inicio con un array de productos vacío.
        // Esto asegura que la página se renderice correctamente incluso sin datos de productos.
        // El .map de plainProducts devuelve un array vacío si products es null/undefined.
        // res.render('home', { title: 'Inicio', products: [] }); // Esta línea podría ser redundante debido a la lógica actual de plainProducts.
    }
    // Renderizar la plantilla `home`, pasando el título y los datos planos de `plainProducts`.
    res.render('home', { title: 'Inicio', products: plainProducts });
};

const renderAboutUs = (req, res) => {
    res.render('aboutUs', { title: 'Nosotros' });
};

const renderFaq = (req, res) => {
    res.render('faq', { title: 'Preguntas frecuentes' });
};

export default {
    renderHome,
    renderAboutUs,
    renderFaq
};
