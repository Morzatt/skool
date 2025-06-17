import type { Database } from './types.ts' // this is the Database interface we defined earlier
import { Kysely, MysqlDialect  } from 'kysely'
import { createPool } from 'mysql2'

const mysql = new MysqlDialect({
  pool: createPool({
    database: import.meta.env.VITE_MSDATABASE,
    host: import.meta.env.VITE_MSHOST,
    user: import.meta.env.VITE_MSUSER,
    password: import.meta.env.VITE_MSPASSWORD,
    port: import.meta.env.VITE_MSPORT || 3306,
    connectionLimit: 10
  })
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely 
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how 
// to communicate with your database.
export const db = new Kysely<Database>({ dialect: mysql })