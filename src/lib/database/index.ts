import type { Database } from './types.ts' // this is the Database interface we defined earlier
import pg from 'pg'
import { Kysely, PostgresDialect, MysqlDialect  } from 'kysely'
import { createPool } from 'mysql2'

const { Pool } = pg
export const postgresPool = new Pool({
  database: import.meta.env.VITE_PGDATABASE,
  user: import.meta.env.VITE_PGUSER,
  host: import.meta.env.VITE_PGHOST,
  password: import.meta.env.VITE_PGPASSWORD,
  port: import.meta.env.VITE_PGPORT || 5432,
  max: 10,
})

const postgres = new PostgresDialect({
  pool: postgresPool
})

const mysql = new MysqlDialect({
  pool: createPool({
    database: "escuelaDB",
    host: "localhost",
    user: "root",
    password: "carlos2606",
    port: 3306,
    connectionLimit: 10
  })
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely 
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how 
// to communicate with your database.
export const db = new Kysely<Database>({ dialect: mysql })