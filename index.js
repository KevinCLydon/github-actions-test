#!/usr/bin/env node

const yargs = require("yargs");
const fs = require('fs');

yargs
    .scriptName("github-actions-test")
    .usage('$0 <cmd> [args]')
    .command('hello [name]', "prints a greeting", (yargs) => {
        yargs.positional('name', {
            type: 'string',
            default: 'Kevin',
            describe: 'the name to say hello to'
        })
    }, function (argv) {
        console.log('Hi,', argv.name, "!")
    })
    .command('print [message] [file]', "prints message to a file", (yargs) => {
        yargs.positional('message', {
            type: 'string',
            default: 'Hi, Kevin',
            describe: 'the message to print'
        }),
        yargs.positional('file', {
            type: 'string',
            default: 'out.txt',
            describe: 'the file to print to'
        })
    }, function (argv) {
        fs.writeFileSync(argv.file, argv.message);
    })
    .help()
    .argv

