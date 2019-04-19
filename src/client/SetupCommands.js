const Constants = require('../../constants/Constants');
const DiscordUtils = require('../discord/DiscordUtils');
const PermissionUtils = require('../utils/PermissionUtils');
const Utils = require('../utils/Utils');

function setupCommands({ DB, Discord, fs, require, pathUtil, projectPath, process, commandPrefix, client }) {

  const commands = new Discord.Collection();

  const dirFilePaths = Utils.getAbsoluteFilePaths({ fs, process, projectPath, pathUtil });
  const commandFilePaths = dirFilePaths.filter(path => path.endsWith('.js') && !path.endsWith('.test.js') && !path.endsWith('.apitest.js'));

  commandFilePaths.forEach(filePath => {
    const command = require(filePath);

    // Add a usage string for help
    command.usageString = Utils.createUsageString({ commandPrefix, ...command });

    // Run the createExecute function (injecting any dependencies)
    command.execute = command.createExecute({ DB, client, commandPrefix });

    commands.set(command.commandName, command);
  });

  // TODO: Finish implementing help
  // const helpCommand = createHelpCommand({ DB, Discord, commands });

  return commands;

}

function createHelpCommand({ DB, Discord, commands }) {

  const commandName = 'help';
  const description = `Posts the list of availiable commands and how to use them.`;

  const helpEmbeds = {};

  const permissionLevels = PermissionUtils.PERMISSION_LEVELS;

  Object.keys(permissionLevels).forEach(permissionLevel => {

    const permissionName = permissionLevels[permissionLevel];
    const embed = new Discord.RichEmbed()
      .setColor(Constants.mustardColorCode)
      .setTitle(`Commands for ${permissionName}`)
      .setDescription(`These commands are restricted to the ${permissionName} level.`);

    const permissibleCommands = commands.filter(command => command.permission === permissionLevel);
    permissibleCommands.forEach(command => {
      const helpText = `${command.usageString}\n${command.description}`;
      embed.addField(command.name, helpText);
    });

    helpEmbeds[permissionName] = embed;

  });

  function execute({ client, message, args }) {

    const user = DiscordUtils.getGuildMember(message);
    const guild = message.guild;
    const permissionLevel = PermissionUtils.getUserPermissionLevel({ DB, user, guild });


  }

  return {
    commandName,
    description,
    execute
  };

}

module.exports = setupCommands;