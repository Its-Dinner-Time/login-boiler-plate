import Express from 'express';

import { login, logout, verify } from './UserService.js';

const router = Express.Router();

// middleware that is specific to this router
// router.use();

router.post('/login', login);
router.post('/verify', verify);
router.post('/logout', logout);

export default router;
