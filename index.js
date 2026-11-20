#!/usr/bin/env node

const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const pathLib = require('path');

const USAGE = `Usage: jwtg [secret] [payload.json]

Signs the JSON payload (default {}) with HS256 and copies the token to the clipboard.
  secret         signing key (default: stubJWT)
  payload.json   path to a .json file with the payload

Options:
  -h, --help     show this help
  -v, --version  show the version`;

(async () => {
    let [_, _jwtg, secretKey, path] = process.argv;

    // Without this, `jwtg --help` silently signed a token with "--help" as the secret
    if (secretKey === '-h' || secretKey === '--help') {
        console.log(USAGE);
        return;
    }
    if (secretKey === '-v' || secretKey === '--version') {
        console.log(require('./package.json').version);
        return;
    }

    let json = {};

    if (path) {
        path = pathLib.resolve(path);

        // One message per cause: "check your path" for every case hid whether the file was missing or just not .json
        let problem = null;
        if (!fs.existsSync(path)) problem = 'File not found.';
        else if (fs.statSync(path).isDirectory()) problem = 'This is a folder; pass a .json file.';
        else if (pathLib.extname(path).toLowerCase() !== '.json') problem = 'The payload must be a .json file.';
        if (problem) {
            console.error(problem);
            console.error('Path:', path);
            process.exitCode = 1;
            return;
        }
        try {
            json = JSON.parse(fs.readFileSync(path).toString());
        } catch (error) {
            console.error('Invalid JSON:', error.message);
            console.error('Path:', path);
            process.exitCode = 1;
            return;
        }
    }

    let token;
    try {
        token = jsonwebtoken.sign(json, secretKey || 'stubJWT', {
            noTimestamp: true
        });
    } catch (error) {
        // e.g. the JSON file holds an array, null or a primitive instead of an object
        console.error('Could not sign the token:', error.message);
        process.exitCode = 1;
        return;
    }

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

