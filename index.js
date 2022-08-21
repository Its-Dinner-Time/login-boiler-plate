import './dotenv.js';
import Express from 'express';
import prisma from './prisma/index.js';

const app = Express();
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`PORT: ${port}, connected`);
});

app.get('/', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { userId: 'prisma' },
    select: {
      name: true,
      userId: true,
      password: true,
    },
  });

  res.json(user);
});
