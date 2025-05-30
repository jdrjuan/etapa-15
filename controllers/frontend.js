import api from '../api/products.js';

const renderHome = async (req, res) => {
    // TODO: Corregir, porque la vista da error:
    // Handlebars: Access has been denied to resolve the property "..." because it is not an "own property" of its parent.
    const products = await api.getAllProducts();
    if (!products) {
        // res.render('home', { title: 'Inicio', products: [] });
    }
    res.render('home', { title: 'Inicio', products });
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
