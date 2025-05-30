import express from 'express';
import cors from 'cors';
import productsRouter from './routers/products.js';
import frontendRouter from './routers/frontend.js';
import config from './config.js';
import { create } from 'express-handlebars';

const app = express();

// Configure Handlebars.
// By default, Handlebars (v4.6.0+) disables access to prototype properties and methods
// for security reasons. This is a good security practice to prevent unintended
// access to potentially sensitive data or methods on object prototypes.
// If you need to display data from objects with prototypes (e.g., Mongoose objects),
// you should convert them to plain JavaScript objects before passing them to the template.
// For example, using `.lean()` with Mongoose queries, or `JSON.parse(JSON.stringify(obj))`.
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
