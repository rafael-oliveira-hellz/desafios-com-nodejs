import { Pool } from "pg";

const connectionString = {
    user: 'mofxbzhw',
    password: '4_6Sw8p09dvZxnIb0rGrEXeUphBPPI6m',   
    host: 'kesavan.db.elephantsql.com',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

const db = new Pool( connectionString );

export default db;