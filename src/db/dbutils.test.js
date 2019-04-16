const assert = require('assert');
const expect = require('chai').expect;

const DBName = 'DB_utils_test.sqlite3';
const DB = require('./DB').getConnection(DBName);
const DBUtils = require('./DBUtils');

const fs = require('fs');

describe(`DBUtils tests`, () => {
  
  describe(`setup function`, () => {

    it(`should create a new key/value table in the database`, async () => {
      await DBUtils.setup(DB);
      const result = await DB.get(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?`, ['store']);
      expect(result).to.eql({ name: 'store' });
    });

  });

  describe(`setItem function`, () => {

    before(async () => {
      await DBUtils.setup(DB);
    });

    it(`should set values to the store table`, async () => {
      await DBUtils.setItem({ DB, key: 'foo', value: 'bar', userId: null, serverId: null, channelId: null });
      const result = await DB.get(`SELECT value FROM store WHERE key = ?`, ['foo']);
      expect(result).to.eql({ value: 'bar' });
    });

    it(`should overwrite a value if a new value with the same key is set`, async () => {
      await DBUtils.setItem({ DB, key: 'uniqueKey', value: 'old value' });
      await DBUtils.setItem({ DB, key: 'uniqueKey', value: 'new value' });

      const result = await DB.get('SELECT value FROM store WHERE key = ?', ['uniqueKey']);
      expect(result.value).to.equal('new value');
    });

  });

  describe(`getItem function`, () => {

    before(done => {
      DBUtils.setup(DB);

      const items = [
        { key: 'abcd', value: 'efgh' }, 
        { key: 'aaaa', value: 'foobar', userId: '0000' },
        { key: 'aaab', value: 'baz', serverId: '0001' },
        { key: 'aaac', value: 'zzzz', serverId: '0001', channelId: '0002' }
      ];

      const itemInserts = items.map(({ key, value, userId, serverId, channelId }) => {
        return DB.run(`
          INSERT INTO store (
          user_id,
          server_id,
          channel_id,
          key,
          value
        ) VALUES (
          ?, ?, ?, ?, ?
        )
        `, [userId, serverId, channelId, key, value]);
      });

      Promise.all(itemInserts)
        .then(() => done());
    });

    it(`should get an item from the store table`, async () => {
      const result = await DBUtils.getItem({ DB, key: 'abcd' });
      expect(result.value).to.equal('efgh');
    });

    it(`should get an item from the store table given a key and a specific userId`, async () => {
      const result = await DBUtils.getItem({ DB, key: 'aaaa', userId: '0000' });
      expect(result.value).to.equal('foobar');
    });

    it(`should get an item from the store table given a key and a specific serverId`, async () => {
      const result = await DBUtils.getItem({ DB, key: 'aaab', serverId: '0001' });
      expect(result.value).to.equal('baz');
    });

    it(`should get an item from the store table given a key and a specific channelId`, async () => {
      const result = await DBUtils.getItem({ DB, key: 'aaac', channelId: '0002' });
      expect(result.value).to.equal('zzzz');
    });

  });

  after(() => {
    fs.unlinkSync(`./${DBName}`);
  })
});