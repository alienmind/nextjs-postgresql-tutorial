const { Pool } = require('pg');
require ('dotenv').config();

/*
class TypedPool<T> extends Pool {
  async query<R>(text: string, params?: any[]): Promise<R> {
    const result = await super.query(text, params);
    return result.rows as unknown as R;
  }

  constructor(props : any) {
    super(props);
  }
}
const connectionPool = new TypedPool({
...
});
*/

const connectionPool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

module.exports = connectionPool;