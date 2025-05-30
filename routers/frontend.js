import express from 'express';
import frontendController from '../controllers/frontend.js';

const router = express.Router();

router.get('/', frontendController.renderHome);

// Ruta para mostrar la página de detalle de un producto específico.
router.get('/productos/:id', frontendController.renderProductDetail);

router.get('/preguntas-frecuentes', frontendController.renderFaq);

router.get('/nosotros', frontendController.renderAboutUs);

export default router;