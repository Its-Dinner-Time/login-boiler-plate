import Express from 'express';

import { login, access } from './UserService.js';
import { accessTokenVerify } from '../utils/middlewares.js';

const router = Express.Router();

// middleware that is specific to this router
// router.use(accessTokenVerify);

router.post('/login', login);
router.post('/access', access);

export default router;
