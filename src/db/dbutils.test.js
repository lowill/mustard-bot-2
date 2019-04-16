const assert = require('assert');
const expect = require('chai').expect;

const dbName = 'db_utils_test.sqlite3';
const db = require('./db').getConnection(dbName);
const dbutils = require('./dbutils');

const fs = require('fs');

describe(`dbutils tests`, () => {
  
  describe(`setup function`, () => {

    it(`should create a new key/value table in the database`, async () => {
      await dbutils.setup(db);
      const result = await db.get(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?`, ['store']);
      expect(result).to.eql({ name: 'store' });
    });

  });

  describe(`setItem function`, () => {

    before(async () => {
      await dbutils.setup(db);
    });

    it(`should set values to the store table`, async () => {
      await dbutils.setItem({ db, key: 'foo', value: 'bar', userId: null, serverId: null, channelId: null });
      const result = await db.get(`SELECT value FROM store WHERE key = ?`, ['foo']);
      expect(result).to.eql({ value: 'bar' });
    });

    it(`should overwrite a value if a new value with the same key is set`, async () => {
      await dbutils.setItem({ db, key: 'uniqueKey', value: 'old value' });
      await dbutils.setItem({ db, key: 'uniqueKey', value: 'new value' });

      const result = await db.get('SELECT value FROM store WHERE key = ?', ['uniqueKey']);
      expect(result.value).to.equal('new value');
    });

  });

  describe(`getItem function`, () => {

    before(done => {
      dbutils.setup(db);

      const items = [
        { key: 'abcd', value: 'efgh' }, 
        { key: 'aaaa', value: 'foobar', userId: '0000' },
        { key: 'aaab', value: 'baz', serverId: '0001' },
        { key: 'aaac', value: 'zzzz', serverId: '0001', channelId: '0002' }
      ];

      const itemInserts = items.map(({ key, value, userId, serverId, channelId }) => {
        return db.run(`
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
      const result = await dbutils.getItem({ db, key: 'abcd' });
      expect(result.value).to.equal('efgh');
    });

    it(`should get an item from the store table given a key and a specific userId`, async () => {
      const result = await dbutils.getItem({ db, key: 'aaaa', userId: '0000' });
      expect(result.value).to.equal('foobar');
    });

    it(`should get an item from the store table given a key and a specific serverId`, async () => {
      const result = await dbutils.getItem({ db, key: 'aaab', serverId: '0001' });
      expect(result.value).to.equal('baz');
    });

    it(`should get an item from the store table given a key and a specific channelId`, async () => {
      const result = await dbutils.getItem({ db, key: 'aaac', channelId: '0002' });
      expect(result.value).to.equal('zzzz');
    });

  });

  after(() => {
    fs.unlinkSync(`./${dbName}`);
  })
});