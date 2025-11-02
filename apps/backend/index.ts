import { Elysia } from 'elysia';
import { filesRoutes } from './src/routes/files';
import cors from '@elysiajs/cors';

const app = new Elysia()
  .use(cors())
  .use(filesRoutes)
  .listen(3000);



