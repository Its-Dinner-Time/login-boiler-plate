// DOCS : https://www.prisma.io/docs/reference/api-reference/prisma-client-reference
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

prisma.$on('query', (e) => {
  console.log('----query level');
  console.log(e);
});
prisma.$on('info', (e) => {
  console.log('----info level');
  console.log(e);
});
prisma.$on('warn', (e) => {
  console.log('----warn level');
  console.log(e);
});
prisma.$on('error', (e) => {
  console.log('----error level');
  console.log(e);
});

export default prisma;
