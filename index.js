const Discord = require('discord.js');

const path = require('path');
const fs = require('fs');
const Twitter = require('twitter');

const MessageHandler = require('./src/client/MessageHandler');

const argv = require('minimist')(process.argv.slice(2));
const testMode = argv['test'] ? true : false;

// database
const DB = require('./src/db/DB.js');

const SetupClient = require('./src/client/SetupClient');

const commandPrefix = require('./src/client/ClientUtils').getCommandPrefix();

// init
const client = new Discord.Client();
const commands = require('./src/client/SetupCommands')({ DB, Discord, fs, require, process, pathUtil: path, projectPath: './src/commands', client, commandPrefix });

let clientIsReady = false;

const Bot = {
  Client: client,
  testMode,
  DB
};

client.on('ready', () => {
  SetupClient({ DB, client });
  clientIsReady = true;
  console.log('Completed all setup tasks.');
});

client.on('message', message => MessageHandler.handleMessage({ DB, commands, client, message, clientIsReady }));

client.login(process.env.DISCORD_TOKEN)
  .catch(err => console.error(`Failed to login`, err));