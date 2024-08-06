import sqlite3 from 'sqlite3';

export function createTablePlayer() {
    const db = new sqlite3.Database('mydb.sqlite', (err) => {
        if (err) {
          console.error(err.message);
        }
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS player (
        username text PRIMARY KEY NOT NULL,
        mmr int NOT NULL,
        win int,
        lose int,
        games int,
        primary_role string NOT NULL,
        secondary_role string
    )`, [], err => {
        if(err) {
            console.error(err.message);
        }
    });

    db.close((err) => {
        if (err) {
          console.error(err.message);
        }
    });
}

export function createTableTeam1() {
    const db = new sqlite3.Database('mydb.sqlite', (err) => {
        if (err) {
          console.error(err.message);
        }
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS team1 (
        player text
    )`, [], err => {
        if(err) {
            console.error(err.message);
        }
    });

    db.close((err) => {
        if (err) {
          console.error(err.message);
        }
    });
}

export function createTableTeam2() {
    const db = new sqlite3.Database('mydb.sqlite', (err) => {
        if (err) {
          console.error(err.message);
        }
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS team2 (
        player text
    )`, [], err => {
        if(err) {
            console.error(err.message);
        }
    });

    db.close((err) => {
        if (err) {
          console.error(err.message);
        }
    });
}

export function createTableAchievements() {
    const db = new sqlite3.Database('mydb.sqlite', (err) => {
        if (err) {
          console.error(err.message);
        }
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS achievements (
        achievement_id SERIAL PRIMARY KEY,
        username text NOT NULL,
        achievement_name text NOT NULL,
        achievement_description text,
        date_achieved DATE NOT NULL,
        rarity text NOT NULL,
        emoji_reference text NOT NULL,
        FOREIGN KEY (username) REFERENCES player (username)
    )`, [], err => {
        if(err) {
            console.error(err.message);
        }
    });

    db.close((err) => {
        if (err) {
          console.error(err.message);
        }
    });
}

export function createTableSpec() {
    const db = new sqlite3.Database('mydb.sqlite', (err) => {
        if (err) {
          console.error(err.message);
        }
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS spec (
        username TEXT PRIMARY KEY
    )`, [], err => {
        if(err) {
            console.error(err.message);
        }
    });

    db.close((err) => {
        if (err) {
          console.error(err.message);
        }
    });
}