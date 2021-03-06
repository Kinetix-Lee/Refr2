'use strict';
import * as mysql from 'mysql';
// Edit this constant to decide how Refr2 interacts with MySQL server. 
const SQL = {
    host: 'localhost',
    user: 'Refr2',
    password: 'Refr2',
    port: 3306,
    database: 'Refr2',
    table: 'Refr2'
};
const REFR2 = {
    version: '1.0.0a',
    credits: 'Kinetix'
};
let sql;
;
function connect(config) {
    let conn = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        port: config.port,
        multipleStatements: true
    });
    conn.connect(function (err) {
        if (err)
            throw err;
    });
    return conn;
}
;
class r2 {
    create(name, target, username = null) {
        let conn = connect(SQL);
        sql = 'INSERT INTO `' + SQL.table + '` ' +
            '(`name`, `target`' + (username === null ? '' : ', `username`') + ') ' +
            'VALUES (\"' + name + '\", \"' + target + '\"' + (username === null ? '' : ', \"' + username + '\"') + ')';
        conn.query(sql, function (err) {
            if (err)
                throw err;
            conn.destroy();
        });
        return this;
    }
    ;
    remove(key, byName = false) {
        let conn = connect(SQL);
        if (byName)
            sql = 'DELETE FROM `' + SQL.table + '` WHERE `name`=\"' + key + '\"';
        else
            sql = 'DELETE FROM `' + SQL.table + '` WHERE `id`=' + key;
        conn.query(sql, function (err) {
            if (err)
                throw err;
            conn.destroy();
        });
        return this;
    }
    ;
    resolve(key, byId = false) {
        let conn = connect(SQL);
        if (!byId)
            sql = 'SELECT FROM `' + SQL.table + '` WHERE `name`=\"' + key + '\"';
        else
            sql = 'SELECT FROM `' + SQL.table + '` WHERE `id`=' + key;
        conn.query(sql, function (err, results) {
            if (err)
                throw err;
            return results[0];
        });
        conn.destroy();
        return this;
    }
    ;
    init(initDb = false) {
        const db = 'CREATE DATABASE `' + SQL.database + '`;';
        const table = 'USE `' + SQL.database + '`;\
        CREATE TABLE `' + SQL.table + '` (\
            `id` int(10) UNSIGNED NOT NULL,\
            `name` varchar(32) COLLATE utf8_bin NOT NULL,\
            `target` varchar(1024) COLLATE utf8_bin NOT NULL,\
            `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
            `uid` int(11) DEFAULT null\
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;\
        ALTER TABLE `' + SQL.table + '`\
            ADD PRIMARY KEY (`id`),\
            ADD UNIQUE KEY `name` (`name`);\
        ALTER TABLE `' + SQL.table + '`\
            MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;';
        let conn = connect(SQL);
        if (initDb)
            sql = db + table;
        else
            sql = table;
        conn.query(sql, function (err) {
            if (err)
                throw err;
            conn.destroy();
        });
        return this;
    }
    ;
}
;
export { r2 as Refr2 };
