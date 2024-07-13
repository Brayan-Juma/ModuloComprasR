
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',  
    database: 'ModuloCompras', 
    password: 'bryan1998', 
    port: 5432,        
});

module.exports = pool;
