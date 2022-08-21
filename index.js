import './dotenv.js';
import Express from 'express';

import { timeLog } from './utils/middlewares.js';
import { UserRouter } from './router/router.js';

const app = Express();
const port = process.env.PORT;

app.use(timeLog); // middelware
app.use('/user', UserRouter);

app.use('/', (req, res) => {
  res.send('<h1>Home</h1>');
});

app.listen(port, () => {
  console.log(`PORT: ${port}, connected`);
});
