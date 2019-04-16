const assert = require('assert');
const expect = require('chai').expect;

const testDbName = 'mustard_bot_test.sqlite3';
const db = require('./db').getConnection(testDbName);
const fs = require('fs');

describe(`db tests`, () => {

  it(`should create a sqlite3 database`, () => {
    fs.exists(`./${testDbName}`, exists => {
      assert.equal(exists, true);
    });
  });

  describe(`run function`, () => {

    const tableNameTest = 'test';

    it(`should be able to create tables via the run function`, async () => {

      await db.run(`
        CREATE TABLE
        IF NOT EXISTS
        ${tableNameTest} (
          name TEXT
        )
      `);

      const existingTable = await db.get(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?`, [tableNameTest]);

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

      await db.run(`
        CREATE TABLE
        IF NOT EXISTS
        ${tableNameGetTest} (
          name TEXT,
          age INTEGER
        )
      `);

      await db.run(`
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

      const result = await db.get(`
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

      await db.run(`
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
        db.run(`INSERT INTO ${tableNameAllTest} ( name, birth_year ) VALUES ( ?, ?)`, [name, birth_year]);

      await Promise.all(people.map(addPerson));

    });

    it(`should be able to query the name for multiple rows`, async () => {

      const result = await db.all(`
        SELECT name
        FROM ${tableNameAllTest}
        WHERE birth_year = ?
      `, [1995]);

      expect(result).to.have.length(3);

    });

  });

  describe(`close method`, () => {
    it(`should close the connection without an error`, async () => {
      expect(db.close).to.not.throw();
    });

    it(`should really be closed`, async () => {
      await db.run(`CREATE TABLE IF NOT EXISTS test_close ( name TEXT )`)
        .catch(err => expect(err).to.be.an('error'));
    })
  })

  after(() => {
    try {
      fs.unlinkSync(`./${testDbName}`);
    } catch(err) {
      console.error(`Failed to cleanup test database ${testDbName}`);
    }
  });

});

