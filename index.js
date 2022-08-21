import './dotenv.js';
import Express from 'express';

import { timeLog } from './utils/middlewares.js';
import { UserRouter } from './router/router.js';

const app = Express();
const port = process.env.PORT;

app.use(timeLog); // middleware
app.use(Express.json()); // for parsing application/json
app.use(Express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/user', UserRouter);
app.use('/', (req, res) => {
  res.send('<h1>Home</h1>');
});

app.listen(port, () => {
  console.log(`PORT: ${port}, connected`);
});
