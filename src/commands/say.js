const PermissionUtils = require('../utils/PermissionUtils');
const ClientUtils = require('../client/ClientUtils');
const Utils = require('../utils/Utils');

const commandPrefix = ClientUtils.getCommandPrefix();
const commandName = `say`;
const description = `Allows the bot owner to speak through the bot.`;
const permission = PermissionUtils.PERMISSION_LEVELS.BOT_OWNER;

const argNames = ['channelId'];

function createExecute(deps) {

  function execute({ client, message, args }) {

    const channelId = args[0].match(/<?#?(\d+)>?/);
    if(channelId === null) throw new Error(`Invalid channel ID.`);

    const channel = client.channels.get(channelId[0]);

    return channel.send(args.slice(1).join(' '));

  }

  return execute;

}


module.exports = {
  commandName,
  description,
  permission,
  argNames,
  createExecute
};