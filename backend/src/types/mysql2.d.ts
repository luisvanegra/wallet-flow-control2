declare module 'mysql2/promise' {
  export interface PoolOptions {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
    ssl?: {
      rejectUnauthorized?: boolean;
    };
    waitForConnections?: boolean;
    connectionLimit?: number;
    queueLimit?: number;
  }

  export interface QueryError extends Error {
    code: string;
    errno: number;
    sqlMessage: string;
    sqlState: string;
  }

  export interface Pool {
    query(sql: string, values?: any[]): Promise<any>;
    execute(sql: string, values?: any[]): Promise<any>;
    end(): Promise<void>;
  }

  export function createPool(config: PoolOptions): Pool;
} 