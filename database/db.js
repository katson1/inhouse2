import sqlite3 from 'sqlite3';

export function createTablePlayer() {
    const db = new sqlite3.Database('mydb.sqlite', (err) => {
        if (err) {
          console.error(err.message);
        }
        //console.log('Connected to the mydb.sqlite database.');
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS player (
        username text PRIMARY KEY NOT NULL,
        mmr int NOT NULL,
        win int,
        lose int,
        games int
    )`, [], err => {
        if(err) {
            console.error(err.message);
        } else {
            //console.log("Table 'player' created or already exists.");
        }
    });

    db.close((err) => {
        if (err) {
          console.error(err.message);
        }
        //console.log('Database connection closed.');
    });
}