#!/usr/bin/env node

const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const pathLib = require('path');
const clipboardy = require('clipboardy');
const program = require('commander');


program
    .option('-p, --path', 'Localização do arquivo json')
    .option('-s, --secret <value>', 'Valor do secret');

program
    .command('generate') // sub-command name
    .alias('g') // alternative sub-command is `al`
    .description('Gera token do jwtg') // command description
    .action(() => {
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
                    return;
                }
            }
            else {
                console.error('Please, check your path, and select a valid JSON File!');
                console.error('Path:', path);
                return;
            }
        }

        const token = jsonwebtoken.sign(json, secretKey || 'stubJWT', {
            noTimestamp: true
        });

        console.log(token);

        clipboardy.writeSync(token);

        console.log('JSON:', json);
        console.log('Secret:', secretKey || 'stubJWT');
    });
// allow commander to parse `process.argv`
program.parse(process.argv);