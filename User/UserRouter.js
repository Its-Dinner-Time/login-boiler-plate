import Express from 'express';
const router = Express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

router.get('/', (req, res) => {
  res.send('user home');
});

router.get('/about', (req, res) => {
  res.send('user about');
});

export default router;
