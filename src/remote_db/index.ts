require('dotenv').config();
const fs = require('fs');
import { Client } from 'pg';
const url = require('url');

const config = {
    user: "avnadmin",
    password: process.env.AIVEN_PASSWORD,
    host: process.env.AIVEN_HOST,
    port: 11223,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.AIVEN_CERTIFICATE,
    },
};

const client = new Client(config);
client.connect(function (err: unknown) {
    if (err)
        throw err;
    client.query("SELECT VERSION()", [], function (err: unknown, result: any) {
        if (err)
            throw err;

        console.log(result.rows[0].version);
        client.end(function (err: unknown) {
            if (err)
                throw err;
        });
    });
});

export default config;