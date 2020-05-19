const fetchedData = document.querySelector('.fetched-data').innerText;

const parsedData = JSON.parse(fetchedData);

const db = require('./db');

const dbData = db.fetchDatabase();

const curRoot = dbData.find(cur => cur.root === parsedData.root);


if(!curRoot) {
    dbData.push(parsedData);
    localStorage.setItem('our_database', JSON.stringify(dbData));
}
