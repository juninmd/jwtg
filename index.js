#!/usr/bin/env node

const jsonwebtoken = require('jsonwebtoken');

((key) => {
    const secretKey = key || 'stubJWT';
    console.log(jsonwebtoken.sign({}, secretKey));
})(process.argv[2]);
