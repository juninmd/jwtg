#!/usr/bin/env node

const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const pathLib = require('path');

(async () => {
    let [_, _jwtg, secretKey, path] = process.argv;

    let json = {};

    if (path) {
        path = pathLib.resolve(path);

        if (fs.existsSync(path) && pathLib.extname(path) === '.json') {
            try {
                json = JSON.parse(fs.readFileSync(path).toString());
            } catch (error) {
                console.error('Invalid JSON:', error.message);
                console.error('Path:', path);
                process.exitCode = 1;
                return;
            }
        }
        else {
            console.error('Please, check your path, and select a valid JSON File!');
            console.error('Path:', path);
            process.exitCode = 1;
            return;
        }
    }

    const token = jsonwebtoken.sign(json, secretKey || 'stubJWT', {
        noTimestamp: true
    });

    console.log(token);

    console.log('JSON:', json);
    console.log('Secret:', secretKey || 'stubJWT');

    try {
        // clipboardy >= 5 is ESM-only, so it must be loaded with import()
        const { default: clipboardy } = await import('clipboardy');
        await clipboardy.write(token);
    } catch (error) {
        console.error('Could not copy to the clipboard:', error.message.split('\n')[0]);
    }
})();

