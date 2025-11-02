import { Elysia, t } from 'elysia';
import { query } from '../db';

export const filesRoutes = new Elysia({ prefix: '/api/v1' })
  .get('/folders', async () => {
    const roots = await query('SELECT * FROM items WHERE depth = $1', [0]);
    return roots;
  })
  .get(
    '/folders/:id',
    async ({ params }) => {
      const children = await query('SELECT * FROM items WHERE parent_id = $1', [params.id]);
      return children;
    },
    {
      params: t.Object({ id: t.String() }),
    }
  )
  
