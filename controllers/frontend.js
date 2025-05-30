import api from '../api/products.js';

const renderHome = async (req, res) => {
    // Fetch product data using the api.getAllProducts() function.
    // This function retrieves all products from the configured persistence layer (e.g., memory, file system, or MongoDB).
    const products = await api.getAllProducts();

    // Convert the fetched products to plain JavaScript objects before passing them to the template.
    // If products are Mongoose documents or other complex objects with prototypes,
    // this conversion is crucial for several reasons:
    // 1. Security: It prevents unintended access to prototype properties or methods in Handlebars templates,
    //    which is a security best practice (Handlebars disables prototype access by default since v4.6.0+).
    //    This helps mitigate risks like prototype pollution.
    // 2. Compatibility: Ensures that templates only deal with plain data, making them more robust
    //    and less prone to errors if the underlying object structure changes or contains methods
    //    not intended for rendering.
    // 3. Explicitness: Clearly defines the data structure being passed to the template.
    // We check if `products` exists and if each product has a `toObject` method (common for ORM/ODM objects).
    // If not, we assume it's already a plain object or the array is empty.
    const plainProducts = products ? products.map(p => p && typeof p.toObject === 'function' ? p.toObject() : p) : [];

    if (!plainProducts) { // Should check plainProducts now, though the map handles null/undefined products array.
        // If fetching products fails or returns no products (after potential conversion),
        // render the home page with an empty products array.
        // This ensures the page still renders correctly without product data.
        // An empty array is passed by the plainProducts mapping if products is null/undefined.
        // res.render('home', { title: 'Inicio', products: [] }); // This line might be redundant due to current plainProducts logic
    }
    // Render the `home` template, passing the title and the plain `plainProducts` data.
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
