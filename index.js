import './dotenv.js';
import Express from 'express';
import cookieParser from 'cookie-parser';

import { timeLog } from './utils/middlewares.js';
import { UserRouter } from './router/router.js';

const app = Express();
const port = process.env.PORT;

// middleware
app.use(timeLog);
app.use(cookieParser(process.env.SECURE)); // cookieParser
app.use(Express.json()); // for parsing application/json
app.use(Express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/user', UserRouter);

app.listen(port, () => {
  console.log(`PORT: ${port}, connected`);
});
