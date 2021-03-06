"use strict";

// =================== imports ===================

const url = require('url');
const Pool = require('pg-pool');
const fs = require('fs');

// =================== DB setup ===================

// the local DB URL needs to be changed to your own settings
let localDBUrl = "postgresql://fangzhao:457866@localhost:5432/nwen304";
let databaseUrl = process.env.DATABASE_URL || localDBUrl;
let params = url.parse(databaseUrl);
let auth = params.auth.split(':');
let sslBoolean = !!process.env.DATABASE_URL;

let config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: sslBoolean
};

const pool = new Pool(config);

// =================== connect & prepare ===================

let sql = fs.readFileSync('pg_scripts/2.db_prepare.sql').toString();
pool.query(sql)
    .then(result => {
        console.log("[SUCCESS] tables created and test data populated.");
    })
    .catch(e => {
        console.error('[ERROR] Query error', e.message, e.stack);
    });

// disconnect
pool.end();
