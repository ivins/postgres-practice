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

const data = process.argv.slice(2)[0];

client.connect();

function doQuery(client, query, values, cb) {
  client.query(query, values, (err, res) => {
    if (err) {
      console.log('Error', err);
      return false;
    }
    if (res.rows.length) {
      console.log(`Found ${res.rows.length} person(s) by the name ${values}:`);
      res.rows.forEach(cb);
    } else {
      console.log('No results found');
    }
    client.end();
  });
}

function findPerson (client, data) {
  const query = "SELECT * FROM famous_people WHERE first_name=$1 OR last_name=$1";
  const values = [data];

  doQuery(client, query, values, (person, index) => {
    const date = person.birthdate.toISOString().slice(0, 10);
    console.log(`-${index + 1}: ${person.first_name} ${person.last_name}, born '${date}'`);
  });
}

// findPerson(client, data);
