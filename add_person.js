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

const [first, last, date] = process.argv.slice(2);

function addPerson (first, last, date) {
  knex
    .insert({ first_name: first, last_name: last, birthdate: date })
    .into('famous_people')
    .asCallback((err, rows) => {
      if (err) { console.log(err); }
      console.log('Added successfully: ', first, last, date);
    });
}

addPerson(first, last, date);
