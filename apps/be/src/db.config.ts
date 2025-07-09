import { Pool, QueryArrayConfig, QueryConfig, QueryConfigValues, QueryResult, QueryResultRow, Submittable } from 'pg';
import knex from 'knex';
import { parse } from 'pg-connection-string';
import { camelCase } from 'lodash';
import knexSnakeCaseMappers  from 'knex-stringcase';

const toCamelCase = <T extends Record<string, any>>(rows: T[]): T[] => {
  return rows.map(row => {
    const converted: Record<string, any> = {};
    Object.keys(row).forEach(key => {
      converted[camelCase(key)] = row[key];
    });
    return converted as T;
  });
};

class CamelCasePool extends Pool {
  async query<T extends Submittable>(queryStream: T): Promise<T>;
  async query<R extends any[] = any[], I extends any[] = any[]>(
    queryConfig: QueryArrayConfig<I>,
    values?: QueryConfigValues<I>
  ): Promise<QueryResult<R>>;
  async query<R extends QueryResultRow = any, I extends any[] = any[]>(
    queryConfig: QueryConfig<I>
  ): Promise<QueryResult<R>>;
  async query<R extends QueryResultRow = any, I extends any[] = any[]>(
    queryTextOrConfig: string | QueryConfig<I>,
    values?: QueryConfigValues<I>
  ): Promise<QueryResult<R>>;
  async query<R extends QueryResultRow = any, I extends any[] = any[]>(
    queryTextOrConfig: string | QueryConfig<I> | QueryArrayConfig<I> | Submittable,
    values?: QueryConfigValues<I>
  ): Promise<QueryResult<R> | Submittable> {
    if (this.isSubmittable(queryTextOrConfig)) {
      return super.query(queryTextOrConfig);
    }

    const result = await super.query<R>(queryTextOrConfig, values);
    result.rows = toCamelCase<R>(result.rows);
    return result;
  }

  private isSubmittable(query: any): query is Submittable {
    return typeof query === 'object' && typeof query.submit === 'function';
  }
}

const isProd = process.env.NODE_ENV === 'production';


let pgConfig: any;

if (isProd && process.env.DATABASE_URL) {
  // 生產環境使用 DATABASE_URL
  pgConfig = parse(process.env.DATABASE_URL);
  pgConfig.ssl = { rejectUnauthorized: false }; // Heroku 需要這個設置
} else {
  // 開發環境使用單獨的環境變量
  pgConfig = {
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
  };
}

// 創建 pg Pool
const pool = new CamelCasePool(pgConfig);

// 創建 Knex 實例
export const db = knex({
  client: 'pg',
  connection: pgConfig,
  pool: {
    min: 2,
    max: 10,
  },
  ...knexSnakeCaseMappers()
});

export default pool;
