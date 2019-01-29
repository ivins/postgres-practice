const pg = require('pg');
const settings = require('./settings'); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

const userInput = process.argv.slice(2)[0];

client.connect();

client.query("SELECT * FROM famous_people WHERE first_name=$1 OR last_name=$1", [userInput], (err, res) => {
  if (err) {
    console.log('Error', err);
    return false;
  }

  if (res.rows.length) {
    console.log(`Found ${res.rows.length} person(s) by the name ${userInput}:`);
    res.rows.forEach((person, index) => {
      const date = person.birthdate.toISOString().slice(0, 10);
      console.log(`-${index + 1}: ${person.first_name} ${person.last_name}, born '${date}'`);
    });
  } else {
    console.log('No results found');
  }
  client.end();
});
