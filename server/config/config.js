require('dotenv').config({ path: '../.env' })

const { Pool } = require('pg');
const Cursor = require('pg-cursor');

var environment = process.env.NODE_ENV

function getEnvironment(environment) {
    if (environment == "production") return "PRODUCCIÓN".bgGreen;
    else if (environment == "qa") return "QA".bgYellow;
    return "DESAROLLO".bgRed;
}

logger.info("Se Encuentra En Ambiente De: " + getEnvironment(environment));

const connectionData = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
}

const pool = new Pool(connectionData);

class database {

    query(sql) {
        return new Promise(function(resolve, reject) {
            try {
                pool.query(sql, function(err, result) {
                    return err ? reject(err) : resolve(result.rows);
                });
            } catch (e) {
                logger.error("Error executing query: " + sql, e);
                return reject(e);
            }
        });
    }

    queryCursor(sql) {
        return new Promise(async function(resolve, reject) {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                await client.query(sql);
                let cursor = await client.query(new Cursor('FETCH ALL IN "datos"'));
                cursor.read(100, function(err, rows) {
                    err ? reject(err) : resolve(rows);
                })
                await client.query('COMMIT');
            } catch (e) {
                await client.query('ROLLBACK');
                logger.error("Error executing query: " + sql, e);
                return reject(e);
            } finally {
                client.release()
            }
        });
    }
}

module.exports = new database();