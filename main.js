import express from 'express';
import cors from 'cors';
import productsRouter from './routers/products.js';
import frontendRouter from './routers/frontend.js';
import config from './config.js';
import { create } from 'express-handlebars';

const app = express();

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
