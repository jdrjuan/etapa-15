import express from 'express';
import frontendController from '../controllers/frontend.js';

const router = express.Router();

router.get('/', frontendController.renderHome);

router.get('/preguntas-frecuentes', frontendController.renderFaq);

router.get('/nosotros', frontendController.renderAboutUs);

export default router;