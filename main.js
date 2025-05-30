import express from 'express';
import cors from 'cors';
import productsRouter from './routers/products.js';
import frontendRouter from './routers/frontend.js';
import config from './config.js';
import { create } from 'express-handlebars';

const app = express();

// Configuración de Handlebars.
// Por defecto, Handlebars (a partir de la v4.6.0+) deshabilita el acceso a propiedades y métodos del prototipo
// por razones de seguridad. Esta es una buena práctica de seguridad para prevenir el acceso no intencionado
// a datos o métodos potencialmente sensibles en los prototipos de los objetos.
// Si necesitas mostrar datos de objetos con prototipos (por ejemplo, objetos de Mongoose),
// deberías convertirlos a objetos JavaScript planos (POJOs) antes de pasarlos a la plantilla.
// Por ejemplo, usando `.lean()` con consultas de Mongoose, o `JSON.parse(JSON.stringify(obj))`.
const hbs = create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: 'views/layouts',
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/', frontendRouter);

const PORT = config.PORT;
const server = app.listen(PORT, () => console.log(`Servidor Node.js + Express escuchando en el puerto ${PORT}`));
server.on('error', error => console.log(`Se produjo un error al iniciar el servidor: ${error.message}`));
