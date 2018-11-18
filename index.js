#!/usr/bin/env node

const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');


(() => {
    const [_, _jwtg, secretKey, path] = process.argv;

    let json = {};

    if (path) {
        if (fs.existsSync(path)) {
            json = require(path);
        }
        else {
            console.error('Please, check your path. File not found!');
            console.error('Path:', path);
            return;
        }
    }

    console.log(jsonwebtoken.sign(json, secretKey || 'stubJWT', {
        noTimestamp: true
    }));

    console.log('JSON:', json);
    console.log('Secret:', secretKey || 'stubJWT');
})();
