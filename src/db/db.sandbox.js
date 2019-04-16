const DB_name = 'test_DB_aaaa.sqlite3';
const DB = require('./DB').getConnection(DB_name);

const tableNamePeople = `people`;

function init() {
  return DB.run(`
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
      DB.run(`
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
    DB.all(query, [28, null])
    .then(results => console.log(results))
    .catch(`Failed to insert......`);
  });


