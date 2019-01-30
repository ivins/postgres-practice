const settings = require('./settings'); // settings.json

const knex = require('knex')({
  client   : 'pg',
  connection: {
    user     : settings.user,
    password : settings.password,
    database : settings.database,
    host     : settings.hostname,
    port     : settings.port,
    ssl      : settings.ssl
  }
});

//CODE BELOW HERE

const data = process.argv.slice(2)[0];


function findPerson (client, data) {
  const query = knex('famous_people')
    .where('first_name', 'like', data).orWhere('last_name', 'like', data);

  query
    .asCallback((err, rows) => {
      if (err) {
        console.log('Error', err);
        return false;
      }
      console.log(`Found ${rows.length} person(s) by the name ${data}:`);
      rows.forEach((person, index) => {
        const date = person.birthdate.toISOString().slice(0, 10);
        console.log(`-${index + 1}: ${person.first_name} ${person.last_name}, born '${date}'`);
      });
    })
    .finally(() => knex.destroy());
}

findPerson(knex, data);
