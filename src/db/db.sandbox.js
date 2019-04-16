const db_name = 'test_db_aaaa.sqlite3';
const db = require('./db').getConnection(db_name);

const tableNamePeople = `people`;

function init() {
  return db.run(`
    CREATE TABLE
    IF NOT EXISTS
    ${tableNamePeople} (
      name TEXT,
      age INTEGER,
      food TEXT,
      profession TEXT
    )
  `);
};

init()
  .then(() => {
    const bob = {
      name: 'Bob',
      age: 25,
      food: 'Taco',
      profession: 'Professor'
    };

    const jenny = {
      name: 'Jenny',
      age: 28,
      food: 'Sushi',
      profession: 'Musician'
    };

    const jim = {
      name: 'Jim',
      age: 24,
      food: 'Cheesesteak',
      profession: 'Lumberjack'
    };

    const people = [bob, jenny, jim];

    function addPerson({ name, age, food, profession }) {
      db.run(`
        INSERT INTO ${tableNamePeople} (
          name,
          age,
          food,
          profession
        )
        VALUES (
          ?,
          ?,
          ?,
          ?
        )
      `, [name, age, food, profession]);
    }

    const addedPersons = people.map(person => addPerson(person));
    return Promise.all(addedPersons);
  })
  .then(addedPersons => {
    const foo = null;
    const query = `
      SELECT *
      FROM ${tableNamePeople}
      WHERE age = ? ${foo != null ? 'AND food = ?' : ''}
    `;
    console.log(query);
    db.all(query, [28, null])
    .then(results => console.log(results))
    .catch(`Failed to insert......`);
  });


