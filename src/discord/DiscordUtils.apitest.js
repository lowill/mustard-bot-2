const expect = require('chai').expect;
const Discord = require('discord.js');
const DiscordUtils = require('./DiscordUtils');

let client;

// Tests to be run after unit tests


describe(`DiscordUtils tests`, () => {

  before(done => {
    client = new Discord.Client();
    client.login(process.env.DISCORD_TOKEN);

    client.on('ready', () => done());
  });

  describe(`resolveUser function`, () => {

    it(`should successfully return its own identity provided a user ID`, async () => {

      const botId = client.user.id;

      const result = await DiscordUtils.resolveUser(client, botId);
      expect(result.id).to.eql(botId);

    });

    // Haven't figured out how to test this yet
    it(`should successfully return its own identity provided a username and discriminator`);

    it(`should successfully return its own identity provided an @mention`, async () => {

      const botId = client.user.id;
      const botMention = `<@!${botId}>`;

      const result = await DiscordUtils.resolveUser(client, botMention);
      expect(result.id).to.eql(botId);

    });

  });

  after(() => {
    client.destroy();
  });

});

