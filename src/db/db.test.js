const assert = require('assert');
const expect = require('chai').expect;

const testDBName = 'mustard_bot_test.sqlite3';
const DB = require('./DB').getConnection(testDBName);
const fs = require('fs');

describe(`DB tests`, () => {

  it(`should create a sqlite3 database`, () => {
    fs.exists(`./${testDBName}`, exists => {
      assert.equal(exists, true);
    });
  });

  describe(`run function`, () => {

    const tableNameTest = 'test';

    it(`should be able to create tables via the run function`, async () => {

      await DB.run(`
        CREATE TABLE
        IF NOT EXISTS
        ${tableNameTest} (
          name TEXT
        )
      `);

      const existingTable = await DB.get(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?`, [tableNameTest]);

      expect(existingTable).to.eql({ name: 'test' });

    });

  });

  describe(`get function`, () => {

    const tableNameGetTest = 'test_get';
    const bob = {
      name: 'Bob',
      age: 25
    };

    before(async () => {

      await DB.run(`
        CREATE TABLE
        IF NOT EXISTS
        ${tableNameGetTest} (
          name TEXT,
          age INTEGER
        )
      `);

      await DB.run(`
        INSERT INTO
        ${tableNameGetTest} (
          name,
          age
        )
        VALUES (
          ?,
          ?
        )
      `, [bob.name, bob.age]);
    });

    it(`should be able to query the database for a row`, async () => {

      const result = await DB.get(`
        SELECT *
        FROM ${tableNameGetTest}
        WHERE name = ?
      `, [bob.name]);

      expect(result).to.eql({ name: 'Bob', age: 25 });

    });

  });

  describe(`all function`, () => {

    const tableNameAllTest = 'test_all';

    before(async () => {

      await DB.run(`
        CREATE TABLE
        IF NOT EXISTS
        ${tableNameAllTest} (
          name TEXT,
          birth_year INTEGER
        )
      `);

      const people = [{
        name: 'Bob',
        birth_year: 1995
      }, {
        name: 'Alice',
        birth_year: 1995
      }, {
        name: 'Jane',
        birth_year: 1995
      }, {
        name: 'John',
        birth_year: 2001
      }];

      const addPerson = ({ name, birth_year }) => 
        DB.run(`INSERT INTO ${tableNameAllTest} ( name, birth_year ) VALUES ( ?, ?)`, [name, birth_year]);

      await Promise.all(people.map(addPerson));

    });

    it(`should be able to query the name for multiple rows`, async () => {

      const result = await DB.all(`
        SELECT name
        FROM ${tableNameAllTest}
        WHERE birth_year = ?
      `, [1995]);

      expect(result).to.have.length(3);

    });

  });

  describe(`close method`, () => {
    it(`should close the connection without an error`, async () => {
      expect(DB.close).to.not.throw();
    });

    it(`should really be closed`, async () => {
      await DB.run(`CREATE TABLE IF NOT EXISTS test_close ( name TEXT )`)
        .catch(err => expect(err).to.be.an('error'));
    })
  })

  after(() => {
    try {
      fs.unlinkSync(`./${testDBName}`);
    } catch(err) {
      console.error(`Failed to cleanup test database ${testDBName}`);
    }
  });

});

